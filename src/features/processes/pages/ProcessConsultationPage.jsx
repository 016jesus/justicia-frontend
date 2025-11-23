import React from 'react';
import DashboardLayout from '../components/DashboardLayout/DashboardLayout';
import ConsultationForm from '../components/ConsultationForm/ConsultationForm';

const ProcessConsultationPage = () => {
  return (
    <DashboardLayout activeItem="consultar">
      <ConsultationForm />
    </DashboardLayout>
  );
};

export default ProcessConsultationPage;