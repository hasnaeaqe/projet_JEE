import React, { useState, useEffect, useCallback } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'moment/locale/fr';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { rendezVousAPI, patientAPI, medecinAPI } from '../services/api';
import { toast } from 'react-toastify';
import RendezVousModal from '../components/RendezVousModal';
import './CalendrierPage.css';

moment.locale('fr');
const localizer = momentLocalizer(moment);

const messages = {
  allDay: 'Journée',
  previous: 'Précédent',
  next: 'Suivant',
  today: "Aujourd'hui",
  month: 'Mois',
  week: 'Semaine',
  day: 'Jour',
  agenda: 'Agenda',
  date: 'Date',
  time: 'Heure',
  event: 'Rendez-vous',
  noEventsInRange: 'Aucun rendez-vous dans cette période',
};

function CalendrierPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [patients, setPatients] = useState([]);
  const [medecins, setMedecins] = useState([]);

  const loadRendezVous = useCallback(async () => {
    try {
      setLoading(true);
      const response = await rendezVousAPI.getAll();
      const formattedEvents = response.data.map(rdv => ({
        id: rdv.id,
        title: `${rdv.patientNom} ${rdv.patientPrenom} - Dr. ${rdv.medecinNom}`,
        start: new Date(`${rdv.dateRdv}T${rdv.heureRdv}`),
        end: new Date(`${rdv.dateRdv}T${rdv.heureRdv}`),
        resource: rdv,
      }));
      setEvents(formattedEvents);
    } catch (error) {
      toast.error('Erreur lors du chargement des rendez-vous');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadPatients = useCallback(async () => {
    try {
      const response = await patientAPI.getAll();
      setPatients(response.data);
    } catch (error) {
      console.error('Erreur lors du chargement des patients', error);
    }
  }, []);

  const loadMedecins = useCallback(async () => {
    try {
      const response = await medecinAPI.getAll();
      setMedecins(response.data);
    } catch (error) {
      console.error('Erreur lors du chargement des médecins', error);
    }
  }, []);

  useEffect(() => {
    loadRendezVous();
    loadPatients();
    loadMedecins();
  }, [loadRendezVous, loadPatients, loadMedecins]);

  const handleSelectSlot = ({ start }) => {
    setSelectedEvent({
      dateRdv: moment(start).format('YYYY-MM-DD'),
      heureRdv: moment(start).format('HH:mm'),
    });
    setShowModal(true);
  };

  const handleSelectEvent = (event) => {
    setSelectedEvent(event.resource);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedEvent(null);
  };

  const handleSaveRendezVous = () => {
    loadRendezVous();
    handleCloseModal();
  };

  const eventStyleGetter = (event) => {
    const rdv = event.resource;
    let backgroundColor = '#3174ad';

    if (rdv.statut === 'CONFIRME') {
      backgroundColor = '#27ae60';
    } else if (rdv.statut === 'ANNULE') {
      backgroundColor = '#e74c3c';
    } else if (rdv.statut === 'TERMINE') {
      backgroundColor = '#95a5a6';
    }

    return {
      style: {
        backgroundColor,
        borderRadius: '5px',
        opacity: 0.8,
        color: 'white',
        border: '0px',
        display: 'block',
      },
    };
  };

  if (loading) {
    return <div className="loading">Chargement du calendrier...</div>;
  }

  return (
    <div className="calendrier-page">
      <div className="page-header">
        <h2>Calendrier des Rendez-vous</h2>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          Nouveau Rendez-vous
        </button>
      </div>

      <div className="calendar-container">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 600 }}
          messages={messages}
          onSelectSlot={handleSelectSlot}
          onSelectEvent={handleSelectEvent}
          selectable
          eventPropGetter={eventStyleGetter}
        />
      </div>

      {showModal && (
        <RendezVousModal
          rendezVous={selectedEvent}
          patients={patients}
          medecins={medecins}
          onClose={handleCloseModal}
          onSave={handleSaveRendezVous}
        />
      )}
    </div>
  );
}

export default CalendrierPage;
