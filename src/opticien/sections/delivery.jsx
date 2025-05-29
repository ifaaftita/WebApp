import React, { useState } from 'react';
import './delivery.css';
import { 
  FaSearch, 
  FaPlus, 
  FaEye, 
  FaEdit, 
  FaTrash,
  FaChevronDown,
  FaTimes
} from 'react-icons/fa';

const Delivry = () => {
  // Sample delivery data
  const [deliveries, setDeliveries] = useState([
    { 
      id: 1, 
      firstName: 'Ahmed', 
      lastName: 'Ben Salah',
      phone: '98765432',
      email: 'ahmed.bensalah@example.com',
      status: 'Actif'
    },
    { 
      id: 2, 
      firstName: 'Samira', 
      lastName: 'Trabelsi',
      phone: '12345678',
      email: 'samira.trabelsi@example.com',
      status: 'Inactif'
    },
    { 
      id: 3, 
      firstName: 'Youssef', 
      lastName: 'Mansouri',
      phone: '54321678',
      email: 'youssef.mansouri@example.com',
      status: 'Actif'
    }
  ]);

  // State management
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddDeliveryModal, setShowAddDeliveryModal] = useState(false);
  const [showEditDeliveryModal, setShowEditDeliveryModal] = useState(false);
  const [newDelivery, setNewDelivery] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    status: 'Actif'
  });
  const [editingDelivery, setEditingDelivery] = useState(null);
  const [deliveryToDelete, setDeliveryToDelete] = useState(null);
  const [viewingDelivery, setViewingDelivery] = useState(null);
  const [formErrors, setFormErrors] = useState({});

  // Filter deliveries
  const filteredDeliveries = deliveries.filter(delivery => {
    const searchLower = searchTerm.toLowerCase();
    return (
      delivery.firstName.toLowerCase().includes(searchLower) ||
      delivery.lastName.toLowerCase().includes(searchLower) ||
      delivery.phone.includes(searchTerm) ||
      delivery.email.toLowerCase().includes(searchLower)
    );
  });

  // Handle form changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewDelivery(prev => ({
      ...prev,
      [name]: value
    }));
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Similar handlers for editing
  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditingDelivery(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Modal handlers
  const handleAddDelivery = () => {
    setShowAddDeliveryModal(true);
  };

  const handleCloseModal = () => {
    setShowAddDeliveryModal(false);
    setNewDelivery({
      firstName: '',
      lastName: '',
      phone: '',
      email: '',
      status: 'Actif'
    });
    setFormErrors({});
  };

  const handleCloseEditModal = () => {
    setShowEditDeliveryModal(false);
    setEditingDelivery(null);
  };

  // Validate form
  const validateForm = (formData) => {
    const errors = {};
    if (!formData.firstName.trim()) errors.firstName = 'ce champs est obligatoire.';
    if (!formData.lastName.trim()) errors.lastName = 'ce champs est obligatoire.';
    if (!formData.phone.trim()) errors.phone = 'ce champs est obligatoire.';
    if (!formData.email.trim()) errors.email = 'ce champs est obligatoire.';
    return errors;
  };

  // Form submission
  const handleSubmitDelivery = (e) => {
    e.preventDefault();
    const errors = validateForm(newDelivery);
    
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    const delivery = {
      id: deliveries.length + 1,
      ...newDelivery
    };
    setDeliveries([...deliveries, delivery]);
    handleCloseModal();
  };

  const handleUpdateDelivery = (e) => {
    e.preventDefault();
    const errors = validateForm(editingDelivery);
    
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setDeliveries(deliveries.map(d => 
      d.id === editingDelivery.id ? editingDelivery : d
    ));
    handleCloseEditModal();
  };

  // Action handlers
  const handleView = (deliveryId) => {
    const delivery = deliveries.find(d => d.id === deliveryId);
    setViewingDelivery(delivery);
  };

  const handleCloseView = () => {
    setViewingDelivery(null);
  };

  const handleEdit = (deliveryId) => {
    const delivery = deliveries.find(d => d.id === deliveryId);
    setEditingDelivery({...delivery});
    setShowEditDeliveryModal(true);
    setFormErrors({});
  };

  const handleDelete = (deliveryId) => {
    setDeliveryToDelete(deliveryId);
  };

  const confirmDelete = () => {
    setDeliveries(deliveries.filter(d => d.id !== deliveryToDelete));
    setDeliveryToDelete(null);
  };

  const cancelDelete = () => {
    setDeliveryToDelete(null);
  };

  return (
    <div className="delivry-section">
      {/* Add Delivery Modal */}
      {showAddDeliveryModal && (
        <div className="modal-overlay">
          <div className="add-delivry-modal">
            <div className="modal-header">
              <h3>Ajouter un nouveau livreur :</h3>
              <button className="close-modal" onClick={handleCloseModal}>
                <FaTimes />
              </button>
            </div>
            
            <div className="modal-content">
              <form onSubmit={handleSubmitDelivery} noValidate>
                <div className="form-fields">
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="firstName">Prénom :</label>
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={newDelivery.firstName}
                        onChange={handleInputChange}
                      />
                      {formErrors.firstName && <span className="error-message">{formErrors.firstName}</span>}
                    </div>
                    <div className="form-group">
                      <label htmlFor="lastName">Nom :</label>
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={newDelivery.lastName}
                        onChange={handleInputChange}
                      />
                      {formErrors.lastName && <span className="error-message">{formErrors.lastName}</span>}
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="phone">Téléphone :</label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={newDelivery.phone}
                        onChange={handleInputChange}
                      />
                      {formErrors.phone && <span className="error-message">{formErrors.phone}</span>}
                    </div>
                    <div className="form-group">
                      <label htmlFor="email">Email :</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={newDelivery.email}
                        onChange={handleInputChange}
                      />
                      {formErrors.email && <span className="error-message">{formErrors.email}</span>}
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="status">Statut :</label>
                    <select
                      id="status"
                      name="status"
                      value={newDelivery.status}
                      onChange={handleInputChange}
                    >
                      <option value="Actif">Actif</option>
                      <option value="Inactif">Inactif</option>
                    </select>
                  </div>
                </div>
                
                <div className="modal-actions">
                  <button type="button" className="btn cancel" onClick={handleCloseModal}>
                    Annuler
                  </button>
                  <button type="submit" className="btn submit">
                    Ajouter
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit Delivery Modal */}
      {showEditDeliveryModal && editingDelivery && (
        <div className="modal-overlay">
          <div className="add-delivry-modal">
            <div className="modal-header">
              <h3>Modifier le livreur :</h3>
              <button className="close-modal" onClick={handleCloseEditModal}>
                <FaTimes />
              </button>
            </div>
            
            <div className="modal-content">
              <form onSubmit={handleUpdateDelivery} noValidate>
                <div className="form-fields">
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="edit-firstName">Prénom :</label>
                      <input
                        type="text"
                        id="edit-firstName"
                        name="firstName"
                        value={editingDelivery.firstName}
                        onChange={handleEditInputChange}
                      />
                      {formErrors.firstName && <span className="error-message">{formErrors.firstName}</span>}
                    </div>
                    <div className="form-group">
                      <label htmlFor="edit-lastName">Nom :</label>
                      <input
                        type="text"
                        id="edit-lastName"
                        name="lastName"
                        value={editingDelivery.lastName}
                        onChange={handleEditInputChange}
                      />
                      {formErrors.lastName && <span className="error-message">{formErrors.lastName}</span>}
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="edit-phone">Téléphone :</label>
                      <input
                        type="tel"
                        id="edit-phone"
                        name="phone"
                        value={editingDelivery.phone}
                        onChange={handleEditInputChange}
                      />
                      {formErrors.phone && <span className="error-message">{formErrors.phone}</span>}
                    </div>
                    <div className="form-group">
                      <label htmlFor="edit-email">Email :</label>
                      <input
                        type="email"
                        id="edit-email"
                        name="email"
                        value={editingDelivery.email}
                        onChange={handleEditInputChange}
                      />
                      {formErrors.email && <span className="error-message">{formErrors.email}</span>}
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="edit-status">Statut :</label>
                    <select
                      id="edit-status"
                      name="status"
                      value={editingDelivery.status}
                      onChange={handleEditInputChange}
                    >
                      <option value="Actif">Actif</option>
                      <option value="Inactif">Inactif</option>
                    </select>
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
      {deliveryToDelete && (
        <div className="modal-overlay">
          <div className="delete-confirmation-modal">
            <h3>Supprimer?</h3>
            <p>Êtes-vous sûr de vouloir supprimer ce livreur?</p>
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

      {/* View Delivery Modal */}
      {viewingDelivery && (
        <div className="modal-overlay">
          <div className="view-delivry-modal">
            <div className="modal-header">
              <h3>Détails du livreur :</h3>
              <button className="close-modal" onClick={handleCloseView}>
                <FaTimes />
              </button>
            </div>
            
            <div className="delivry-details">
              <div className="detail-row">
                <span className="detail-label">Nom complet :</span>
                <span className="detail-value">{viewingDelivery.firstName} {viewingDelivery.lastName}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Téléphone :</span>
                <span className="detail-value">{viewingDelivery.phone}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Email :</span>
                <span className="detail-value">{viewingDelivery.email}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Statut :</span>
                <span className="detail-value">{viewingDelivery.status}</span>
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

      {/* Main Deliveries Section */}
      <div className="delivry-header">
        <h2>Livreurs</h2>
        <div className="delivry-controls">
          <div className="search-bar">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Rechercher un livreur ..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <button 
            className="btn add-delivry-btn"
            onClick={handleAddDelivery}
          >
            <FaPlus className="btn-icon" /> 
            <span>Ajouter Livreur</span>
          </button>
        </div>
      </div>

      <div className="delivry-table-container">
        {filteredDeliveries.length > 0 ? (
          <table className="delivry-table">
            <thead>
              <tr>
                <th>Livreur</th>
                <th>Téléphone</th>
                <th>Email</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredDeliveries.map((delivery) => (
                <tr key={delivery.id}>
                  <td>{`${delivery.firstName} ${delivery.lastName}`}</td>
                  <td>{delivery.phone}</td>
                  <td>{delivery.email}</td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        className="btn action-button view"
                        onClick={() => handleView(delivery.id)}
                      >
                        <FaEye className="action-icon" />
                      </button>
                      <button 
                        className="btn action-button edit"
                        onClick={() => handleEdit(delivery.id)}
                      >
                        <FaEdit className="action-icon" />
                      </button>
                      <button 
                        className="btn action-button delete"
                        onClick={() => handleDelete(delivery.id)}
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
            <p>Aucun livreur trouvé</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Delivry;