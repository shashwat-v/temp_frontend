import React from 'react';
import { useParams } from 'react-router-dom';

const IssueDetail = () => {
  const { id } = useParams();

  return (
    <div className="form-container">
      <h2>Issue Detail #{id}</h2>
      <p>This page will show detailed information about the issue.</p>
      <button className="btn btn-primary" onClick={() => window.location.href = '/'}>
        Back to Map
      </button>
    </div>
  );
};

export default IssueDetail;