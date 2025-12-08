import React, { useState, useEffect } from 'react';
import { rendezVousAPI } from '../services/api';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

function RendezVousListPage() {
  const [rendezVous, setRendezVous] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    loadRendezVous();
  }, []);

  const loadRendezVous = async () => {
    try {
      setLoading(true);
      const response = await rendezVousAPI.getAll();
      setRendezVous(response.data);
    } catch (error) {
      toast.error('Erreur lors du chargement des rendez-vous');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const filteredRendezVous = rendezVous.filter(rdv =>
    rdv.patientNom.toLowerCase().includes(filter.toLowerCase()) ||
    rdv.patientPrenom.toLowerCase().includes(filter.toLowerCase()) ||
    rdv.medecinNom.toLowerCase().includes(filter.toLowerCase())
  );

  if (loading) {
    return <div className="loading">Chargement...</div>;
  }

  return (
    <div>
      <div className="page-header">
        <h2>Liste des Rendez-vous</h2>
        <button className="btn btn-primary" onClick={() => navigate('/')}>
          Voir le Calendrier
        </button>
      </div>

      <div className="card">
        <div className="form-group">
          <input
            type="text"
            placeholder="Rechercher par patient ou médecin..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Heure</th>
                <th>Patient</th>
                <th>Médecin</th>
                <th>Motif</th>
                <th>Statut</th>
              </tr>
            </thead>
            <tbody>
              {filteredRendezVous.map(rdv => (
                <tr key={rdv.id}>
                  <td>{new Date(rdv.dateRdv).toLocaleDateString('fr-FR')}</td>
                  <td>{rdv.heureRdv}</td>
                  <td>{rdv.patientNom} {rdv.patientPrenom}</td>
                  <td>Dr. {rdv.medecinNom} {rdv.medecinPrenom}</td>
                  <td>{rdv.motif}</td>
                  <td>
                    <span className={`status-badge status-${rdv.statut}`}>
                      {rdv.statut}
                    </span>
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

export default RendezVousListPage;
