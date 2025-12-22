      import { useState,useEffect } from 'react'
      import './Dashboard.css'
      import NoteForm from './components/NoteForm.jsx'
      import History from './components/History.jsx';
      import { supabase } from "./supabaseClient.js";


      const ACCESS_KEY = import.meta.env.VITE_APP_ACCESS_KEY;

      function Dashboard({currentUser}) {
    
      const [loading, setLoading] = useState(false);
      const [history, setHistory] = useState([]);
      const [sidemenu,setSideMenu] = useState(0);
      const [notesInfo,setNotesInfo] = useState({
        id:'',
        title:'',
        notes:'',
        summary:'',
        user_id:currentUser.id
      })
      const  [summarize,setsummarize] = useState(false)
      const  [update,setupdate] = useState(true)


        
        

      const handleSubmit = async (e) => {
        e.preventDefault()
      
        if (!currentUser) {
      console.log("No logged-in user, cannot submit note");
      return;
    }
        
        if(notesInfo.title === '' || notesInfo.notes === ''){

        }
        else{
          if(notesInfo.notes.length < 50){
            let summaryText = notesInfo.notes
            const updatedNote = {
          ...notesInfo,
          summary: summaryText,
        };
          setNotesInfo(updatedNote);
      setHistory((prev) => [...prev, updatedNote]);
          const {data:insert ,error:insert_error} = await supabase
            .from("Posts")
            .insert([{Title:notesInfo.title,Notes:notesInfo.notes, Summary:updatedNote.summary, user_id:currentUser.id}])
            .select()
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
        
        const response = await fetch("http://localhost:3000/summarize", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: notesInfo.notes })
        });

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
        setHistory((prev) => [...prev, updatedNote]);
        //insert to supabase here
          
      
        const {data:insert ,error:insert_error} = await supabase
          .from("Posts")
          .insert([{Title:notesInfo.title,Notes:notesInfo.notes, Summary:updatedNote.summary, user_id:currentUser.id}])
          .select()
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
      };


      const handleClear = () =>{
        setNotesInfo((prev) => ({ ...prev, 
          id:'',
          notes: '',
          title: '',
          summary: ''
        }))
      }
      const toggleSide = ()=>{
          setSideMenu(!sidemenu);
      }
      const handleLogOut = async() =>{
          const {error} = await supabase.auth.signOut()
          if (error) {
        console.error('Error logging out:', error.message)
      } else {
        console.log('Logged out successfully!')
        
        window.location.hash = '#/Login'
      }
      }

        return (
          <>
            {sidemenu?
            <div className='sidebar--expanded'>
              <History 
                currentUser={currentUser} 
                history={history} 
                toggleSide={toggleSide} 
                setNotesInfo={setNotesInfo}
                summarize={summarize}
                setsummarize={setsummarize}
                update={update}
                setupdate={setupdate}
                />
            </div>
            
                :
              <div className='sidebar'>
                <button className='history' onClick={toggleSide}>🕓</button>
              </div>

            }
            <div className='logout'><button type="button" onClick={handleLogOut}>Logout</button  ></div>

            <div className={`title ${sidemenu ? "content--shifted" : ""}`}>
                <h1>SummNotes</h1>
            </div>

            <div className={`content ${sidemenu ? "content--shifted" : ""}`}>
                <div className='note-form'>
                  <NoteForm 
                  currentUser={currentUser} 
                  notesInfo={notesInfo} 
                  setNotesInfo={setNotesInfo}
                  onSubmit={handleSubmit}
                  loading={loading}
                  setLoading={setLoading}
                  summarize={summarize}
                  update={update}
                  />
                  
                </div>
                <div className='summary'>
                  <textarea className='summ'
                    readOnly
                    value={notesInfo.summary}
                  />
                </div>

            </div>
            {loading && <div className='loading'>

            </div>
            }
            
          
          
          
          </>
        )
      }

      export default Dashboard
