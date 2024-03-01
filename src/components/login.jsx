import React, {useState, useContext} from "react"
import {useNavigate} from 'react-router-dom'
import {login} from '../services/login'
import Cookies from 'js-cookie'
import { AuthContext } from '../utils/authContext';

const Login = () => {
  
  const navigate = useNavigate()
  const {username,setUsername} = useContext(AuthContext)
  const [password,setPassword] = useState(null)
  const [alert,setAlert] = useState(false)

  const onSubmitHandler =  async (e) =>
  {
    e.preventDefault();
    const result = await login({username, password});
    if (result.status === 200) {
      Cookies.set('tokenConnect', result.data,{expires:1})
      navigate('/newsfeed')
    } else if (result.status === 401) {
      setAlert(true);
      setPassword('');
      setUsername('');
      setTimeout(() => {
        setAlert(false);
      }, 5000);
    }
      
  }
    
  return (
    <div class = 'flex max-h-screen h-full'>
      <img class= 'w-[50%]' src={'/social.jpeg'} alt="Example" />
      <div className="flex flex-col items-center justify-center bg-slate-50 h-full w-full">
        {alert ? <div class="transition-opacity duration-500 ease-in-out opacity-100 bg-red-100 border-t-4 border-red-500 rounded-lg text-red-900 px-4 py-3 shadow-md mb-1.5 w-[25%] h-[8%]" role="alert">
          <div class="flex">
            <div class="py-1 "><svg class="fill-current h-6 w-6 text-red-500 mr-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z"/></svg></div>
            <div>
              <p class="font-bold">Invalid username or password</p>
              <p class="text-sm">Please try to login again</p>
            </div>
          </div>
        </div> :
        <div className="opacity-0 h-[8%]  mb-1.5" />
        }
      <div className="flex flex-col bg-white justify-center items-start rounded-lg shadow-lg h-[40%] w-[45%] mb-24">
        {/*<h1 className='flex h-[20%] justify-start font-roboto text-blue-500 font-medium text-5xl mt-10 ml-10'>Login</h1>*/}
        {/* <div className='flex w-full justify-center'> */}
          {/* <img className='mt-10' src="logo.png" alt="FP logo" width="200" height="150"/> */}
        {/* </div> */}
        <form className='flex flex-col justify-center w-full h-full p-10' onSubmit={onSubmitHandler}>
            
            <div className="flex flex-col mb-3">
                <div className='flex mb-2'>
                  <img src='/logov3.png' alt='logo' width = "30" />
                </div>
                <label htmlFor="username" className="h-6 font-medium text-gray-700 text-2xl pt-0.5 mr-2 mb-4 pl-0.5">
                  Username
                </label>
                <input type="username" id="username" value = {username} className="text-gray-700 text-2xl pt-0.5 border-2 rounded-md w-full border-gray-600 pl-2" 
                  onChange={({target}) => setUsername(target.value)}
                required/>
            </div> 
            <div className="mb-8">
                <label htmlFor="password" class="h-6 font-medium text-gray-700 text-xl pt-0.5 mr-2 mb-2 pl-0.5">
                  Password
                </label>
                <input type="password" id="password" value = {password} class="text-gray-700 text-2xl pt-0.5 border-2 rounded-md w-full border-gray-600 pl-2" 
                  onChange={({target}) => setPassword(target.value)}
                  placeholder="•••••••••" required/>
            </div> 
                  
            <div className="flex justify-between">
              <a className='pl-1 font-roboto underline' href="/signup">
                  Sign Up?
              </a>
              <button type="submit" className="bg-[#eb580a]  hover:bg-[#ff9f4b] text-white font-bold py-1 px-4 h-9 rounded " >
                Submit
              </button>
            </div>
          
        </form>
        

      </div>
      </div>
    </div>

  )
  }

  export default Login;