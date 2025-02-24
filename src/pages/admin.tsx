import React from 'react';
import { GuardianDashboard } from '../components/GuardianDashboard';

export const AdminPage: React.FC = () => {
  return (
    <div className="admin-page">
      <h1>Admin Dashboard</h1>
      <GuardianDashboard />
    </div>
  );
};

export default AdminPage;