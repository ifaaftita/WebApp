import React, { useState } from 'react';
import './brand.css';
import { 
  FaSearch, 
  FaPlus, 
  FaEye, 
  FaEdit, 
  FaTrash,
  FaTimes
} from 'react-icons/fa';

const Brand = () => {
  // Sample brands data
  const [brands, setBrands] = useState([
    { 
      id: 1, 
      name: 'Ray-Ban',
    },
    { 
      id: 2, 
      name: 'Oakley',
    },
    { 
      id: 3, 
      name: 'Gucci',
    }
  ]);

  // State management
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddBrandModal, setShowAddBrandModal] = useState(false);
  const [showEditBrandModal, setShowEditBrandModal] = useState(false);
  const [newBrand, setNewBrand] = useState({ name: '' });
  const [editingBrand, setEditingBrand] = useState(null);
  const [brandToDelete, setBrandToDelete] = useState(null);
  const [viewingBrand, setViewingBrand] = useState(null);
  const [formErrors, setFormErrors] = useState({});

  // Filter brands
  const filteredBrands = brands.filter(brand => {
    const searchLower = searchTerm.toLowerCase();
    return brand.name.toLowerCase().includes(searchLower);
  });

  // Handle form changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewBrand(prev => ({
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
    setEditingBrand(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Modal handlers
  const handleAddBrand = () => {
    setShowAddBrandModal(true);
  };

  const handleCloseModal = () => {
    setShowAddBrandModal(false);
    setNewBrand({ name: '' });
    setFormErrors({});
  };

  const handleCloseEditModal = () => {
    setShowEditBrandModal(false);
    setEditingBrand(null);
  };

  // Validate form
  const validateForm = (formData) => {
    const errors = {};
    if (!formData.name.trim()) errors.name = 'Ce champ est obligatoire';
    return errors;
  };

  // Form submission
  const handleSubmitBrand = (e) => {
    e.preventDefault();
    const errors = validateForm(newBrand);
    
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    const brand = {
      id: brands.length + 1,
      ...newBrand
    };
    setBrands([...brands, brand]);
    handleCloseModal();
  };

  const handleUpdateBrand = (e) => {
    e.preventDefault();
    const errors = validateForm(editingBrand);
    
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setBrands(brands.map(b => 
      b.id === editingBrand.id ? editingBrand : b
    ));
    handleCloseEditModal();
  };

  // Action handlers
  const handleView = (brandId) => {
    const brand = brands.find(b => b.id === brandId);
    setViewingBrand(brand);
  };

  const handleCloseView = () => {
    setViewingBrand(null);
  };

  const handleEdit = (brandId) => {
    const brand = brands.find(b => b.id === brandId);
    setEditingBrand({...brand});
    setShowEditBrandModal(true);
    setFormErrors({});
  };

  const handleDelete = (brandId) => {
    setBrandToDelete(brandId);
  };

  const confirmDelete = () => {
    setBrands(brands.filter(b => b.id !== brandToDelete));
    setBrandToDelete(null);
  };

  const cancelDelete = () => {
    setBrandToDelete(null);
  };

  return (
    <div className="brand-section">
      {/* Add Brand Modal */}
      {showAddBrandModal && (
        <div className="modal-overlay">
          <div className="add-brand-modal">
            <div className="modal-header">
              <h3>Ajouter une nouvelle marque :</h3>
              <button className="close-modal" onClick={handleCloseModal}>
                <FaTimes />
              </button>
            </div>
            
            <div className="modal-content">
              <form onSubmit={handleSubmitBrand} noValidate>
                <div className="form-fields">
                  <div className="form-group">
                    <label htmlFor="name">Nom de la marque :</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={newBrand.name}
                      onChange={handleInputChange}
                    />
                    {formErrors.name && <span className="error-message">{formErrors.name}</span>}
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

      {/* Edit Brand Modal */}
      {showEditBrandModal && editingBrand && (
        <div className="modal-overlay">
          <div className="add-brand-modal">
            <div className="modal-header">
              <h3>Modifier la marque :</h3>
              <button className="close-modal" onClick={handleCloseEditModal}>
                <FaTimes />
              </button>
            </div>
            
            <div className="modal-content">
              <form onSubmit={handleUpdateBrand} noValidate>
                <div className="form-fields">
                  <div className="form-group">
                    <label htmlFor="edit-name">Nom de la marque :</label>
                    <input
                      type="text"
                      id="edit-name"
                      name="name"
                      value={editingBrand.name}
                      onChange={handleEditInputChange}
                    />
                    {formErrors.name && <span className="error-message">{formErrors.name}</span>}
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
      {brandToDelete && (
        <div className="modal-overlay">
          <div className="delete-confirmation-modal">
            <h3>Supprimer?</h3>
            <p>Êtes-vous sûr de vouloir supprimer cette marque?</p>
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

      {/* View Brand Modal */}
      {viewingBrand && (
        <div className="modal-overlay">
          <div className="view-brand-modal">
            <div className="modal-header">
              <h3>Détails de la marque :</h3>
              <button className="close-modal" onClick={handleCloseView}>
                <FaTimes />
              </button>
            </div>
            
            <div className="brand-details">
              <div className="detail-row">
                <span className="detail-label">Nom :</span>
                <span className="detail-value">{viewingBrand.name}</span>
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

      {/* Main Brands Section */}
      <div className="brand-header">
        <h2>Marques</h2>
        <div className="brand-controls">
          <div className="search-bar">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Rechercher une marque ..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <button 
            className="btn add-brand-btn"
            onClick={handleAddBrand}
          >
            <FaPlus className="btn-icon" /> 
            <span>Ajouter Marque</span>
          </button>
        </div>
      </div>

      <div className="brand-table-container">
        {filteredBrands.length > 0 ? (
          <table className="brand-table">
            <thead>
              <tr>
                <th>Nom</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBrands.map((brand) => (
                <tr key={brand.id}>
                  <td>{brand.name}</td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        className="btn action-button view"
                        onClick={() => handleView(brand.id)}
                      >
                        <FaEye className="action-icon" />
                      </button>
                      <button 
                        className="btn action-button edit"
                        onClick={() => handleEdit(brand.id)}
                      >
                        <FaEdit className="action-icon" />
                      </button>
                      <button 
                        className="btn action-button delete"
                        onClick={() => handleDelete(brand.id)}
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
            <p>Aucune marque trouvée</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Brand;