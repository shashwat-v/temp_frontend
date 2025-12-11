import React from 'react';

const Dashboard = () => {
  return (
    <div className="form-container">
      <h2>Admin Dashboard</h2>
      <p>This page will show admin statistics and controls.</p>
      <button className="btn btn-primary" onClick={() => window.location.href = '/'}>
        Back to Map
      </button>
    </div>
  );
};

export default Dashboard;