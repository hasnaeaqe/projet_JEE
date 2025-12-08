import React, { useState, useEffect } from 'react';
import { consultationAPI } from '../services/api';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

function ConsultationListPage() {
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadConsultations();
  }, []);

  const loadConsultations = async () => {
    try {
      setLoading(true);
      const response = await consultationAPI.getAll();
      setConsultations(response.data);
    } catch (error) {
      toast.error('Erreur lors du chargement des consultations');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (id) => {
    navigate(`/consultations/${id}/edit`);
  };

  if (loading) {
    return <div className="loading">Chargement...</div>;
  }

  return (
    <div>
      <div className="page-header">
        <h2>Liste des Consultations</h2>
        <button className="btn btn-primary" onClick={() => navigate('/consultations/new')}>
          Nouvelle Consultation
        </button>
      </div>

      <div className="card">
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Patient</th>
                <th>Médecin</th>
                <th>Diagnostic</th>
                <th>Ordonnances</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {consultations.map(consultation => (
                <tr key={consultation.id}>
                  <td>{new Date(consultation.dateConsultation).toLocaleDateString('fr-FR')}</td>
                  <td>{consultation.patientNom} {consultation.patientPrenom}</td>
                  <td>Dr. {consultation.medecinNom} {consultation.medecinPrenom}</td>
                  <td>{consultation.diagnostic ? consultation.diagnostic.substring(0, 50) + '...' : '-'}</td>
                  <td>{consultation.ordonnances.length}</td>
                  <td>
                    <div className="actions">
                      <button
                        className="btn btn-primary"
                        onClick={() => handleViewDetails(consultation.id)}
                      >
                        Voir
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default ConsultationListPage;
