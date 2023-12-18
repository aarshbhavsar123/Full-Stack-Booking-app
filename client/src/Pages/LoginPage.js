import React ,{ useState,useContext } from 'react'
import {Link} from "react-router-dom";
import axios from 'axios';
import { Navigate } from 'react-router-dom';
import { UserContext } from '../UserContext.js';


const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [redirect,setRedirect] = useState(false);
  const {setUser} = useContext(UserContext);
  async function handleLogin(e) {
    e.preventDefault();
    try{
        const {data} = await axios.post('/login',{
          email,
          password,
    }
        );
        setUser(data);
        setRedirect(true);
      } 
    catch(e){
      console.log(e);
      alert("Login failed. Please try again later");
      
    }
  };
  if(redirect)
  {
    return (
        <Navigate to={"/"}/>      
    )
  }
  return (
    <div className="flex-col min-h-screen grow flex items-center justify-around">
      <div className="mb-64">
        <h1 className="text-4xl text-center mb-4 font-bold">Login</h1>
          <form  className="max-w-md mx-auto my-2 py-2" onSubmit={handleLogin}>
            <input type="email" placeholder='Enter your E-Mail address' value={email} onChange={(e) => setEmail(e.target.value)} required/>
            <input type="password" placeholder="Enter your Password" value={password} onChange={(e) => setPassword(e.target.value)} required/>
            <button className="primary">Login</button>
            <div className="text-center py-2 text-gray-500">
              Don't have an account yet?
              <Link to={'/register'} className="underline text-blue"> Register Now</Link>
            </div>
          </form>
          </div>
          
    </div>
  )
}
export default LoginPage
