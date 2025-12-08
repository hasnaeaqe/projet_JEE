import React, { useState, useEffect } from 'react';
import { patientAPI } from '../services/api';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

function PatientsPage() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [currentPatient, setCurrentPatient] = useState(null);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    cin: '',
    nom: '',
    prenom: '',
    dateNaissance: '',
    sexe: 'M',
    numTel: '',
    email: '',
    adresse: '',
    typeMutuelle: '',
  });

  useEffect(() => {
    loadPatients();
  }, []);

  const loadPatients = async () => {
    try {
      setLoading(true);
      const response = await patientAPI.getAll();
      setPatients(response.data);
    } catch (error) {
      toast.error('Erreur lors du chargement des patients');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (patient = null) => {
    if (patient) {
      setCurrentPatient(patient);
      setFormData(patient);
    } else {
      setCurrentPatient(null);
      setFormData({
        cin: '',
        nom: '',
        prenom: '',
        dateNaissance: '',
        sexe: 'M',
        numTel: '',
        email: '',
        adresse: '',
        typeMutuelle: '',
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setCurrentPatient(null);
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
    try {
      if (currentPatient) {
        await patientAPI.update(currentPatient.id, formData);
        toast.success('Patient modifié avec succès');
      } else {
        await patientAPI.create(formData);
        toast.success('Patient créé avec succès');
      }
      loadPatients();
      handleCloseModal();
    } catch (error) {
      toast.error('Erreur lors de l\'enregistrement du patient');
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce patient ?')) {
      try {
        await patientAPI.delete(id);
        toast.success('Patient supprimé avec succès');
        loadPatients();
      } catch (error) {
        toast.error('Erreur lors de la suppression du patient');
        console.error(error);
      }
    }
  };

  if (loading) {
    return <div className="loading">Chargement...</div>;
  }

  return (
    <div>
      <div className="page-header">
        <h2>Gestion des Patients</h2>
        <button className="btn btn-primary" onClick={() => handleOpenModal()}>
          Nouveau Patient
        </button>
      </div>

      <div className="card">
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>CIN</th>
                <th>Nom</th>
                <th>Prénom</th>
                <th>Date de naissance</th>
                <th>Téléphone</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {patients.map(patient => (
                <tr key={patient.id}>
                  <td>{patient.cin}</td>
                  <td>{patient.nom}</td>
                  <td>{patient.prenom}</td>
                  <td>{patient.dateNaissance ? new Date(patient.dateNaissance).toLocaleDateString('fr-FR') : '-'}</td>
                  <td>{patient.numTel}</td>
                  <td>
                    <div className="actions">
                      <button
                        className="btn btn-primary"
                        onClick={() => navigate(`/patients/${patient.id}/historique`)}
                      >
                        Historique
                      </button>
                      <button
                        className="btn btn-warning"
                        onClick={() => handleOpenModal(patient)}
                      >
                        Modifier
                      </button>
                      <button
                        className="btn btn-danger"
                        onClick={() => handleDelete(patient.id)}
                      >
                        Supprimer
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{currentPatient ? 'Modifier le patient' : 'Nouveau patient'}</h3>
              <button className="close-btn" onClick={handleCloseModal}>&times;</button>
            </div>

            <form onSubmit={handleSubmit}>
              <div style={{padding: '1.5rem'}}>
                <div className="form-group">
                  <label>CIN *</label>
                  <input
                    type="text"
                    name="cin"
                    value={formData.cin}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Nom *</label>
                    <input
                      type="text"
                      name="nom"
                      value={formData.nom}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Prénom *</label>
                    <input
                      type="text"
                      name="prenom"
                      value={formData.prenom}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Date de naissance</label>
                    <input
                      type="date"
                      name="dateNaissance"
                      value={formData.dateNaissance}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="form-group">
                    <label>Sexe</label>
                    <select name="sexe" value={formData.sexe} onChange={handleChange}>
                      <option value="M">Masculin</option>
                      <option value="F">Féminin</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label>Téléphone</label>
                  <input
                    type="tel"
                    name="numTel"
                    value={formData.numTel}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label>Adresse</label>
                  <textarea
                    name="adresse"
                    value={formData.adresse}
                    onChange={handleChange}
                    rows="2"
                  />
                </div>

                <div className="form-group">
                  <label>Type de mutuelle</label>
                  <input
                    type="text"
                    name="typeMutuelle"
                    value={formData.typeMutuelle}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn" onClick={handleCloseModal}>
                  Annuler
                </button>
                <button type="submit" className="btn btn-primary">
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default PatientsPage;
