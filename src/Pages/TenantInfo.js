import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import Header from '../Component/Header';
import Sidebar from '../Component/Sidebar';
import Footer from '../Component/Footer';

const baseUrl = process.env.REACT_APP_BACKEND_URL;

const Profile = () => {
  const [tenant, setTenant] = useState({
    name: '',
    contact_info: '',
    email: '',
    username: '',
    password: '', // Keep password for editing purposes
  });

  const [editing, setEditing] = useState(false); // Start in non-editing mode
  const [formData, setFormData] = useState(tenant);
  const [tenantId, setTenantId] = useState(null);

  // Fetch tenant information when the component mounts
  useEffect(() => {
    const fetchTenant = async () => {
      try {
        // Fetch the session to get the logged-in tenant's ID
        const sessionResponse = await axios.get(`${baseUrl}/session`); // Adjust this URL to match your backend's session endpoint
        const tenantIdFromSession = sessionResponse.data.tenant_id;

        if (tenantIdFromSession) {
          setTenantId(tenantIdFromSession);
          // Fetch tenant data using the tenant ID
          const response = await axios.get(`${baseUrl}/tenant/${tenantIdFromSession}/`);
          if (response.data) {
            setTenant(response.data);
            setFormData(response.data);
          }
        } else {
          console.error('Tenant ID not found in session.');
        }
      } catch (error) {
        console.error('Error fetching tenant data:', error);
      }
    };

    fetchTenant();
  }, []); // Empty dependency array to run only once when the component mounts

  // Handle editing mode toggle
  const handleEditClick = () => {
    setEditing(true);
  };

  const handleCancelEdit = () => {
    setEditing(false);
    setFormData(tenant); // Reset to original tenant data
  };

  const handleSaveEdit = async () => {
    try {
      // Update the existing tenant data
      if (tenantId) {
        await axios.put(`http://127.0.0.1:8000/api/tenant/${tenantId}/`, formData); // PUT request to update tenant data
        setTenant(formData);
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Tenant information updated successfully!',
          confirmButtonText: 'OK',
        });
        setEditing(false);
      }
    } catch (error) {
      console.error('Error saving tenant data:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to save tenant information. Please try again.',
        confirmButtonText: 'OK',
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  return (
    <div className="profile">
      <Sidebar />
      <div className="main">
        <Header />
        <div className="profile__content">
          <h1 className="profile__header">Tenant Profile</h1>

          <div className="profile__details">
            {/* Name Field */}
            <div className="profile__info">
              <label>Name</label>
              {editing ? (
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="profile__input"
                />
              ) : (
                <span>{tenant.name}</span>
              )}
            </div>

            {/* Contact Info Field */}
            <div className="profile__info">
              <label>Contact Info</label>
              {editing ? (
                <input
                  type="text"
                  name="contact_info"
                  value={formData.contact_info}
                  onChange={handleChange}
                  className="profile__input"
                />
              ) : (
                <span>{tenant.contact_info}</span>
              )}
            </div>

            {/* Email Field */}
            <div className="profile__info">
              <label>Email</label>
              {editing ? (
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="profile__input"
                />
              ) : (
                <span>{tenant.email}</span>
              )}
            </div>

            {/* Username Field */}
            <div className="profile__info">
              <label>Username</label>
              {editing ? (
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="profile__input"
                />
              ) : (
                <span>{tenant.username}</span>
              )}
            </div>

            {/* Password Field */}
            <div className="profile__info">
              <label>Password</label>
              {editing ? (
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="profile__input"
                />
              ) : (
                <span>********</span> // Display "****" for password
              )}
            </div>
          </div>

          <div className="profile__buttons">
            {editing ? (
              <>
                <button onClick={handleSaveEdit} className="profile__button save">
                  Save
                </button>
                <button onClick={handleCancelEdit} className="profile__button cancel">
                  Cancel
                </button>
              </>
            ) : (
              <button onClick={handleEditClick} className="profile__button edit">
                Edit Profile
              </button>
            )}
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default Profile;
