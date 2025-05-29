import React, { useState } from 'react';
import './suppliers.css';
import { 
  FaSearch, 
  FaPlus, 
  FaEye, 
  FaEdit, 
  FaTrash,
  FaChevronDown,
  FaTimes
} from 'react-icons/fa';

const Suppliers = () => {
  // Sample suppliers data
  const [suppliers, setSuppliers] = useState([
    { 
      id: 1, 
      firstName: 'Mohamed', 
      lastName: 'Ben Ali',
      phone: '12345678',
      email: 'mohamed.benali@example.com'
    },
    { 
      id: 2, 
      firstName: 'Amira', 
      lastName: 'Khalil',
      phone: '98765432',
      email: 'amira.khalil@example.com'
    },
    { 
      id: 3, 
      firstName: 'Karim', 
      lastName: 'Sassi',
      phone: '54321678',
      email: 'karim.sassi@example.com'
    }
  ]);

  // State management
  const [searchTerm, setSearchTerm] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [showAddSupplierModal, setShowAddSupplierModal] = useState(false);
  const [showEditSupplierModal, setShowEditSupplierModal] = useState(false);
  const [newSupplier, setNewSupplier] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: ''
  });
  const [editingSupplier, setEditingSupplier] = useState(null);
  const [supplierToDelete, setSupplierToDelete] = useState(null);
  const [viewingSupplier, setViewingSupplier] = useState(null);
  const [formErrors, setFormErrors] = useState({});

  // Filter suppliers
  const filteredSuppliers = suppliers.filter(supplier => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = (
      supplier.firstName.toLowerCase().includes(searchLower) ||
      supplier.lastName.toLowerCase().includes(searchLower) ||
      supplier.phone.includes(searchTerm) ||
      supplier.email.toLowerCase().includes(searchLower))
    
    return matchesSearch;
  });

  // Handle form changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewSupplier(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
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
    setEditingSupplier(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Modal handlers
  const handleAddSupplier = () => {
    setShowAddSupplierModal(true);
  };

  const handleCloseModal = () => {
    setShowAddSupplierModal(false);
    setNewSupplier({
      firstName: '',
      lastName: '',
      phone: '',
      email: ''
    });
    setFormErrors({});
  };

  const handleCloseEditModal = () => {
    setShowEditSupplierModal(false);
    setEditingSupplier(null);
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
  const handleSubmitSupplier = (e) => {
    e.preventDefault();
    const errors = validateForm(newSupplier);
    
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    const supplier = {
      id: suppliers.length + 1,
      ...newSupplier
    };
    setSuppliers([...suppliers, supplier]);
    handleCloseModal();
  };

  const handleUpdateSupplier = (e) => {
    e.preventDefault();
    const errors = validateForm(editingSupplier);
    
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setSuppliers(suppliers.map(s => 
      s.id === editingSupplier.id ? editingSupplier : s
    ));
    handleCloseEditModal();
  };

  // Action handlers
  const handleView = (supplierId) => {
    const supplier = suppliers.find(s => s.id === supplierId);
    setViewingSupplier(supplier);
  };

  const handleCloseView = () => {
    setViewingSupplier(null);
  };

  const handleEdit = (supplierId) => {
    const supplier = suppliers.find(s => s.id === supplierId);
    setEditingSupplier({...supplier});
    setShowEditSupplierModal(true);
    setFormErrors({});
  };

  const handleDelete = (supplierId) => {
    setSupplierToDelete(supplierId);
  };

  const confirmDelete = () => {
    setSuppliers(suppliers.filter(s => s.id !== supplierToDelete));
    setSupplierToDelete(null);
  };

  const cancelDelete = () => {
    setSupplierToDelete(null);
  };

  return (
    <div className="suppliers-section">
      {/* Add Supplier Modal */}
      {showAddSupplierModal && (
        <div className="modal-overlay">
          <div className="add-supplier-modal">
            <div className="modal-header">
              <h3>Ajouter un nouveau fournisseur :</h3>
              <button className="close-modal" onClick={handleCloseModal}>
                <FaTimes />
              </button>
            </div>
            
            <div className="modal-content">
              <form onSubmit={handleSubmitSupplier} noValidate>
                <div className="form-fields">
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="firstName">Prénom :</label>
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={newSupplier.firstName}
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
                        value={newSupplier.lastName}
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
                        value={newSupplier.phone}
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
                        value={newSupplier.email}
                        onChange={handleInputChange}
                      />
                      {formErrors.email && <span className="error-message">{formErrors.email}</span>}
                    </div>
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

      {/* Edit Supplier Modal */}
      {showEditSupplierModal && editingSupplier && (
        <div className="modal-overlay">
          <div className="add-supplier-modal">
            <div className="modal-header">
              <h3>Modifier le fournisseur :</h3>
              <button className="close-modal" onClick={handleCloseEditModal}>
                <FaTimes />
              </button>
            </div>
            
            <div className="modal-content">
              <form onSubmit={handleUpdateSupplier} noValidate>
                <div className="form-fields">
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="edit-firstName">Prénom :</label>
                      <input
                        type="text"
                        id="edit-firstName"
                        name="firstName"
                        value={editingSupplier.firstName}
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
                        value={editingSupplier.lastName}
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
                        value={editingSupplier.phone}
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
                        value={editingSupplier.email}
                        onChange={handleEditInputChange}
                      />
                      {formErrors.email && <span className="error-message">{formErrors.email}</span>}
                    </div>
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
      {supplierToDelete && (
        <div className="modal-overlay">
          <div className="delete-confirmation-modal">
            <h3>Supprimer?</h3>
            <p>Êtes-vous sûr de vouloir supprimer ce fournisseur?</p>
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

      {/* View Supplier Modal */}
      {viewingSupplier && (
        <div className="modal-overlay">
          <div className="view-supplier-modal">
            <div className="modal-header">
              <h3>Détails du fournisseur :</h3>
              <button className="close-modal" onClick={handleCloseView}>
                <FaTimes />
              </button>
            </div>
            
            <div className="supplier-details">
              <div className="detail-row">
                <span className="detail-label">Fournisseur :</span>
                <span className="detail-value">{viewingSupplier.firstName} {viewingSupplier.lastName}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Téléphone :</span>
                <span className="detail-value">{viewingSupplier.phone}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Email :</span>
                <span className="detail-value">{viewingSupplier.email}</span>
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

      {/* Main Suppliers Section */}
      <div className="suppliers-header">
        <h2>Fournisseurs</h2>
        <div className="suppliers-controls">
          <div className="search-bar">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Rechercher un fournisseur ..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <button 
            className="btn add-supplier-btn"
            onClick={handleAddSupplier}
          >
            <FaPlus className="btn-icon" /> 
            <span>Ajouter Fournisseur</span>
          </button>
        </div>
      </div>

      <div className="suppliers-table-container">
        {filteredSuppliers.length > 0 ? (
          <table className="suppliers-table">
            <thead>
              <tr>
                <th>Fournisseur</th>
                <th>Téléphone</th>
                <th>Email</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredSuppliers.map((supplier) => (
                <tr key={supplier.id}>
                  <td>{`${supplier.firstName} ${supplier.lastName}`}</td>
                  <td>{supplier.phone}</td>
                  <td>{supplier.email}</td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        className="btn action-button view"
                        onClick={() => handleView(supplier.id)}
                      >
                        <FaEye className="action-icon" />
                      </button>
                      <button 
                        className="btn action-button edit"
                        onClick={() => handleEdit(supplier.id)}
                      >
                        <FaEdit className="action-icon" />
                      </button>
                      <button 
                        className="btn action-button delete"
                        onClick={() => handleDelete(supplier.id)}
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
            <p>Aucun fournisseur trouvé</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Suppliers;