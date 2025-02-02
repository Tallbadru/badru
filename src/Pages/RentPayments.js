import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import axios from 'axios';
import Sidebar from '../Component/Sidebar';
import Footer from '../Component/Footer';
import Header from '../Component/Header';
import './Dashboard.css';

const Dashboard = () => {
  const [payments, setPayments] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [properties, setProperties] = useState([]);
  const [newPayment, setNewPayment] = useState('');
  const [tenantId] = useState(1); // Assuming tenant ID is 1 for now
  const [selectedBookingId, setSelectedBookingId] = useState(''); // Booking ID selected by the tenant

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/rentpayment/');
        setPayments(response.data);
      } catch (error) {
        console.error('Error fetching payments:', error);
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

    const fetchProperties = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/property/');
        setProperties(response.data);
      } catch (error) {
        console.error('Error fetching properties:', error);
      }
    };

    fetchPayments();
    fetchBookings();
    fetchProperties();
  }, []);

  useEffect(() => {
    if (selectedBookingId) {
      const selectedBooking = bookings.find((booking) => booking.id === parseInt(selectedBookingId));
      if (selectedBooking) {
        const property = properties.find((p) => p.id === selectedBooking.property);
        if (property) {
          if (property.type === 'Master') {
            setNewPayment('100000');
          } else if (property.type === 'Single') {
            setNewPayment('80000');
          } else {
            setNewPayment('');
          }
        }
      }
    } else {
      setNewPayment('');
    }
  }, [selectedBookingId, bookings, properties]);

  const handleMakePayment = async () => {
    if (!newPayment || !selectedBookingId) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Enter a valid amount and select a booking to proceed!',
        confirmButtonText: 'OK',
      });
      return;
    }

    const newPaymentData = {
      amount: parseFloat(newPayment).toFixed(2),
      status: 'Pending',
      date: new Date().toISOString().split('T')[0],
      tenant: tenantId,
      booking: selectedBookingId,
    };

    console.log('Making payment with data:', newPaymentData);

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/rentpayment/', newPaymentData);
      console.log('Payment response:', response.data);
      setPayments([...payments, response.data]);
      setNewPayment('');
      setSelectedBookingId('');

      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Payment initiated successfully. It will be processed soon!',
        confirmButtonText: 'OK',
      });
    } catch (error) {
      console.error('Error making payment:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to make payment. Please try again.',
        confirmButtonText: 'OK',
      });
    }
  };

  const getBookingDetails = (bookingId) => {
    const booking = bookings.find((b) => b.id === bookingId);
    if (!booking) return 'Unknown Booking';
    const property = properties.find((p) => p.id === booking.property);
    return property ? `Room No: ${property.room_no}, Booking ID: ${booking.id}` : 'Unknown Property';
  };

  const getRoomNo = (propertyId) => {
    const property = properties.find((p) => p.id === propertyId);
    return property ? property.room_no : 'Unknown Room';
  };

  return (
    <div className="dashboard">
      <Sidebar />
      <div className="main">
        <Header />

        <div className="dashboard__content">
          <h1 className="dashboard__title">Tenant Payment Dashboard</h1>

          <div className="dashboard__section">
            <h2>Make a Payment</h2>
            <div className="dashboard__form">
              <label htmlFor="bookingSelect">Select Booking:</label>
              <select
                id="bookingSelect"
                value={selectedBookingId}
                onChange={(e) => setSelectedBookingId(e.target.value)}
                className="dashboard__input"
              >
                <option value="">Select Booking</option>
                {bookings.map((booking) => (
                  <option key={booking.id} value={booking.id}>
                    Booking ID: {booking.id}, Room No: {getRoomNo(booking.property)}
                  </option>
                ))}
              </select>
              <label htmlFor="paymentAmount">Payment Amount (TZS):</label>
              <input
                id="paymentAmount"
                type="number"
                value={newPayment}
                readOnly
                className="dashboard__input"
              />
              <button className="dashboard__button" onClick={handleMakePayment}>
                Pay Now
              </button>
            </div>
          </div>

          <div className="dashboard__section">
            <h2>Payment History</h2>
            <table className="dashboard__table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Amount (TZS)</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Booking Details</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((payment) => (
                  <tr key={payment.id}>
                    <td>{payment.id}</td>
                    <td>TZS {payment.amount}</td>
                    <td
                      className={
                        payment.status === 'Paid'
                          ? 'dashboard__status--paid'
                          : 'dashboard__status--pending'
                      }
                    >
                      {payment.status}
                    </td>
                    <td>{payment.date}</td>
                    <td>{getBookingDetails(payment.booking)}</td>
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

export default Dashboard;