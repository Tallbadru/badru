import React, { useState, useEffect } from "react";
import "../CSS/Modal.css";

const Modal = ({ show, onClose, properties, bookingId, onBookingCreated }) => {
  const [roomNo, setRoomNo] = useState("");
  const [tenantName, setTenantName] = useState("");
  const [startDate, setStartDate] = useState(""); // New state for start date
  const [endDate, setEndDate] = useState(""); // New state for end date
  const [price, setPrice] = useState(0);

  useEffect(() => {
    if (show && bookingId) {
      // Fetch the booking details for prefilled data
      fetch(`http://127.0.0.1:8000/api/booking/${bookingId}/`)
        .then((response) => response.json())
        .then((data) => {
          setRoomNo(data.property); // Assuming the backend returns property ID
          setTenantName(data.tenant_name || ""); // Adjust based on API response
          setStartDate(data.start_date || ""); // Prefill start date
          setEndDate(data.end_date || ""); // Prefill end date
          setPrice(data.price || 0);
        })
        .catch((error) => {
          console.error("Error fetching booking details:", error);
        });
    }
  }, [show, bookingId]);

  const handleRoomChange = (e) => {
    const selectedRoomId = e.target.value;
    setRoomNo(selectedRoomId);

    const selectedProperty = properties.find(
      (property) => property.id === parseInt(selectedRoomId)
    );

    if (selectedProperty) {
      // Calculate the price based on room type
      const calculatedPrice =
        selectedProperty.type.toLowerCase() === "master" ? 100000 : 80000;
      setPrice(calculatedPrice);
    }
  };

  const handleStartDateChange = (e) => {
    setStartDate(e.target.value);
  };

  const handleEndDateChange = (e) => {
    setEndDate(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Create a booking object
    const bookingData = {
      property: roomNo,
      tenant_name: tenantName,
      start_date: startDate,
      end_date: endDate,
      price: price,
    };

    // Send POST request to create a booking
    fetch("http://127.0.0.1:8000/api/booking/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bookingData),
    })
      .then((response) => response.json())
      .then((data) => {
        // Call the callback passed from the parent component to handle the new booking
        if (onBookingCreated) onBookingCreated(data);
        // Close the modal after successful submission
        onClose();
      })
      .catch((error) => {
        console.error("Error creating booking:", error);
      });
  };

  if (!show) return null;

  return (
    <div className="modal">
      <div className="modal__content">
        <span className="modal__close" onClick={onClose}>
          &times;
        </span>
        <h2>Book a Property</h2>
        <form onSubmit={handleSubmit}>
          <div className="modal__form-group">
            <label htmlFor="property_id">Room No</label>
            <select
              name="property_id"
              id="property_id"
              value={roomNo}
              onChange={handleRoomChange}
              required
            >
              <option value="">Select a property</option>
              {properties
                .filter((property) => property.status === "Empty") // Filter properties with status "Empty"
                .map((property) => (
                  <option key={property.id} value={property.id}>
                    {property.room_no} - {property.type.charAt(0).toUpperCase() + property.type.slice(1)}
                  </option>
                ))}
            </select>
          </div>
          <div className="modal__form-group">
            <label htmlFor="tenant_name">Tenant Name</label>
            <input
              type="text"
              name="tenant_name"
              id="tenant_name"
              value={tenantName}
              onChange={(e) => setTenantName(e.target.value)}
              required
            />
          </div>
          <div className="modal__form-group">
            <label htmlFor="start_date">Start Date</label>
            <input
              type="date"
              name="start_date"
              id="start_date"
              value={startDate}
              onChange={handleStartDateChange}
              required
            />
          </div>
          <div className="modal__form-group">
            <label htmlFor="end_date">End Date</label>
            <input
              type="date"
              name="end_date"
              id="end_date"
              value={endDate}
              onChange={handleEndDateChange}
              required
            />
          </div>
          <div className="modal__form-group">
            <label htmlFor="price">Price</label>
            <input
              type="number"
              name="price"
              id="price"
              value={price}
              readOnly
            />
          </div>
          <div className="modal__footer">
            <button type="submit" className="modal__button">
              Submit
            </button>
            <button
              type="button"
              className="modal__button modal__button--close"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Modal;
