import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const patientAPI = {
  getAll: () => api.get('/patients'),
  getById: (id) => api.get(`/patients/${id}`),
  create: (patient) => api.post('/patients', patient),
  update: (id, patient) => api.put(`/patients/${id}`, patient),
  delete: (id) => api.delete(`/patients/${id}`),
  search: (query) => api.get(`/patients/search?q=${query}`),
};

export const medecinAPI = {
  getAll: () => api.get('/medecins'),
  getById: (id) => api.get(`/medecins/${id}`),
  create: (medecin) => api.post('/medecins', medecin),
  update: (id, medecin) => api.put(`/medecins/${id}`, medecin),
  delete: (id) => api.delete(`/medecins/${id}`),
};

export const rendezVousAPI = {
  getAll: () => api.get('/rendezvous'),
  getById: (id) => api.get(`/rendezvous/${id}`),
  getByPatient: (patientId) => api.get(`/rendezvous/patient/${patientId}`),
  getByMedecin: (medecinId) => api.get(`/rendezvous/medecin/${medecinId}`),
  getByDate: (date) => api.get(`/rendezvous/date/${date}`),
  getByDateRange: (startDate, endDate) => api.get(`/rendezvous/range?startDate=${startDate}&endDate=${endDate}`),
  create: (rendezVous) => api.post('/rendezvous', rendezVous),
  update: (id, rendezVous) => api.put(`/rendezvous/${id}`, rendezVous),
  delete: (id) => api.delete(`/rendezvous/${id}`),
  confirmer: (id) => api.put(`/rendezvous/${id}/confirmer`),
  annuler: (id) => api.put(`/rendezvous/${id}/annuler`),
};

export const consultationAPI = {
  getAll: () => api.get('/consultations'),
  getById: (id) => api.get(`/consultations/${id}`),
  getByPatient: (patientId) => api.get(`/consultations/patient/${patientId}`),
  getByMedecin: (medecinId) => api.get(`/consultations/medecin/${medecinId}`),
  create: (consultation) => api.post('/consultations', consultation),
  update: (id, consultation) => api.put(`/consultations/${id}`, consultation),
  delete: (id) => api.delete(`/consultations/${id}`),
};

export const ordonnanceAPI = {
  getAll: () => api.get('/ordonnances'),
  getById: (id) => api.get(`/ordonnances/${id}`),
  getByConsultation: (consultationId) => api.get(`/ordonnances/consultation/${consultationId}`),
  create: (ordonnance) => api.post('/ordonnances', ordonnance),
  update: (id, ordonnance) => api.put(`/ordonnances/${id}`, ordonnance),
  delete: (id) => api.delete(`/ordonnances/${id}`),
  downloadPDF: (id) => api.get(`/ordonnances/${id}/pdf`, { responseType: 'blob' }),
};

export default api;
