import { useEffect,useState } from "react";
import { useNavigate } from "react-router-dom";
import {supabase} from './supabaseClient'


const Protected = ({children}) => {
    const [loading,setloading] = useState(true);
    const [authenticated,setauthenticated] = useState(false);
    const navigate = useNavigate();

    useEffect(()=>{
        const checkUser =async () => {
            const {data,error} = await supabase.auth.getUser();
            if(error||!data.user){
                navigate('/');
            }
            else{
                setauthenticated(true);
            }
            setloading(false);
        }
        checkUser();
    },[navigate]);


    if (loading) return <p>Loading...</p>
    return authenticated ? children : null;
};

export default Protected