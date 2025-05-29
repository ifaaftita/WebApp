import React, { useState } from 'react';
import './appointments.css';
import { 
  FaSearch, 
  FaPlus, 
  FaEye, 
  FaEdit, 
  FaTrash,
  FaChevronDown,
  FaTimes
} from 'react-icons/fa';

const Appointments = () => {
  // Sample rendez-vous data with time
  const [rendezVous, setRendezVous] = useState([
    { 
      id: 1, 
      client: 'AMIRA ZAARA', 
      date: '2025-05-12', 
      time: '09:00',
      motif: 'lunettes-complètes',
      status: 'terminé'
    },
    { 
      id: 2, 
      client: 'KENZA ROKH', 
      date: '2025-05-13', 
      time: '10:30',
      motif: 'lentilles-renouvellement',
      status: 'programmé'
    },
    { 
      id: 3, 
      client: 'AYTOUNI FATMA', 
      date: '2025-05-14', 
      time: '14:15',
      motif: 'verres-renouvellement',
      status: 'terminé'
    },
    { 
      id: 4, 
      client: 'AMINE TAKKALI', 
      date: '2025-05-15', 
      time: '16:45',
      motif: 'montures-renouvellement',
      status: 'terminé'
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [showAddRdvModal, setShowAddRdvModal] = useState(false);
  const [showEditRdvModal, setShowEditRdvModal] = useState(false);
  const [newRdv, setNewRdv] = useState({
    client: '',
    date: '',
    time: '',
    motif: '',
    status: ''
  });
  const [editingRdv, setEditingRdv] = useState(null);
  const [rdvToDelete, setRdvToDelete] = useState(null);
  const [viewingRdv, setViewingRdv] = useState(null);
  const [errors, setErrors] = useState({
    client: '',
    date: '',
    time: '',
    motif: '',
    status: ''
  });

  // Filter rendez-vous
  const filteredRdv = rendezVous.filter(rdv => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = (
      rdv.client.toLowerCase().includes(searchLower) ||
      rdv.date.includes(searchTerm) ||
      rdv.time.includes(searchTerm) ||
      (rdv.motif && rdv.motif.toLowerCase().includes(searchLower)))
    
    const matchesStatus = selectedFilter === 'all' || rdv.status === selectedFilter;
    
    return matchesSearch && matchesStatus;
  });

  const statusFilters = [
    { value: 'all', label: 'Tous les Rendez-vous' },
    { value: 'terminé', label: 'Terminé' },
    { value: 'programmé', label: 'Programmé' }
  ];

  const motifOptions = [
    { value: '', label: 'Sélectionner un motif' },
    { value: 'lunettes-complètes', label: 'Lunettes - complètes' },
    { value: 'lentilles-renouvellement', label: 'Lentilles - renouvellement' },
    { value: 'verres-renouvellement', label: 'Verres - renouvellement' },
    { value: 'montures-renouvellement', label: 'Montures - renouvellement' }
  ];

  // Handle add new rendez-vous modal
  const handleAddRdv = () => {
    setShowAddRdvModal(true);
    setNewRdv({
      client: '',
      date: '',
      time: '',
      motif: '',
      status: ''
    });
    setErrors({
      client: '',
      date: '',
      time: '',
      motif: '',
      status: ''
    });
  };

  const handleCloseModal = () => {
    setShowAddRdvModal(false);
  };

  const handleCloseEditModal = () => {
    setShowEditRdvModal(false);
    setEditingRdv(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const processedValue = name === 'client' ? value.toUpperCase() : value;
    setNewRdv(prev => ({
      ...prev,
      [name]: processedValue
    }));
    // Clear error when user starts typing
    setErrors(prev => ({
      ...prev,
      [name]: ''
    }));
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    const processedValue = name === 'client' ? value.toUpperCase() : value;
    setEditingRdv(prev => ({
      ...prev,
      [name]: processedValue
    }));
    // Clear error when user starts typing
    setErrors(prev => ({
      ...prev,
      [name]: ''
    }));
  };

  // Validate form function
  const validateForm = (formData, isEdit = false) => {
    const newErrors = {
      client: '',
      date: '',
      time: '',
      motif: '',
      status: ''
    };

    let isValid = true;

    if (!formData.client.trim()) {
      newErrors.client = 'Ce champ est obligatoire.';
      isValid = false;
    }

    if (!formData.date) {
      newErrors.date = 'Ce champ est obligatoire.';
      isValid = false;
    }

    if (!formData.time) {
      newErrors.time = 'Ce champ est obligatoire.';
      isValid = false;
    }

    if (!formData.motif) {
      newErrors.motif = 'Ce champ est obligatoire.';
      isValid = false;
    }

    if (!formData.status && !isEdit) {
      newErrors.status = 'Ce champ est obligatoire.';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmitRdv = (e) => {
    e.preventDefault();
    
    if (!validateForm(newRdv)) {
      return;
    }

    const rdv = {
      id: rendezVous.length + 1,
      client: newRdv.client.toUpperCase(),
      date: newRdv.date,
      time: newRdv.time,
      motif: newRdv.motif,
      status: newRdv.status
    };

    setRendezVous([...rendezVous, rdv]);
    handleCloseModal();
  };

  const handleUpdateRdv = (e) => {
    e.preventDefault();
    
    if (!validateForm(editingRdv, true)) {
      return;
    }

    const updatedRdv = {
      ...editingRdv,
      client: editingRdv.client.toUpperCase()
    };
    setRendezVous(rendezVous.map(rdv => 
      rdv.id === updatedRdv.id ? updatedRdv : rdv
    ));
    handleCloseEditModal();
  };

  // Action handlers
  const handleView = (rdvId) => {
    const rdv = rendezVous.find(r => r.id === rdvId);
    setViewingRdv(rdv);
  };

  const handleCloseView = () => {
    setViewingRdv(null);
  };

  const handleEdit = (rdvId) => {
    const rdv = rendezVous.find(r => r.id === rdvId);
    setEditingRdv({...rdv});
    setShowEditRdvModal(true);
    setErrors({
      client: '',
      date: '',
      time: '',
      motif: '',
      status: ''
    });
  };

  const handleDelete = (rdvId) => {
    setRdvToDelete(rdvId);
  };

  const confirmDelete = () => {
    setRendezVous(rendezVous.filter(rdv => rdv.id !== rdvToDelete));
    setRdvToDelete(null);
  };

  const cancelDelete = () => {
    setRdvToDelete(null);
  };

  return (
    <div className="rendezvous-section">
      {/* Add Rendez-vous Modal */}
      {showAddRdvModal && (
        <div className="modal-overlay">
          <div className="add-rdv-modal">
            <div className="modal-header">
              <h3>Ajouter un nouveau rendez-vous :</h3>
              <button className="close-modal" onClick={handleCloseModal}>
                <FaTimes />
              </button>
            </div>
            
            <div className="modal-content">
              <form onSubmit={handleSubmitRdv} noValidate>
                <div className="form-fields">
                  <div className="form-group">
                    <label htmlFor="client">Client :</label>
                    <input
                      type="text"
                      id="client"
                      name="client"
                      value={newRdv.client}
                      onChange={handleInputChange}
                      className={errors.client ? 'error' : ''}
                      style={{ textTransform: 'uppercase' }}
                    />
                    {errors.client && <span className="error-message">{errors.client}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="date">Date :</label>
                    <input
                      type="date"
                      id="date"
                      name="date"
                      value={newRdv.date}
                      onChange={handleInputChange}
                      className={errors.date ? 'error' : ''}
                    />
                    {errors.date && <span className="error-message">{errors.date}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="time">Heure :</label>
                    <input
                      type="time"
                      id="time"
                      name="time"
                      value={newRdv.time}
                      onChange={handleInputChange}
                      className={errors.time ? 'error' : ''}
                    />
                    {errors.time && <span className="error-message">{errors.time}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="motif">Motif :</label>
                    <select
                      id="motif"
                      name="motif"
                      value={newRdv.motif}
                      onChange={handleInputChange}
                      className={errors.motif ? 'error' : ''}
                    >
                      {motifOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    {errors.motif && <span className="error-message">{errors.motif}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="status">Statut :</label>
                    <select
                      id="status"
                      name="status"
                      value={newRdv.status}
                      onChange={handleInputChange}
                      className={errors.status ? 'error' : ''}
                    >
                      <option value="">Sélectionner un statut</option>
                      <option value="terminé">Terminé</option>
                      <option value="programmé">Programmer</option>
                    </select>
                    {errors.status && <span className="error-message">{errors.status}</span>}
                  </div>
                </div>
                
                <div className="modal-actions">
                  <button type="button" className="btn cancel" onClick={handleCloseModal}>
                    Annuler
                  </button>
                  <button type="submit" className="btn submit">
                    Terminé
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit Rendez-vous Modal */}
      {showEditRdvModal && editingRdv && (
        <div className="modal-overlay">
          <div className="add-rdv-modal">
            <div className="modal-header">
              <h3>Modifier le Rendez-vous :</h3>
              <button className="close-modal" onClick={handleCloseEditModal}>
                <FaTimes />
              </button>
            </div>
            
            <div className="modal-content">
              <form onSubmit={handleUpdateRdv} noValidate>
                <div className="form-fields">
                  <div className="form-group">
                    <label htmlFor="edit-client">Client :</label>
                    <input
                      type="text"
                      id="edit-client"
                      name="client"
                      value={editingRdv.client}
                      onChange={handleEditInputChange}
                      className={errors.client ? 'error' : ''}
                      style={{ textTransform: 'uppercase' }}
                    />
                    {errors.client && <span className="error-message">{errors.client}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="edit-date">Date :</label>
                    <input
                      type="date"
                      id="edit-date"
                      name="date"
                      value={editingRdv.date}
                      onChange={handleEditInputChange}
                      className={errors.date ? 'error' : ''}
                    />
                    {errors.date && <span className="error-message">{errors.date}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="edit-time">Heure :</label>
                    <input
                      type="time"
                      id="edit-time"
                      name="time"
                      value={editingRdv.time}
                      onChange={handleEditInputChange}
                      className={errors.time ? 'error' : ''}
                    />
                    {errors.time && <span className="error-message">{errors.time}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="edit-motif">Motif :</label>
                    <select
                      id="edit-motif"
                      name="motif"
                      value={editingRdv.motif}
                      onChange={handleEditInputChange}
                      className={errors.motif ? 'error' : ''}
                    >
                      {motifOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    {errors.motif && <span className="error-message">{errors.motif}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="edit-status">Statut :</label>
                    <select
                      id="edit-status"
                      name="status"
                      value={editingRdv.status}
                      onChange={handleEditInputChange}
                      className={errors.status ? 'error' : ''}
                    >
                      <option value="terminé">Terminé</option>
                      <option value="programmé">Programmé</option>
                    </select>
                    {errors.status && <span className="error-message">{errors.status}</span>}
                  </div>
                </div>
                
                <div className="modal-actions">
                  <button type="button" className="btn cancel" onClick={handleCloseEditModal}>
                    Annuler
                  </button>
                  <button type="submit" className="btn submit">
                    Enregistrer
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {rdvToDelete && (
        <div className="modal-overlay">
          <div className="delete-confirmation-modal">
            <div className="modal-header">
              <h3>Supprimer?</h3>
              <button className="close-modal" onClick={cancelDelete}>
                <FaTimes />
              </button>
            </div>
            <div className="modal-content">
              <p>Êtes-vous sûr de vouloir supprimer ce rendez-vous?</p>
              <div className="modal-actions">
                <button 
                  type="button" 
                  className="btn cancel" 
                  onClick={cancelDelete}
                >
                  Annuler
                </button>
                <button 
                  type="button" 
                  className="btn close" 
                  onClick={confirmDelete}
                >
                  Supprimer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View Rendez-vous Modal */}
      {viewingRdv && (
        <div className="modal-overlay">
          <div className="view-rdv-modal">
            <div className="modal-header">
              <h3>Détails du Rendez-vous :</h3>
              <button className="close-modal" onClick={handleCloseView}>
                <FaTimes />
              </button>
            </div>
            
            <div className="modal-content">
              <div className="rdv-details">
                <div className="detail-row">
                  <div className="detail-label">Client :</div>
                  <div className="detail-value">{viewingRdv.client}</div>
                </div>
                <div className="detail-row">
                  <div className="detail-label">Date :</div>
                  <div className="detail-value">{viewingRdv.date}</div>
                </div>
                <div className="detail-row">
                  <div className="detail-label">Heure :</div>
                  <div className="detail-value">{viewingRdv.time}</div>
                </div>
                <div className="detail-row">
                  <div className="detail-label">Motif :</div>
                  <div className="detail-value">
                    {motifOptions.find(opt => opt.value === viewingRdv.motif)?.label || '-'}
                  </div>
                </div>
                <div className="detail-row">
                  <div className="detail-label">Statut :</div>
                  <div className="detail-value">
                    <span className={`status-badge ${viewingRdv.status.replace(' ', '-')}`}>
                      {viewingRdv.status}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="modal-actions">
                <button 
                  type="button" 
                  className="btn cancel" 
                  onClick={handleCloseView}
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Rendez-vous Section */}
      <div className="rendezvous-header">
        <h2>Rendez-vous</h2>
        <div className="rendezvous-controls">
          <div className="search-bar">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Rechercher un rendez-vous ..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="filter-dropdown">
            <button 
              className="filter-toggle"
              onClick={() => setFilterOpen(!filterOpen)}
            >
              <span>
                {statusFilters.find(f => f.value === selectedFilter)?.label}
              </span>
              <FaChevronDown className={`dropdown-icon ${filterOpen ? 'open' : ''}`} />
            </button>
            
            {filterOpen && (
              <div className="filter-options">
                {statusFilters.map(filter => (
                  <button
                    key={filter.value}
                    className={`filter-option ${selectedFilter === filter.value ? 'active' : ''}`}
                    onClick={() => {
                      setSelectedFilter(filter.value);
                      setFilterOpen(false);
                    }}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
            )}
          </div>
          
          <button 
            className="btn add-rdv-btn"
            onClick={handleAddRdv}
          >
            <FaPlus className="btn-icon" /> 
            <span>Ajouter Rendez-vous</span>
          </button>
        </div>
      </div>

      <div className="rendezvous-table-container">
        {filteredRdv.length > 0 ? (
          <table className="rendezvous-table">
            <thead>
              <tr>
                <th>Client</th>
                <th>Date</th>
                <th>Heure</th>
                <th>Motif</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRdv.map((rdv) => (
                <tr key={rdv.id}>
                  <td>{rdv.client}</td>
                  <td>{rdv.date}</td>
                  <td>{rdv.time}</td>
                  <td>
                    {motifOptions.find(opt => opt.value === rdv.motif)?.label || '-'}
                  </td>
                  <td>
                    <span className={`status-badge ${rdv.status.replace(' ', '-')}`}>
                      {rdv.status}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        className="btn action-button view"
                        onClick={() => handleView(rdv.id)}
                      >
                        <FaEye className="action-icon" />
                      </button>
                      <button 
                        className="btn action-button edit"
                        onClick={() => handleEdit(rdv.id)}
                      >
                        <FaEdit className="action-icon" />
                      </button>
                      <button 
                        className="btn action-button delete"
                        onClick={() => handleDelete(rdv.id)}
                      >
                        <FaTrash className="action-icon" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="no-results">
            Aucun rendez-vous trouvé
          </div>
        )}
      </div>
    </div>
  );
};

export default Appointments;