import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { consultationAPI, patientAPI, medecinAPI } from '../services/api';
import { toast } from 'react-toastify';

function ConsultationFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [patients, setPatients] = useState([]);
  const [medecins, setMedecins] = useState([]);

  const [formData, setFormData] = useState({
    patientId: '',
    medecinId: '',
    rendezVousId: '',
    dateConsultation: new Date().toISOString().split('T')[0],
    examenClinique: '',
    examenSupplementaire: '',
    diagnostic: '',
    traitement: '',
    observations: '',
  });

  useEffect(() => {
    loadPatients();
    loadMedecins();
    if (id) {
      loadConsultation();
    }
  }, [id]);

  const loadPatients = async () => {
    try {
      const response = await patientAPI.getAll();
      setPatients(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const loadMedecins = async () => {
    try {
      const response = await medecinAPI.getAll();
      setMedecins(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const loadConsultation = async () => {
    try {
      setLoading(true);
      const response = await consultationAPI.getById(id);
      const consultation = response.data;
      setFormData({
        patientId: consultation.patientId,
        medecinId: consultation.medecinId,
        rendezVousId: consultation.rendezVousId || '',
        dateConsultation: consultation.dateConsultation,
        examenClinique: consultation.examenClinique || '',
        examenSupplementaire: consultation.examenSupplementaire || '',
        diagnostic: consultation.diagnostic || '',
        traitement: consultation.traitement || '',
        observations: consultation.observations || '',
      });
    } catch (error) {
      toast.error('Erreur lors du chargement de la consultation');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.patientId || !formData.medecinId) {
      toast.error('Veuillez sélectionner un patient et un médecin');
      return;
    }

    try {
      if (id) {
        await consultationAPI.update(id, formData);
        toast.success('Consultation modifiée avec succès');
      } else {
        const response = await consultationAPI.create(formData);
        toast.success('Consultation créée avec succès');
        navigate(`/consultations/${response.data.id}/edit`);
        return;
      }
    } catch (error) {
      toast.error('Erreur lors de l\'enregistrement de la consultation');
      console.error(error);
    }
  };

  const handleCreateOrdonnance = () => {
    if (id) {
      navigate(`/consultations/${id}/ordonnances/new`);
    } else {
      toast.warning('Veuillez d\'abord enregistrer la consultation');
    }
  };

  if (loading) {
    return <div className="loading">Chargement...</div>;
  }

  return (
    <div>
      <div className="page-header">
        <h2>{id ? 'Modifier la consultation' : 'Nouvelle consultation'}</h2>
        <div>
          {id && (
            <button
              type="button"
              className="btn btn-success"
              onClick={handleCreateOrdonnance}
            >
              Créer une Ordonnance
            </button>
          )}
        </div>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Patient *</label>
              <select
                name="patientId"
                value={formData.patientId}
                onChange={handleChange}
                required
                disabled={!!id}
              >
                <option value="">Sélectionner un patient</option>
                {patients.map(patient => (
                  <option key={patient.id} value={patient.id}>
                    {patient.nom} {patient.prenom}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Médecin *</label>
              <select
                name="medecinId"
                value={formData.medecinId}
                onChange={handleChange}
                required
                disabled={!!id}
              >
                <option value="">Sélectionner un médecin</option>
                {medecins.map(medecin => (
                  <option key={medecin.id} value={medecin.id}>
                    Dr. {medecin.nom} {medecin.prenom}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Date de consultation</label>
            <input
              type="date"
              name="dateConsultation"
              value={formData.dateConsultation}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Examen clinique</label>
            <textarea
              name="examenClinique"
              value={formData.examenClinique}
              onChange={handleChange}
              rows="4"
            />
          </div>

          <div className="form-group">
            <label>Examen supplémentaire</label>
            <textarea
              name="examenSupplementaire"
              value={formData.examenSupplementaire}
              onChange={handleChange}
              rows="3"
            />
          </div>

          <div className="form-group">
            <label>Diagnostic</label>
            <textarea
              name="diagnostic"
              value={formData.diagnostic}
              onChange={handleChange}
              rows="3"
            />
          </div>

          <div className="form-group">
            <label>Traitement</label>
            <textarea
              name="traitement"
              value={formData.traitement}
              onChange={handleChange}
              rows="3"
            />
          </div>

          <div className="form-group">
            <label>Observations</label>
            <textarea
              name="observations"
              value={formData.observations}
              onChange={handleChange}
              rows="2"
            />
          </div>

          <div className="form-group" style={{display: 'flex', gap: '1rem', justifyContent: 'flex-end'}}>
            <button type="button" className="btn" onClick={() => navigate('/consultations')}>
              Annuler
            </button>
            <button type="submit" className="btn btn-primary">
              Enregistrer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ConsultationFormPage;
