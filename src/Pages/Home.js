import React from 'react'
import '../App.css'
import Header from '../Component/Header'
import MainContent from '../Component/MainContent'
import Sidebar from '../Component/Sidebar'
import Footer from '../Component/Footer'
const Home = () => {
  return (
 
    <div className="dashboard">
    <Sidebar />
    <div className="main">
      <Header />
      <MainContent />
      <Footer />
    </div>
  </div>
  )
}
export default Home
