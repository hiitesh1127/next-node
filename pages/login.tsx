import type { NextPage } from 'next'
import Navbar from '../components/navbar'
import { useState } from 'react'
const Login: NextPage = () => {
  const [comments, setComments] = useState([])
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async() => {
    const user = {
      email,
      password
    }
    console.log(user)
    try {
      const response = await fetch('http://localhost:4500/auth/login', {
        method : 'POST',
        body : JSON.stringify(user),
        headers : {
          'Content-Type' : 'application/json'
        }
      });
      const data = await response.json()
      console.log(data)
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <>
    <Navbar />
    <div className='w-96 mx-auto mt-48 flex flex-col justify-around'>
      <input type = 'text' value = {email} className = "rounded p-2 m-4 border-2 border-slate-600" placeholder='email' onChange={(e) => setEmail(e.target.value)}/>
      <input type = 'password' value = {password} className = "rounded p-2 m-4 border-2 border-slate-600" placeholder='password' onChange={(e) => setPassword(e.target.value)}/>
      <button className = "rounded p-2 m-4 border-2 border-slate-600 hover:bg-gray-100" onClick={(handleSubmit)}>LOGIN</button>
    </div>
    </>
  )
}
export default Login
