    import { useState, useEffect } from "react";
    import { supabase } from "./supabaseClient";
    import Login from "./Login";
    import Dashboard from "./Dashboard";
    import Confirmation from "./Confirmation"
    import Signup from "./Signup"
    import { Route,Routes } from "react-router-dom";
    import Protected from "./Protected";
    import { Navigate } from "react-router-dom";

    function App() {
    const [currentUser, setCurrentUser] = useState(null);

    






    // Restore session on page load
    useEffect(() => {
        supabase.auth.getSession().then(({ data }) => {
        setCurrentUser(data.session?.user ?? null);
        });

        // Optional: subscribe to auth changes
        const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
        setCurrentUser(session?.user ?? null);
        });
        return () => listener.subscription.unsubscribe();
    }, []);

    return (
        <>
        <Routes>
            <Route path="/Login" element = {<Login setCurrentUser={setCurrentUser}/>}/>
            <Route path="/Signup" element ={<Signup/>}/>
            <Route path="/confirmation" element={<Confirmation/>}/>
            

            <Route path="/Dashboard" element={currentUser ? (<Dashboard currentUser={currentUser} />
                ) : (<Navigate to="/Login" replace />)}/>

            
            <Route path="*" element={<Navigate to={currentUser ? "/Dashboard" : "/Login"} replace />} />

        </Routes>
        
        </>
    );
    }

    export default App;