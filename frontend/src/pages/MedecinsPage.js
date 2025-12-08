import React, { useState, useEffect } from 'react';
import { medecinAPI } from '../services/api';
import { toast } from 'react-toastify';

function MedecinsPage() {
  const [medecins, setMedecins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [currentMedecin, setCurrentMedecin] = useState(null);

  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    specialite: '',
    numTel: '',
    email: '',
    signature: '',
  });

  useEffect(() => {
    loadMedecins();
  }, []);

  const loadMedecins = async () => {
    try {
      setLoading(true);
      const response = await medecinAPI.getAll();
      setMedecins(response.data);
    } catch (error) {
      toast.error('Erreur lors du chargement des médecins');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (medecin = null) => {
    if (medecin) {
      setCurrentMedecin(medecin);
      setFormData(medecin);
    } else {
      setCurrentMedecin(null);
      setFormData({
        nom: '',
        prenom: '',
        specialite: '',
        numTel: '',
        email: '',
        signature: '',
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setCurrentMedecin(null);
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
      if (currentMedecin) {
        await medecinAPI.update(currentMedecin.id, formData);
        toast.success('Médecin modifié avec succès');
      } else {
        await medecinAPI.create(formData);
        toast.success('Médecin créé avec succès');
      }
      loadMedecins();
      handleCloseModal();
    } catch (error) {
      toast.error('Erreur lors de l\'enregistrement du médecin');
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce médecin ?')) {
      try {
        await medecinAPI.delete(id);
        toast.success('Médecin supprimé avec succès');
        loadMedecins();
      } catch (error) {
        toast.error('Erreur lors de la suppression du médecin');
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
        <h2>Gestion des Médecins</h2>
        <button className="btn btn-primary" onClick={() => handleOpenModal()}>
          Nouveau Médecin
        </button>
      </div>

      <div className="card">
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Nom</th>
                <th>Prénom</th>
                <th>Spécialité</th>
                <th>Téléphone</th>
                <th>Email</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {medecins.map(medecin => (
                <tr key={medecin.id}>
                  <td>{medecin.nom}</td>
                  <td>{medecin.prenom}</td>
                  <td>{medecin.specialite || '-'}</td>
                  <td>{medecin.numTel}</td>
                  <td>{medecin.email}</td>
                  <td>
                    <div className="actions">
                      <button
                        className="btn btn-warning"
                        onClick={() => handleOpenModal(medecin)}
                      >
                        Modifier
                      </button>
                      <button
                        className="btn btn-danger"
                        onClick={() => handleDelete(medecin.id)}
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
              <h3>{currentMedecin ? 'Modifier le médecin' : 'Nouveau médecin'}</h3>
              <button className="close-btn" onClick={handleCloseModal}>&times;</button>
            </div>

            <form onSubmit={handleSubmit}>
              <div style={{padding: '1.5rem'}}>
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

                <div className="form-group">
                  <label>Spécialité</label>
                  <input
                    type="text"
                    name="specialite"
                    value={formData.specialite}
                    onChange={handleChange}
                  />
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
                  <label>Signature</label>
                  <textarea
                    name="signature"
                    value={formData.signature}
                    onChange={handleChange}
                    rows="3"
                    placeholder="Signature du médecin pour les ordonnances"
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

export default MedecinsPage;
