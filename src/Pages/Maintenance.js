import React, { useState, useEffect } from 'react';
import Header from '../Component/Header';
import Sidebar from '../Component/Sidebar';
import Footer from '../Component/Footer';
import axios from 'axios';
import Swal from 'sweetalert2';

const baseUrl = process.env.REACT_APP_BACKEND_URL;

const Maintenance = () => {
  const [requests, setRequests] = useState([]);
  const [properties, setProperties] = useState([]);
  const [newRequest, setNewRequest] = useState('');
  const [selectedProperty, setSelectedProperty] = useState('');

  // Fetch maintenance requests and properties from the API
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await axios.get(`${baseUrl}/maintenance/`);
        setRequests(response.data);
      } catch (error) {
        console.error('Error fetching maintenance requests:', error);
      }
    };

    const fetchProperties = async () => {
      try {
        const response = await axios.get(`${baseUrl}/property/`);
        setProperties(response.data);
      } catch (error) {
        console.error('Error fetching properties:', error);
      }
    };

    fetchRequests();
    fetchProperties();
  }, []);

  // Handle posting a new maintenance request
  const handlePostRequest = async () => {
    if (!newRequest.trim() || !selectedProperty) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Please enter a maintenance issue description and select a property!',
        confirmButtonText: 'OK',
      });
      return;
    }

    const newRequestData = {
      description: newRequest,
      status: 'Requested', // Default status for new requests
      tenant: 1, // Replace with the actual tenant ID
      property: selectedProperty, // Use the selected property ID
    };

    try {
      await axios.post(`${baseUrl}/maintenance/`, newRequestData);
      setRequests([...requests, newRequestData]); // Add the new request to the state
      setNewRequest(''); // Clear the input field
      setSelectedProperty(''); // Clear the selected property

      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Maintenance request submitted successfully!',
        confirmButtonText: 'OK',
      });
    } catch (error) {
      console.error('Error posting maintenance request:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to submit maintenance request. Please try again.',
        confirmButtonText: 'OK',
      });
    }
  };

  // Get property room_no by property ID
  const getPropertyRoomNo = (propertyId) => {
    const property = properties.find((prop) => prop.id === propertyId);
    return property ? property.room_no : '';
  };

  return (
    <div className="maintenance">
      <Sidebar />
      <div className="main">
        <Header />
        <div className="maintenance__content">
          <h1 className="maintenance__title">Maintenance Requests</h1>

          {/* Post Maintenance Request */}
          <div className="maintenance__section">
            <h2>Post a Maintenance Request</h2>
            <div className="maintenance__form">
              <select
                value={selectedProperty}
                onChange={(e) => setSelectedProperty(e.target.value)}
                className="maintenance__input"
              >
                <option value="">Select Property</option>
                {properties.map((property) => (
                  <option key={property.id} value={property.id}>
                    {property.room_no}
                  </option>
                ))}
              </select>
              <textarea
                value={newRequest}
                onChange={(e) => setNewRequest(e.target.value)}
                className="maintenance__input"
                placeholder="Describe the issue (e.g., leaking faucet)..."
              ></textarea>
              <button className="maintenance__button" onClick={handlePostRequest}>
                Submit Request
              </button>
            </div>
          </div>

          {/* View Maintenance Progress */}
          <div className="maintenance__section">
            <h2>Maintenance Progress</h2>
            <table className="maintenance__table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Description</th>
                  <th>Status</th>
                  <th>Room No</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((request) => (
                  <tr key={request.id}>
                    <td>{request.id}</td>
                    <td>{request.description}</td>
                    <td
                      className={
                        request.status === 'In Progress'
                          ? 'maintenance__status--in-progress'
                          : 'maintenance__status--requested'
                      }
                    >
                      {request.status}
                    </td>
                    <td>{getPropertyRoomNo(request.property)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default Maintenance;
