import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../Component/Sidebar';
import Footer from '../Component/Footer';
import Header from '../Component/Header';

const baseUrl = process.env.REACT_APP_BACKEND_URL;

const Dashboard = () => {
  const [propertySummary, setPropertySummary] = useState({
    total: 0,
    occupied: 0,
    vacant: 0,
  });

  const [paymentSummary, setPaymentSummary] = useState({
    totalCollected: 0,
    pending: 0,
    overdue: 0,
  });

  const [maintenanceSummary, setMaintenanceSummary] = useState({
    requested: 0,
    inProgress: 0,
    completed: 0,
  });

  useEffect(() => {
    const fetchPropertySummary = async () => {
      try {
        const response = await axios.get(`${baseUrl}/property/`);
        const properties = response.data;
        const occupied = properties.filter(property => property.status === 'Booked').length;
        const vacant = properties.filter(property => property.status === 'Empty').length;
        setPropertySummary({
          total: properties.length,
          occupied: occupied,
          vacant: vacant,
        });
      } catch (error) {
        console.error('Error fetching property summary:', error);
      }
    };

    const fetchPaymentSummary = async () => {
      try {
        const response = await axios.get(`${baseUrl}/rentpayment/`);
        const payments = response.data;
        const totalCollected = payments.filter(payment => payment.status === 'Paid').reduce((sum, payment) => sum + parseFloat(payment.amount), 0);
        const pending = payments.filter(payment => payment.status === 'Pending').reduce((sum, payment) => sum + parseFloat(payment.amount), 0);
        const overdue = payments.filter(payment => payment.status === 'Overdue').reduce((sum, payment) => sum + parseFloat(payment.amount), 0);
        setPaymentSummary({
          totalCollected: totalCollected,
          pending: pending,
          overdue: overdue,
        });
      } catch (error) {
        console.error('Error fetching payment summary:', error);
      }
    };

    const fetchMaintenanceSummary = async () => {
      try {
        const response = await axios.get(`${baseUrl}/maintenance/`);
        const maintenanceRequests = response.data;
        const requested = maintenanceRequests.filter(request => request.status === 'Requested').length;
        const inProgress = maintenanceRequests.filter(request => request.status === 'In Progress').length;
        const completed = maintenanceRequests.filter(request => request.status === 'Completed').length;
        setMaintenanceSummary({
          requested: requested,
          inProgress: inProgress,
          completed: completed,
        });
      } catch (error) {
        console.error('Error fetching maintenance summary:', error);
      }
    };

    fetchPropertySummary();
    fetchPaymentSummary();
    fetchMaintenanceSummary();
  }, []);

  return (
    <div className="dashboard">
      <Sidebar />
      <div className="main">
        <Header />

        <div className="dashboard__content">
          <h1 className="dashboard__title">Dashboard Overview</h1>
          <div className="dashboard__summary">
            {/* Property Summary Card */}
            <div className="dashboard__card">
              <h2>Properties</h2>
              <p>Total Properties: <strong>{propertySummary.total}</strong></p>
              <p>Occupied Properties: <strong>{propertySummary.occupied}</strong></p>
              <p>Vacant Properties: <strong>{propertySummary.vacant}</strong></p>
            </div>

            {/* Payment Summary Card */}
            <div className="dashboard__card">
              <h2>Payments</h2>
              <p>Total Payments Collected: <strong>TZS {paymentSummary.totalCollected}</strong></p>
              <p>Pending Payments: <strong>TZS {paymentSummary.pending}</strong></p>
              <p>Overdue Payments: <strong>TZS {paymentSummary.overdue}</strong></p>
            </div>

            {/* Maintenance Summary Card */}
            <div className="dashboard__card">
              <h2>Maintenance</h2>
              <p>Requested Requests: <strong>{maintenanceSummary.requested}</strong></p>
              <p>In-Progress Requests: <strong>{maintenanceSummary.inProgress}</strong></p>
              <p>Completed Requests: <strong>{maintenanceSummary.completed}</strong></p>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </div>
  );
};

export default Dashboard;