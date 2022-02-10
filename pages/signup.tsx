import type { NextPage } from 'next'
import Navbar from '../components/navbar'
import { useState } from 'react'
const Signup: NextPage = () => {
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
      const response = await fetch('http://localhost:4500/auth/signup', {
        method : 'POST',
        body : JSON.stringify(user),
        headers : {
          'Content-Type' : 'application/json'
        }
      });
      const data = await response.json()
      console.log(data)
      console.log(response)
      if(response.status == 200) {
        setEmail('')
        setPassword('');
      }
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <>
    <Navbar />
    <div className='w-96 mx-auto mt-48 flex flex-col justify-around'>
      <input type = 'text' className = "rounded p-2 m-4 border-2 border-slate-600" value = {email} placeholder='email' onChange={(e) => setEmail(e.target.value)}/>
      <input type = 'password' className = "rounded p-2 m-4 border-2 border-slate-600" value = {password} placeholder='password' onChange={(e) => setPassword(e.target.value)}/>
      <button className = "rounded p-2 m-4 border-2 border-slate-600 hover:bg-gray-100" onClick={(handleSubmit)}>SIGNUP</button>
    </div>
    </>
  )
}

export default Signup
