import React from 'react';
import { FaHome, FaBuilding, FaMoneyBillWave, FaTools } from 'react-icons/fa'; // Importing icons
import '../App.css'
const Sidebar = () => {
  return (
    <div className="sidebar">
      <h2 className="sidebar__title">Babu Rental House</h2>
      <ul className="sidebar__menu">
        <li className="sidebar__menu-item">
          <FaHome className="sidebar__icon" />
         <a href='/Dashboard'>Dashboard</a> 
        </li>
        <li className="sidebar__menu-item">
          <FaBuilding className="sidebar__icon" />
          <a href='/properties'>Properties</a>    
        </li>
        {/* <li className="sidebar__menu-item">
          <FaUsers className="sidebar__icon" />
          <a href='/tenantInfo'>TenantsInfo</a>   
        </li> */}
        <li className="sidebar__menu-item">
          <FaMoneyBillWave className="sidebar__icon" />
          <a href='/rentPayments'>Rent Payments</a>  
        </li>
        <li className="sidebar__menu-item">
          <FaTools className="sidebar__icon" />
          <a href='/maintenance'>Maintenance</a>   
        </li>
        <li className="sidebar__menu-item">
          <FaTools className="sidebar__icon" />
          <a href='/logout'>Logout</a>   
        </li>
       
      </ul>
    </div>
  );
};

export default Sidebar;
