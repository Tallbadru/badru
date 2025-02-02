import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Dashboard.css';
import Header from '../Component/Header';
import Sidebar from '../Component/Sidebar';
import Footer from '../Component/Footer';
import Modal from '../Component/Modal';
import Swal from 'sweetalert2';

const Home = () => {
  const [bookings, setBookings] = useState([]);
  const [properties, setProperties] = useState([]);
  const [showModal, setShowModal] = useState(false);

  // Fetch properties and bookings when the component mounts
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/property/');
        setProperties(response.data);
      } catch (error) {
        console.error('Error fetching properties:', error);
      }
    };

    const fetchBookings = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/booking/');
        setBookings(response.data);
      } catch (error) {
        console.error('Error fetching bookings:', error);
      }
    };

    fetchProperties();
    fetchBookings();
  }, []);

  // Show the booking modal
  const handleBookProperty = () => setShowModal(true);

  // Close the modal
  const handleModalClose = () => setShowModal(false);

  // Handle the form submission to create a new booking
  const handleSubmitBooking = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newBooking = {
      property_id: formData.get('property_id'),
      tenant_name: formData.get('tenant_name'),
      booking_date: formData.get('booking_date'), // Get booking date value
    };

    try {
      // Send booking data to backend
      await axios.post('http://127.0.0.1:8000/api/booking/', newBooking);
      setShowModal(false);

      // Refresh bookings and properties
      const updatedBookings = await axios.get('http://127.0.0.1:8000/api/booking/');
      const updatedProperties = await axios.get('http://127.0.0.1:8000/api/property/');
      setBookings(updatedBookings.data);
      setProperties(updatedProperties.data);

      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Property booked successfully!',
      });
    } catch (error) {
      console.error('Error creating booking:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to book the property. Please try again.',
      });
    }
  };

  // Get property details by id
  const getPropertyDetails = (propertyId) => {
    const property = properties.find((prop) => prop.id === propertyId);
    return property ? { room_no: property.room_no, type: property.type } : { room_no: 'Unknown', type: 'Unknown' };
  };

  return (
    <div className="dashboard">
      <Sidebar />
      <div className="main">
        <Header />
        <div className="dashboard__content">
          <h1 className="dashboard__title">Tenant Dashboard</h1>

          {/* Book Property Section */}
          <div className="dashboard__section">
            <h2>Book a Property</h2>
            <button className="dashboard__button" onClick={handleBookProperty}>
              Book New Property
            </button>
          </div>

          {/* View and Manage Bookings Section */}
          <div className="dashboard__section">
            <h2>Your Bookings</h2>
            {bookings.length > 0 ? (
              <table className="dashboard__table">
                <thead>
                  <tr>
                    <th>Room No</th>
                    <th>Type</th>
                    <th>Start Date</th>
                    <th>End Date</th>
                    <th>Price</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((booking) => {
                    const propertyDetails = getPropertyDetails(booking.property);
                    return (
                      <tr key={booking.id}>
                        <td>{propertyDetails.room_no}</td>
                        <td>{propertyDetails.type}</td>
                        <td>{booking.start_date}</td>
                        <td>{booking.end_date}</td>
                        <td>{booking.price}</td>
                        <td>{booking.status}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              <p>No bookings found.</p>
            )}
          </div>

          {/* Properties Section */}
          <div className="dashboard__section">
            <h2>Available Properties</h2>
            {properties.length > 0 ? (
              <table className="dashboard__table">
                <thead>
                  <tr>
                    <th>Room No</th>
                    <th>Type</th>
                    <th>Status</th>
                    <th>Price</th>
                  </tr>
                </thead>
                <tbody>
                  {properties.map((property) => (
                    <tr key={property.id}>
                      <td>{property.room_no}</td>
                      <td>{property.type}</td>
                      <td>{property.status}</td>
                      <td>{property.price}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No properties available.</p>
            )}
          </div>
        </div>
        <Footer />
      </div>

      {/* Modal for booking */}
      <Modal
        show={showModal}
        onClose={handleModalClose}
        onSubmit={handleSubmitBooking}
        properties={properties}
      />
    </div>
  );
};

export default Home;
