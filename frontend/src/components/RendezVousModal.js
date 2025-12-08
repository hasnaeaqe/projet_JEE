import React, { useState, useEffect } from 'react';
import { rendezVousAPI } from '../services/api';
import { toast } from 'react-toastify';
import './Modal.css';

function RendezVousModal({ rendezVous, patients, medecins, onClose, onSave }) {
  const [formData, setFormData] = useState({
    patientId: '',
    medecinId: '',
    dateRdv: '',
    heureRdv: '',
    motif: '',
    notes: '',
    statut: 'EN_ATTENTE',
  });

  useEffect(() => {
    if (rendezVous) {
      setFormData({
        patientId: rendezVous.patientId || '',
        medecinId: rendezVous.medecinId || '',
        dateRdv: rendezVous.dateRdv || '',
        heureRdv: rendezVous.heureRdv || '',
        motif: rendezVous.motif || '',
        notes: rendezVous.notes || '',
        statut: rendezVous.statut || 'EN_ATTENTE',
      });
    }
  }, [rendezVous]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.patientId || !formData.medecinId || !formData.dateRdv || !formData.heureRdv) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    try {
      if (rendezVous?.id) {
        await rendezVousAPI.update(rendezVous.id, formData);
        toast.success('Rendez-vous modifié avec succès');
      } else {
        await rendezVousAPI.create(formData);
        toast.success('Rendez-vous créé avec succès');
      }
      onSave();
    } catch (error) {
      toast.error('Erreur lors de l\'enregistrement du rendez-vous');
      console.error(error);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce rendez-vous ?')) {
      try {
        await rendezVousAPI.delete(rendezVous.id);
        toast.success('Rendez-vous supprimé avec succès');
        onSave();
      } catch (error) {
        toast.error('Erreur lors de la suppression du rendez-vous');
        console.error(error);
      }
    }
  };

  const handleConfirmer = async () => {
    try {
      await rendezVousAPI.confirmer(rendezVous.id);
      toast.success('Rendez-vous confirmé');
      onSave();
    } catch (error) {
      toast.error('Erreur lors de la confirmation');
      console.error(error);
    }
  };

  const handleAnnuler = async () => {
    try {
      await rendezVousAPI.annuler(rendezVous.id);
      toast.success('Rendez-vous annulé');
      onSave();
    } catch (error) {
      toast.error('Erreur lors de l\'annulation');
      console.error(error);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{rendezVous?.id ? 'Modifier le rendez-vous' : 'Nouveau rendez-vous'}</h3>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Patient *</label>
            <select
              name="patientId"
              value={formData.patientId}
              onChange={handleChange}
              required
            >
              <option value="">Sélectionner un patient</option>
              {patients.map(patient => (
                <option key={patient.id} value={patient.id}>
                  {patient.nom} {patient.prenom} - {patient.cin}
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
            >
              <option value="">Sélectionner un médecin</option>
              {medecins.map(medecin => (
                <option key={medecin.id} value={medecin.id}>
                  Dr. {medecin.nom} {medecin.prenom} {medecin.specialite ? `- ${medecin.specialite}` : ''}
                </option>
              ))}
            </select>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Date *</label>
              <input
                type="date"
                name="dateRdv"
                value={formData.dateRdv}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Heure *</label>
              <input
                type="time"
                name="heureRdv"
                value={formData.heureRdv}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Motif</label>
            <textarea
              name="motif"
              value={formData.motif}
              onChange={handleChange}
              rows="3"
            />
          </div>

          <div className="form-group">
            <label>Notes</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows="2"
            />
          </div>

          <div className="modal-footer">
            <div className="action-buttons">
              {rendezVous?.id && rendezVous.statut === 'EN_ATTENTE' && (
                <>
                  <button type="button" className="btn btn-success" onClick={handleConfirmer}>
                    Confirmer
                  </button>
                  <button type="button" className="btn btn-warning" onClick={handleAnnuler}>
                    Annuler RDV
                  </button>
                </>
              )}
              {rendezVous?.id && (
                <button type="button" className="btn btn-danger" onClick={handleDelete}>
                  Supprimer
                </button>
              )}
            </div>
            <div className="action-buttons">
              <button type="button" className="btn" onClick={onClose}>
                Fermer
              </button>
              <button type="submit" className="btn btn-primary">
                Enregistrer
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default RendezVousModal;
