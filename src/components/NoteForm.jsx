import React from "react";
import { useState } from "react";
import { supabase } from "../supabaseClient";
const ACCESS_KEY = import.meta.env.VITE_APP_ACCESS_KEY;


const NoteForm = ({ currentUser,notesInfo, setNotesInfo, onSubmit, loading , setLoading, summarize, update}) => {
    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit();
  };
    
    const handleUpdate = async(e) =>{
        e.preventDefault()

         if (!currentUser) {
            console.log("No logged-in user, cannot submit note");
            return;
        }

        if(notesInfo.title === '' || notesInfo.notes === ''){
            return;
        }

        else{
                
                if(notesInfo.notes.length < 50){
                  let summaryText = notesInfo.notes
                   const updatedNote = {
                ...notesInfo,
                summary: summaryText,
              };
                setNotesInfo(updatedNote);
                
                const {data:insert ,error:insert_error} = await supabase
                  .from("Posts")
                  .update({Title:notesInfo.title,Notes:notesInfo.notes, Summary:updatedNote.summary, user_id:currentUser.id})
                  .eq("id",notesInfo.id)
                  .eq('user_id',currentUser.id)
              if(insert_error){
                console.log(insert_error.message)
                console.log(currentUser.id)
                console.log(supabase.auth.getUser().id)
              }
              else{
                console.log("inserted")
              }
              return;
                }
                else{
              setLoading(true);
              try{
              const response = await fetch(
                "https://api-inference.huggingface.co/models/facebook/bart-large-cnn",
                {
                  method: "POST",
                  headers: {
                    Authorization: `Bearer ${ACCESS_KEY}`,
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    inputs: notesInfo.notes,
                    parameters: {
                    min_length: 150,
                    do_sample: false, //smoother text
                    max_length: 300, // optional but useful
                    temperature:1.0, //controls creativity/fluency
                    top_p: 0.9, //helps text sound less robotic
                    repetition_penalty: 1.2, //prevents repetitive phrasing  
                },
                    options: {
                      wait_for_model: true //waits for model to load before making request/give response
                  }
                  }),
                }
              
              );
        
              const data = await response.json();
              let summaryText = data[0]?.summary_text || "No summary found.";
              summaryText = summaryText
                  .replace(/\/\/+/g, ' \n  -')
                  .replace(/\/\/+/g, '\n')            // replace // with newline
                  .replace(/:(\s*)/g, ': \n')         // keep colon, add newline
                  .split(/(?<=[.?!])/g)                // split at sentence endings
                  .map(line => `• ${line.trim()}\n`)  // prepend bullet and newline
                  .join('\n')                          // join all lines
                  .split('\n')
                  .filter(line => line.length > 1)     // remove empty/tiny lines
                  .join('\n\n');                       // join with extra newline for spacing
        
                  
              const updatedNote = {
                ...notesInfo,
                summary: summaryText,
              };
        
              
              setNotesInfo(updatedNote);
             
              //insert to supabase here
                
            
              const {data:insert ,error:insert_error} = await supabase
                .from("Posts")
                .update({Title:notesInfo.title,Notes:notesInfo.notes, Summary:updatedNote.summary, user_id:currentUser.id})
                .eq("id",notesInfo.id)
                .eq('user_id',currentUser.id)
              if(insert_error){
                console.log(insert_error.message)
                console.log(currentUser.id)
                console.log(supabase.auth.getUser().id)
              }
              else{
                console.log("inserted")
              }
            }catch (error){
              console.error("Error fetching summary:", error);
              setNotesInfo((prev) => ({
                ...prev,
                summary: "Error getting summary.",
              }));
            }finally{
              setLoading(false);     
            }
          }
          }
    }
    return(
        <>
        <form>
           
            <input 
            className="input__title"
            type="text" 
            required 
            placeholder="Header"
             value={notesInfo.title}
            onChange={(e) =>
              setNotesInfo((prev) => ({ ...prev, title: e.target.value}))
            }
            />
            <textarea 
            className="input__content"  
            required  
            maxLength={4000}
            placeholder="Your notes here..."
            value={notesInfo.notes}
            onChange={(e) =>
              setNotesInfo((prev) => ({ ...prev, notes: e.target.value }))
            }
           
            />
            <div className="">
                 <button 
            className="button_summ" 
            type="submit" 
            onClick={onSubmit}
            disabled={loading || summarize}>
                    Summarize!
            </button>
                <button
                    className="button_update"
                    type="submit"
                    onClick={handleUpdate}
                    disabled={update}
                >
                    Update
                </button>
            <button
                className="clear"
                type="button"
                onClick={() =>
                    setNotesInfo({ id: "", title: "", notes: "", summary: "" })
                 }
            disabled={loading}
                >
                    Clear
            </button>
            </div>
           
            </form>
        </>
    )
    
};


export default NoteForm