import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { consultationAPI, patientAPI } from '../services/api';
import { toast } from 'react-toastify';

function HistoriquePatientPage() {
  const { patientId } = useParams();
  const [patient, setPatient] = useState(null);
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPatientAndConsultations();
  }, [patientId]);

  const loadPatientAndConsultations = async () => {
    try {
      setLoading(true);
      const [patientRes, consultationsRes] = await Promise.all([
        patientAPI.getById(patientId),
        consultationAPI.getByPatient(patientId),
      ]);
      setPatient(patientRes.data);
      setConsultations(consultationsRes.data);
    } catch (error) {
      toast.error('Erreur lors du chargement de l\'historique');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Chargement...</div>;
  }

  if (!patient) {
    return <div className="error">Patient non trouvé</div>;
  }

  return (
    <div>
      <div className="page-header">
        <h2>Historique des Consultations</h2>
      </div>

      <div className="card">
        <h3>Patient: {patient.nom} {patient.prenom}</h3>
        <p><strong>CIN:</strong> {patient.cin}</p>
        <p><strong>Date de naissance:</strong> {patient.dateNaissance ? new Date(patient.dateNaissance).toLocaleDateString('fr-FR') : 'N/A'}</p>
        <p><strong>Téléphone:</strong> {patient.numTel}</p>
      </div>

      <div className="card">
        <h3>Consultations ({consultations.length})</h3>
        {consultations.length === 0 ? (
          <p>Aucune consultation trouvée pour ce patient.</p>
        ) : (
          <div className="consultations-list">
            {consultations.map(consultation => (
              <div key={consultation.id} className="consultation-item card" style={{marginBottom: '1rem'}}>
                <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '1rem'}}>
                  <div>
                    <strong>Date:</strong> {new Date(consultation.dateConsultation).toLocaleDateString('fr-FR')}
                  </div>
                  <div>
                    <strong>Médecin:</strong> Dr. {consultation.medecinNom} {consultation.medecinPrenom}
                  </div>
                </div>

                {consultation.examenClinique && (
                  <div style={{marginBottom: '0.5rem'}}>
                    <strong>Examen clinique:</strong>
                    <p>{consultation.examenClinique}</p>
                  </div>
                )}

                {consultation.diagnostic && (
                  <div style={{marginBottom: '0.5rem'}}>
                    <strong>Diagnostic:</strong>
                    <p>{consultation.diagnostic}</p>
                  </div>
                )}

                {consultation.traitement && (
                  <div style={{marginBottom: '0.5rem'}}>
                    <strong>Traitement:</strong>
                    <p>{consultation.traitement}</p>
                  </div>
                )}

                {consultation.ordonnances && consultation.ordonnances.length > 0 && (
                  <div>
                    <strong>Ordonnances:</strong> {consultation.ordonnances.length}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default HistoriquePatientPage;
