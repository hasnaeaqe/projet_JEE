import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

import CalendrierPage from './pages/CalendrierPage';
import RendezVousListPage from './pages/RendezVousListPage';
import ConsultationListPage from './pages/ConsultationListPage';
import ConsultationFormPage from './pages/ConsultationFormPage';
import OrdonnanceFormPage from './pages/OrdonnanceFormPage';
import HistoriquePatientPage from './pages/HistoriquePatientPage';
import PatientsPage from './pages/PatientsPage';
import MedecinsPage from './pages/MedecinsPage';

function App() {
  return (
    <Router>
      <div className="App">
        <nav className="navbar">
          <div className="navbar-brand">
            <h1>Cabinet Médical</h1>
          </div>
          <ul className="navbar-menu">
            <li><Link to="/">Calendrier</Link></li>
            <li><Link to="/rendezvous">Rendez-vous</Link></li>
            <li><Link to="/consultations">Consultations</Link></li>
            <li><Link to="/patients">Patients</Link></li>
            <li><Link to="/medecins">Médecins</Link></li>
          </ul>
        </nav>

        <main className="main-content">
          <Routes>
            <Route path="/" element={<CalendrierPage />} />
            <Route path="/rendezvous" element={<RendezVousListPage />} />
            <Route path="/consultations" element={<ConsultationListPage />} />
            <Route path="/consultations/new" element={<ConsultationFormPage />} />
            <Route path="/consultations/:id/edit" element={<ConsultationFormPage />} />
            <Route path="/consultations/:consultationId/ordonnances/new" element={<OrdonnanceFormPage />} />
            <Route path="/patients/:patientId/historique" element={<HistoriquePatientPage />} />
            <Route path="/patients" element={<PatientsPage />} />
            <Route path="/medecins" element={<MedecinsPage />} />
          </Routes>
        </main>

        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </div>
    </Router>
  );
}

export default App;
