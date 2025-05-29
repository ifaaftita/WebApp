import React, { useState } from 'react';
import './prescriptions.css';
import { 
  FaSearch, 
  FaPlus, 
  FaEye, 
  FaEdit, 
  FaTrash,
  FaChevronDown,
  FaTimes
} from 'react-icons/fa';

const Prescriptions = () => {
  // Sample prescriptions data
  const [ordonnances, setOrdonnances] = useState([
    { 
      id: 1, 
      client: 'AMIRA ZAARA', 
      date: '2025-05-12', 
      status: 'en cours',
      correctionType: 'Loin',
      od: {
        sph: '-2.00',
        cyl: '-0.50',
        axe: '90°',
        add: '+1.50'
      },
      og: {
        sph: '-2.25',
        cyl: '-0.75',
        axe: '90°',
        add: '+1.50'
      },
      mesures: {
        eip: '30 mm',
        h: '18 mm'
      }
    },
    { 
      id: 2, 
      client: 'KENZA ROKH', 
      date: '2025-05-13', 
      status: 'terminé',
      correctionType: 'Près',
      od: {
        sph: '-1.00',
        cyl: '-0.25',
        axe: '45°',
        add: '+2.00'
      },
      og: {
        sph: '-1.25',
        cyl: '-0.50',
        axe: '45°',
        add: '+2.00'
      },
      mesures: {
        eip: '31 mm',
        h: '17 mm'
      }
    }
  ]);

  // Dropdown options
  const correctionTypes = ['Loin', 'Près'];
  const sphOptions = ['-6.00', '-5.00', '-4.00', '-3.00', '-2.00', '-1.00', '0.00', '+0.50', '+1.00', '+1.50', '+2.00', '+2.50'];
  const cylOptions = ['0.00', '-0.25', '-0.50', '-0.75', '-1.00', '-1.25'];
  const axeOptions = ['0°', '10°', '20°', '30°', '45°', '60°', '90°', '120°', '135°', '150°', '180°'];
  const addOptions = ['+0.75', '+1.00', '+1.25', '+1.50', '+1.75', '+2.00', '+2.25', '+2.50', '+2.75', '+3.00'];
  const eipOptions = ['28 mm', '29 mm', '30 mm', '31 mm', '32 mm'];
  const hOptions = ['16 mm', '17 mm', '18 mm', '19 mm', '20 mm'];

  // State management
  const [searchTerm, setSearchTerm] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [showAddOrdonnanceModal, setShowAddOrdonnanceModal] = useState(false);
  const [showEditOrdonnanceModal, setShowEditOrdonnanceModal] = useState(false);
  const [newOrdonnance, setNewOrdonnance] = useState({
    client: '',
    date: '',
    status: 'en cours',
    correctionType: 'Loin',
    od: {
      sph: '0.00',
      cyl: '0.00',
      axe: '0°',
      add: '+0.75'
    },
    og: {
      sph: '0.00',
      cyl: '0.00',
      axe: '0°',
      add: '+0.75'
    },
    mesures: {
      eip: '30 mm',
      h: '18 mm'
    }
  });
  const [editingOrdonnance, setEditingOrdonnance] = useState(null);
  const [ordonnanceToDelete, setOrdonnanceToDelete] = useState(null);
  const [viewingOrdonnance, setViewingOrdonnance] = useState(null);

  // Filter ordonnances
  const filteredOrdonnances = ordonnances.filter(ordonnance => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = (
      ordonnance.client.toLowerCase().includes(searchLower) ||
      ordonnance.date.includes(searchTerm))
    
    const matchesStatus = selectedFilter === 'all' || ordonnance.status === selectedFilter;
    
    return matchesSearch && matchesStatus;
  });

  const statusFilters = [
    { value: 'all', label: 'Toutes les Ordonnances' },
    { value: 'en cours', label: 'En cours' },
    { value: 'terminé', label: 'Terminé' },
    { value: 'programmé', label: "Programmé" }
  ];

  // Handle form changes with uppercase conversion for client name
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewOrdonnance(prev => ({
      ...prev,
      [name]: name === 'client' ? value.toUpperCase() : value
    }));
  };

  const handleEyeInputChange = (eye, field, value) => {
    setNewOrdonnance(prev => ({
      ...prev,
      [eye]: {
        ...prev[eye],
        [field]: value
      }
    }));
  };

  const handleMesuresInputChange = (field, value) => {
    setNewOrdonnance(prev => ({
      ...prev,
      mesures: {
        ...prev.mesures,
        [field]: value
      }
    }));
  };

  // Similar handlers for editing with uppercase conversion for client name
  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditingOrdonnance(prev => ({
      ...prev,
      [name]: name === 'client' ? value.toUpperCase() : value
    }));
  };

  const handleEditEyeInputChange = (eye, field, value) => {
    setEditingOrdonnance(prev => ({
      ...prev,
      [eye]: {
        ...prev[eye],
        [field]: value
      }
    }));
  };

  const handleEditMesuresInputChange = (field, value) => {
    setEditingOrdonnance(prev => ({
      ...prev,
      mesures: {
        ...prev.mesures,
        [field]: value
      }
    }));
  };

  // Modal handlers
  const handleAddOrdonnance = () => {
    setShowAddOrdonnanceModal(true);
  };

  const handleCloseModal = () => {
    setShowAddOrdonnanceModal(false);
    setNewOrdonnance({
      client: '',
      date: '',
      status: 'en cours',
      correctionType: 'Loin',
      od: {
        sph: '0.00',
        cyl: '0.00',
        axe: '0°',
        add: '+0.75'
      },
      og: {
        sph: '0.00',
        cyl: '0.00',
        axe: '0°',
        add: '+0.75'
      },
      mesures: {
        eip: '30 mm',
        h: '18 mm'
      }
    });
  };

  const handleCloseEditModal = () => {
    setShowEditOrdonnanceModal(false);
    setEditingOrdonnance(null);
  };

  // Form submission with uppercase enforcement for client name
  const handleSubmitOrdonnance = (e) => {
    e.preventDefault();
    const ordonnance = {
      id: ordonnances.length + 1,
      ...newOrdonnance,
      client: newOrdonnance.client.toUpperCase() // Ensure uppercase
    };
    setOrdonnances([...ordonnances, ordonnance]);
    handleCloseModal();
  };

  const handleUpdateOrdonnance = (e) => {
    e.preventDefault();
    const updatedOrdonnance = {
      ...editingOrdonnance,
      client: editingOrdonnance.client.toUpperCase() // Ensure uppercase
    };
    setOrdonnances(ordonnances.map(o => 
      o.id === updatedOrdonnance.id ? updatedOrdonnance : o
    ));
    handleCloseEditModal();
  };

  // Action handlers
  const handleView = (ordonnanceId) => {
    const ordonnance = ordonnances.find(o => o.id === ordonnanceId);
    setViewingOrdonnance(ordonnance);
  };

  const handleCloseView = () => {
    setViewingOrdonnance(null);
  };

  const handleEdit = (ordonnanceId) => {
    const ordonnance = ordonnances.find(o => o.id === ordonnanceId);
    setEditingOrdonnance({...ordonnance});
    setShowEditOrdonnanceModal(true);
  };

  const handleDelete = (ordonnanceId) => {
    setOrdonnanceToDelete(ordonnanceId);
  };

  const confirmDelete = () => {
    setOrdonnances(ordonnances.filter(o => o.id !== ordonnanceToDelete));
    setOrdonnanceToDelete(null);
  };

  const cancelDelete = () => {
    setOrdonnanceToDelete(null);
  };

  // Render dropdown select
  const renderSelect = (options, value, onChange, name) => (
    <select
      value={value}
      onChange={onChange}
      name={name}
      className="form-select"
    >
      {options.map(option => (
        <option key={option} value={option}>{option}</option>
      ))}
    </select>
  );

  // Render eye correction form section
  const renderEyeCorrectionForm = (prefix, eyeData, handleChange) => (
    <div className="eye-correction-section">
      <h4>{prefix === 'od' ? 'Œil Droit (OD)' : 'Œil Gauche (OG)'}</h4>
      <div className="form-row">
        <div className="form-group">
          <label>Sphère</label>
          {renderSelect(
            sphOptions,
            eyeData.sph,
            (e) => handleChange(prefix, 'sph', e.target.value),
            `${prefix}-sph`
          )}
        </div>
        <div className="form-group">
          <label>Cylindre</label>
          {renderSelect(
            cylOptions,
            eyeData.cyl,
            (e) => handleChange(prefix, 'cyl', e.target.value),
            `${prefix}-cyl`
          )}
        </div>
      </div>
      <div className="form-row">
        <div className="form-group">
          <label>Axe</label>
          {renderSelect(
            axeOptions,
            eyeData.axe,
            (e) => handleChange(prefix, 'axe', e.target.value),
            `${prefix}-axe`
          )}
        </div>
        <div className="form-group">
          <label>Addition</label>
          {renderSelect(
            addOptions,
            eyeData.add,
            (e) => handleChange(prefix, 'add', e.target.value),
            `${prefix}-add`
          )}
        </div>
      </div>
    </div>
  );

  // Render mesures section
  const renderMesuresForm = (mesuresData, handleChange) => (
    <div className="mesures-section">
      <h4>Mesures supplémentaires</h4>
      <div className="form-row">
        <div className="form-group">
          <label>EIP</label>
          {renderSelect(
            eipOptions,
            mesuresData.eip,
            (e) => handleChange('eip', e.target.value),
            'eip'
          )}
        </div>
        <div className="form-group">
          <label>Hauteur</label>
          {renderSelect(
            hOptions,
            mesuresData.h,
            (e) => handleChange('h', e.target.value),
            'h'
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="prescriptions-section">
      {/* Add Ordonnance Modal */}
      {showAddOrdonnanceModal && (
        <div className="modal-overlay">
          <div className="add-ordonnance-modal">
            <div className="modal-header">
              <h3>Ajouter une nouvelle ordonnance :</h3>
              <button className="close-modal" onClick={handleCloseModal}>
                <FaTimes />
              </button>
            </div>
            
            <div className="modal-content">
              <form onSubmit={handleSubmitOrdonnance}>
                <div className="form-fields">
                  <div className="form-group">
                    <label htmlFor="client">Client :</label>
                    <input
                      type="text"
                      id="client"
                      name="client"
                      value={newOrdonnance.client}
                      onChange={handleInputChange}
                      style={{ textTransform: 'uppercase' }}
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="date">Date :</label>
                      <input
                        type="date"
                        id="date"
                        name="date"
                        value={newOrdonnance.date}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="status">Statut :</label>
                      <select
                        id="status"
                        name="status"
                        value={newOrdonnance.status}
                        onChange={handleInputChange}
                      >
                        <option value="en cours">En cours</option>
                        <option value="terminé">Terminé</option>
                        <option value="programmé">Programmé</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="correctionType">Type de correction :</label>
                    <select
                      id="correctionType"
                      name="correctionType"
                      value={newOrdonnance.correctionType}
                      onChange={handleInputChange}
                    >
                      {correctionTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>

                  {renderEyeCorrectionForm('od', newOrdonnance.od, handleEyeInputChange)}
                  {renderEyeCorrectionForm('og', newOrdonnance.og, handleEyeInputChange)}
                  {renderMesuresForm(newOrdonnance.mesures, handleMesuresInputChange)}
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

      {/* Edit Ordonnance Modal */}
      {showEditOrdonnanceModal && editingOrdonnance && (
        <div className="modal-overlay">
          <div className="add-ordonnance-modal">
            <div className="modal-header">
              <h3>Modifier l'Ordonnance :</h3>
              <button className="close-modal" onClick={handleCloseEditModal}>
                <FaTimes />
              </button>
            </div>
            
            <div className="modal-content">
              <form onSubmit={handleUpdateOrdonnance}>
                <div className="form-fields">
                  <div className="form-group">
                    <label htmlFor="edit-client">Client :</label>
                    <input
                      type="text"
                      id="edit-client"
                      name="client"
                      value={editingOrdonnance.client}
                      onChange={handleEditInputChange}
                      style={{ textTransform: 'uppercase' }}
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="edit-date">Date :</label>
                      <input
                        type="date"
                        id="edit-date"
                        name="date"
                        value={editingOrdonnance.date}
                        onChange={handleEditInputChange}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="edit-status">Statut :</label>
                      <select
                        id="edit-status"
                        name="status"
                        value={editingOrdonnance.status}
                        onChange={handleEditInputChange}
                      >
                        <option value="en cours">En cours</option>
                        <option value="terminé">Terminé</option>
                        <option value="programmé">Programmé
                        </option>
                      </select>
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="edit-correctionType">Type de correction :</label>
                    <select
                      id="edit-correctionType"
                      name="correctionType"
                      value={editingOrdonnance.correctionType}
                      onChange={handleEditInputChange}
                    >
                      {correctionTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>

                  {renderEyeCorrectionForm('od', editingOrdonnance.od, handleEditEyeInputChange)}
                  {renderEyeCorrectionForm('og', editingOrdonnance.og, handleEditEyeInputChange)}
                  {renderMesuresForm(editingOrdonnance.mesures, handleEditMesuresInputChange)}
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
      {ordonnanceToDelete && (
        <div className="modal-overlay">
          <div className="delete-confirmation-modal">
            <h3>Supprimer?</h3>
            <p>Êtes-vous sûr de vouloir supprimer cette ordonnance?</p>
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
                className="btn delete" 
                onClick={confirmDelete}
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Ordonnance Modal */}
      {viewingOrdonnance && (
        <div className="modal-overlay">
          <div className="view-ordonnance-modal">
            <div className="modal-header">
              <h3>Détails de l'ordonnance :</h3>
              <button className="close-modal" onClick={handleCloseView}>
                <FaTimes />
              </button>
            </div>
            
            <div className="ordonnance-details">
              <div className="detail-row">
                <span className="detail-label">Client :</span>
                <span className="detail-value">{viewingOrdonnance.client}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Date :</span>
                <span className="detail-value">{viewingOrdonnance.date}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Statut :</span>
                <span className="detail-value">{viewingOrdonnance.status}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Type de correction :</span>
                <span className="detail-value">{viewingOrdonnance.correctionType}</span>
              </div>
              
              <div className="eye-correction-details">
                <h4>Œil Droit (OD)</h4>
                <div className="detail-grid">
                  <div className="detail-item">
                    <span className="detail-label">Sphère :</span>
                    <span className="detail-value">{viewingOrdonnance.od.sph}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Cylindre :</span>
                    <span className="detail-value">{viewingOrdonnance.od.cyl}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Axe :</span>
                    <span className="detail-value">{viewingOrdonnance.od.axe}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Addition :</span>
                    <span className="detail-value">{viewingOrdonnance.od.add}</span>
                  </div>
                </div>
              </div>
              
              <div className="eye-correction-details">
                <h4>Œil Gauche (OG)</h4>
                <div className="detail-grid">
                  <div className="detail-item">
                    <span className="detail-label">Sphère :</span>
                    <span className="detail-value">{viewingOrdonnance.og.sph}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Cylindre :</span>
                    <span className="detail-value">{viewingOrdonnance.og.cyl}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Axe :</span>
                    <span className="detail-value">{viewingOrdonnance.og.axe}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Addition :</span>
                    <span className="detail-value">{viewingOrdonnance.og.add}</span>
                  </div>
                </div>
              </div>
              
              <div className="mesures-details">
                <h4>Mesures supplémentaires</h4>
                <div className="detail-grid">
                  <div className="detail-item">
                    <span className="detail-label">EIP :</span>
                    <span className="detail-value">{viewingOrdonnance.mesures.eip}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Hauteur :</span>
                    <span className="detail-value">{viewingOrdonnance.mesures.h}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="modal-actions">
              <button 
                type="button" 
                className="btn close" 
                onClick={handleCloseView}
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Ordonnances Section */}
      <div className="prescriptions-header">
        <h2>Ordonnances</h2>
        <div className="prescriptions-controls">
          <div className="search-bar">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Rechercher une ordonnance ..."
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
            className="btn add-ordonnance-btn"
            onClick={handleAddOrdonnance}
          >
            <FaPlus className="btn-icon" /> 
            <span>Ajouter Ordonnance</span>
          </button>
        </div>
      </div>

      <div className="prescriptions-table-container">
        {filteredOrdonnances.length > 0 ? (
          <table className="prescriptions-table">
            <thead>
              <tr>
                <th>Client</th>
                <th>Date</th>
                <th>Type</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrdonnances.map((ordonnance) => (
                <tr key={ordonnance.id}>
                  <td>{ordonnance.client}</td>
                  <td>{ordonnance.date}</td>
                  <td>{ordonnance.correctionType}</td>
                  <td>{ordonnance.status}</td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        className="btn action-button view"
                        onClick={() => handleView(ordonnance.id)}
                      >
                        <FaEye className="action-icon" />
                      </button>
                      <button 
                        className="btn action-button edit"
                        onClick={() => handleEdit(ordonnance.id)}
                      >
                        <FaEdit className="action-icon" />
                      </button>
                      <button 
                        className="btn action-button delete"
                        onClick={() => handleDelete(ordonnance.id)}
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
            <p>Aucune ordonnance trouvée</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Prescriptions;