import React from "react";
import { useState,useEffect } from "react";
import { supabase } from "../supabaseClient";
import "./History.css"
const History= ({currentUser, setNotesInfo,toggleSide,summarize,update,setupdate,setsummarize})=>{
    const LoadMain = (note) =>{
        setNotesInfo((prev)=>({...prev,
            id: note.id,
            notes: note.Notes,
            title: note.Title,
            summary: note.Summary
        }))
       
        setsummarize(true)
        setupdate(false)
    }

    const [notes,setNotes] = useState([])
    useEffect(()=>{
        if(!currentUser){
            return;
        }
        const loadHistory = async() =>{
            const {data,error} = await supabase
                .from("Posts")
                .select("*")
                .eq("user_id",currentUser.id)

              if(error){
            console.log("Error:",error.message)
        }
        else{
            setNotes(data)
        }

        }
      loadHistory();
    },[currentUser])

    const handleDelete = async(note) =>{
         setNotes((prev) => prev.filter((n) => n.id !== note.id));

        const {error} = await supabase
            .from("Posts")
            .delete()
            .eq("id",note.id)
            .eq("user_id",currentUser.id)

        if (error) {
            console.error("Error deleting note:", error.message);
            // rollback if failed
            setNotes((prev) => [...prev, note]);
  }

    }
    return(
        <>
            <div className="button_contain">
                <button className='history' onClick={toggleSide}>🕓</button> 
            </div>
            <h2 className="bar-header">History </h2>
            {notes && notes.length > 0 ?(
                notes.map((note,index)=>(
                    <div className="buttons-container" key={note.id}>
                    <button
                        type="submit"
                        className="history-button"
                        onClick={()=>LoadMain(note)}
                        >
                        {note.Title.length > 15 ? note.Title.slice(0, 15) + "..." : note.Title}</button>
                        
                        <button type="button" className="x" onClick={()=>handleDelete(note)}>x</button>
                      
                        <br></br>
                    </div>
                        
                        
                ))
            ):( 
                <div>
                    <h3>You haven't made    any summaries yet</h3>
                </div>
            )}
            
        </>
    )
}

export default History