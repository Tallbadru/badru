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
  });

  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState(tenant);
  const [isNewTenant, setIsNewTenant] = useState(true);

  // Fetch tenant information when the component mounts
  useEffect(() => {
    const fetchTenant = async () => {
      try {
        const response = await axios.get(`${baseUrl}/tenant/1`); // Assuming tenant ID is 1
        if (response.data) {
          setTenant(response.data);
          setFormData(response.data);
          setIsNewTenant(false);
        }
      } catch (error) {
        console.error('Error fetching tenant data:', error);
      }
    };

    fetchTenant();
  }, []);

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
      if (isNewTenant) {
        // Save the new tenant data
        const response = await axios.post('http://127.0.0.1:8000/api/tenant/', formData);
        setTenant(response.data);
        setIsNewTenant(false);
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Tenant information added successfully!',
          confirmButtonText: 'OK',
        });
      } else {
        // Update the existing tenant data
        await axios.put(`http://127.0.0.1:8000/api/tenant/1`, formData); // Assuming tenant ID is 1
        setTenant(formData);
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Tenant information updated successfully!',
          confirmButtonText: 'OK',
        });
      }
      setEditing(false);
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