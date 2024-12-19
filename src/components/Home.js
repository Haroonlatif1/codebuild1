import React from 'react'
import Form from "./Forms"
import Reviews from "./Reviews"
const Home = () => {
  return (
    <div className='bg-dark'>
        <Form/>
        <div className='h-50 '><Reviews/></div>
        
    </div>
  )
}

export default Home