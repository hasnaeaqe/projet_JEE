import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ordonnanceAPI } from '../services/api';
import { toast } from 'react-toastify';

function OrdonnanceFormPage() {
  const { consultationId } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    consultationId: consultationId,
    type: 'MEDICAMENTS',
    contenu: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.contenu) {
      toast.error('Veuillez remplir le contenu de l\'ordonnance');
      return;
    }

    try {
      const response = await ordonnanceAPI.create(formData);
      toast.success('Ordonnance créée avec succès');

      const blob = await ordonnanceAPI.downloadPDF(response.data.id);
      const url = window.URL.createObjectURL(new Blob([blob.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `ordonnance_${response.data.id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();

      navigate(`/consultations/${consultationId}/edit`);
    } catch (error) {
      toast.error('Erreur lors de la création de l\'ordonnance');
      console.error(error);
    }
  };

  return (
    <div>
      <div className="page-header">
        <h2>Nouvelle Ordonnance</h2>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Type d'ordonnance *</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              required
            >
              <option value="MEDICAMENTS">Médicaments</option>
              <option value="EXAMENS_SUPPLEMENTAIRES">Examens supplémentaires</option>
            </select>
          </div>

          <div className="form-group">
            <label>Contenu de l'ordonnance *</label>
            <textarea
              name="contenu"
              value={formData.contenu}
              onChange={handleChange}
              rows="10"
              placeholder={
                formData.type === 'MEDICAMENTS'
                  ? '1. Nom du médicament - Posologie - Durée\n2. ...'
                  : '1. Type d\'examen\n2. ...'
              }
              required
            />
          </div>

          <div className="form-group" style={{display: 'flex', gap: '1rem', justifyContent: 'flex-end'}}>
            <button
              type="button"
              className="btn"
              onClick={() => navigate(`/consultations/${consultationId}/edit`)}
            >
              Annuler
            </button>
            <button type="submit" className="btn btn-success">
              Créer et Télécharger PDF
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default OrdonnanceFormPage;
