import React from 'react';
import "./../App.css"

const TenantMainContent = () => {
  return (
    <div className="tenant-management__main-content">
      <h1 className="tenant-management__header">Tenant Management</h1>

      {/* Search Bar */}
      <div className="tenant-management__search-container">
        <input
          type="text"
          className="tenant-management__search-input"
          placeholder="Search tenants..."
        />
      </div>

      {/* Add Tenant Form */}
      <form className="tenant-management__form">
        <div>
          <label>Name</label>
          <input type="text" className="tenant-management__input" />
        </div>
        <div>
          <label>Contact Info</label>
          <input type="text" className="tenant-management__input" />
        </div>
        <div>
          <label>Lease Details</label>
          <textarea className="tenant-management__input"></textarea>
        </div>
        <button type="submit" className="tenant-management__button">
          Add Tenant
        </button>
      </form>

      {/* Tenant List */}
      <ul className="tenant-management__list">
        <li className="tenant-management__list-item">
          <span>John Doe</span>
          <div>
            <button>Edit</button>
            <button>Delete</button>
          </div>
        </li>
        <li className="tenant-management__list-item">
          <span>Jane Smith</span>
          <div>
            <button>Edit</button>
            <button>Delete</button>
          </div>
        </li>
      </ul>
    </div>
  );
};

export default TenantMainContent;
