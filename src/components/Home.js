import React from 'react'
import Form from "./Forms"
import Reviews from "./Reviews"
import ProjectsSection from './Projects'
import LectureClipsSection from './Lectureclips'
const Home = () => {
  return (
    <div className='bg-dark' >
        <Form/>
        <div className='h-50 '><Reviews/></div>
        <div className='h-50 '><ProjectsSection/></div>
        <div className='h-50 '><LectureClipsSection/></div>

        
    </div>
  )
}

export default Home