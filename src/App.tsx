import React from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { Layout } from './components/layout/Layout';
import { Dashboard } from './pages/Dashboard';
import { ClassifyComplaint } from './pages/ClassifyComplaint';
import { ComplaintHistory } from './pages/ComplaintHistory';
import { ModelInformation } from './pages/ModelInformation';
import { About } from './pages/About';

export const App: React.FC = () => {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="classify" element={<ClassifyComplaint />} />
            <Route path="history" element={<ComplaintHistory />} />
            <Route path="models" element={<ModelInformation />} />
            <Route path="about" element={<About />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
};

export default App;
