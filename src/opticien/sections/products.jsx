import './products.css';
import React, { useState } from 'react';
import { 
  FaSearch, 
  FaChevronDown, 
  FaPlus, 
  FaEye, 
  FaEdit, 
  FaTrash,
  FaTimes
} from 'react-icons/fa';

const Products = () => {
  // Sample data
  const initialProducts = [
    {
      id: 1,
      ref: 'RB001',
      nom: 'Monture Ray-Ban',
      dateAjout: '2023-05-15',
      categorie: 'montures solaires',
      marque: 'Ray-Ban',
      statut: 'promotion exclusive',
      prixUnitaire: 450,
      remise: 10,
      description: 'Monture iconique Wayfarer avec verres teintés gradient',
      image: '/rayban.jpg'
    },
    {
      id: 2,
      ref: 'ESS123',
      nom: 'Verres progressifs Essilor',
      dateAjout: '2023-06-20',
      categorie: 'verres',
      marque: 'Essilor',
      statut: 'standard',
      prixUnitaire: 320,
      remise: 0,
      description: 'Verres progressifs haute définition avec traitement anti-reflets',
      image: '/essilor.jpg'
    },
  ];

  const [products, setProducts] = useState(initialProducts);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    nom: '',
    ref: '',
    description: '',
    dateAjout: new Date().toISOString().split('T')[0],
    categorie: 'montures optiques',
    marque: '',
    statut: 'standard',
    prixUnitaire: '',
    remise: '',
    image: null
  });

  // Filtered products
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.nom.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         product.marque.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || product.categorie === filter;
    return matchesSearch && matchesFilter;
  });

  // Handlers
  const handleSearchChange = (e) => setSearchTerm(e.target.value);
  
  const handleFilterChange = (category) => {
    setFilter(category);
    setFilterOpen(false);
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleImageChange = (e) => {
    setFormData(prev => ({ ...prev, image: URL.createObjectURL(e.target.files[0]) }));
  };
  
  const openAddModal = () => {
    setFormData({
      nom: '',
      ref: '',
      description: '',
      dateAjout: new Date().toISOString().split('T')[0],
      categorie: 'montures optiques',
      marque: '',
      statut: 'standard',
      prixUnitaire: '',
      remise: '',
      image: null
    });
    setIsAddModalOpen(true);
  };
  
  const openEditModal = (product) => {
    setCurrentProduct(product);
    setFormData({
      nom: product.nom,
      ref: product.ref,
      description: product.description,
      dateAjout: product.dateAjout,
      categorie: product.categorie,
      marque: product.marque,
      statut: product.statut,
      prixUnitaire: product.prixUnitaire,
      remise: product.remise,
      image: product.image
    });
    setIsEditModalOpen(true);
  };
  
  const openViewModal = (product) => {
    setCurrentProduct(product);
    setIsViewModalOpen(true);
  };
  
  const openDeleteModal = (product) => {
    setCurrentProduct(product);
    setIsDeleteModalOpen(true);
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.nom || !formData.ref || !formData.prixUnitaire) {
      return; // Don't submit if required fields are empty
    }

    if (isAddModalOpen) {
      // Add new product
      const newProduct = {
        id: products.length + 1,
        ...formData,
        prixUnitaire: parseFloat(formData.prixUnitaire),
        remise: formData.remise ? parseFloat(formData.remise) : 0
      };
      setProducts([...products, newProduct]);
    } else {
      // Update existing product
      const updatedProducts = products.map(p => 
        p.id === currentProduct.id ? { 
          ...p, 
          ...formData,
          prixUnitaire: parseFloat(formData.prixUnitaire),
          remise: formData.remise ? parseFloat(formData.remise) : 0
        } : p
      );
      setProducts(updatedProducts);
    }
    setIsAddModalOpen(false);
    setIsEditModalOpen(false);
  };
  
  const handleDelete = () => {
    setProducts(products.filter(p => p.id !== currentProduct.id));
    setIsDeleteModalOpen(false);
  };

  return (
    <div className="prescriptions-section">
      {/* Header with controls */}
      <div className="prescriptions-header">
        <h2>Produits</h2>
        <div className="prescriptions-controls">
          <div className="search-bar">
            <FaSearch className="search-icon" />
            <input 
              type="text" 
              placeholder="Rechercher un produit ..." 
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
          
          <div className="filter-dropdown">
            <button 
              className="filter-toggle"
              onClick={() => setFilterOpen(!filterOpen)}
            >
              <span>{filter === 'all' ? 'Toutes catégories' : filter}</span>
              <FaChevronDown className={`dropdown-icon ${filterOpen ? 'open' : ''}`} />
            </button>
            
            {filterOpen && (
              <div className="filter-options">
                <button 
                  className={`filter-option ${filter === 'all' ? 'active' : ''}`}
                  onClick={() => handleFilterChange('all')}
                >
                  Toutes catégories
                </button>
                <button 
                  className={`filter-option ${filter === 'montures optiques' ? 'active' : ''}`}
                  onClick={() => handleFilterChange('montures optiques')}
                >
                  Montures optiques
                </button>
                <button 
                  className={`filter-option ${filter === 'montures solaires' ? 'active' : ''}`}
                  onClick={() => handleFilterChange('montures solaires')}
                >
                  Montures solaires
                </button>
                <button 
                  className={`filter-option ${filter === 'accessoires' ? 'active' : ''}`}
                  onClick={() => handleFilterChange('accessoires')}
                >
                  Accessoires
                </button>
                <button 
                  className={`filter-option ${filter === 'verres' ? 'active' : ''}`}
                  onClick={() => handleFilterChange('verres')}
                >
                  Verres
                </button>
              </div>
            )}
          </div>
          
          <button className="btn add-ordonnance-btn" onClick={openAddModal}>
            <FaPlus className="btn-icon" /> 
            <span>Ajouter Produit</span>
          </button>
        </div>
      </div>
      
      {/* Products Table */}
      <div className="prescriptions-table-container">
        {filteredProducts.length > 0 ? (
          <table className="prescriptions-table">
            <thead>
              <tr>
                <th>Nom</th>
                <th>Date d'ajout</th>
                <th>Référence</th>
                <th>Catégorie</th>
                <th>Marque</th>
                <th>Statut</th>
                <th>Prix unitaire</th>
                <th>Remise</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map(product => (
                <tr key={product.id}>
                  <td>{product.nom}</td>
                  <td>{product.dateAjout}</td>
                  <td>{product.ref}</td>
                  <td>{product.categorie}</td>
                  <td>{product.marque}</td>
                  <td>
                    <span className={`status-badge ${product.statut === 'promotion exclusive' ? 'exclusive' : 'regular'}`}>
                      {product.statut}
                    </span>
                  </td>
                  <td>{product.prixUnitaire} DT</td>
                  <td>{product.remise ? `${product.remise}%` : '-'}</td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        className="btn action-button view" 
                        onClick={() => openViewModal(product)}
                      >
                        <FaEye className="action-icon" />
                      </button>
                      <button 
                        className="btn action-button edit" 
                        onClick={() => openEditModal(product)}
                      >
                        <FaEdit className="action-icon" />
                      </button>
                      <button 
                        className="btn action-button delete" 
                        onClick={() => openDeleteModal(product)}
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
            Aucun produit trouvé
          </div>
        )}
      </div>
      
      {/* Add Product Modal */}
      {isAddModalOpen && (
        <div className="modal-overlay">
          <div className="add-ordonnance-modal">
            <div className="modal-header">
              <h3>Ajouter un nouveau produit :</h3>
              <button className="close-modal" onClick={() => setIsAddModalOpen(false)}>
                <FaTimes />
              </button>
            </div>
            <div className="modal-content">
              <form onSubmit={handleSubmit} noValidate>
                <div className="form-fields">
                  <div className="form-group">
                    <label>Nom du Produit :</label>
                    <input
                      type="text"
                      name="nom"
                      value={formData.nom}
                      onChange={handleInputChange}
                      required
                    />
                    {!formData.nom && <span className="error-message">Ce champ est obligatoire.</span>}
                  </div>
                  
                  <div className="form-group">
                    <label>Description :</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows="4"
                    />
                  </div>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label>Référence :</label>
                      <input
                        type="text"
                        name="ref"
                        value={formData.ref}
                        onChange={handleInputChange}
                        required
                      />
                      {!formData.ref && <span className="error-message">Ce champ est obligatoire.</span>}
                    </div>
                    
                    <div className="form-group">
                      <label>Date d'Ajout :</label>
                      <input
                        type="date"
                        name="dateAjout"
                        value={formData.dateAjout}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label>Catégorie :</label>
                      <select
                        name="categorie"
                        value={formData.categorie}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="montures optiques">Montures optiques</option>
                        <option value="montures solaires">Montures solaires</option>
                        <option value="accessoires">Accessoires</option>
                        <option value="verres">Verres</option>
                      </select>
                    </div>
                    
                    <div className="form-group">
                      <label>Marque :</label>
                      <input
                        type="text"
                        name="marque"
                        value={formData.marque}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label>Prix unitaire (DT) :</label>
                      <input
                        type="number"
                        name="prixUnitaire"
                        value={formData.prixUnitaire}
                        onChange={handleInputChange}
                        min="0"
                        step="0.01"
                        required
                      />
                      {!formData.prixUnitaire && <span className="error-message">Ce champ est obligatoire.</span>}
                    </div>
                    
                    <div className="form-group">
                      <label>Statut :</label>
                      <select
                        name="statut"
                        value={formData.statut}
                        onChange={handleInputChange}
                      >
                        <option value="standard">Standard</option>
                        <option value="promotion exclusive">Promotion exclusive</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label>Remise (%) :</label>
                      <input
                        type="number"
                        name="remise"
                        value={formData.remise}
                        onChange={handleInputChange}
                        min="0"
                        max="100"
                        step="1"
                      />
                    </div>
                  </div>
                  
                  <div className="form-group">
                    <label>Image du Produit :</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                    {formData.image && (
                      <div className="image-preview">
                        <img src={formData.image} alt="Preview" style={{ maxWidth: '100px', maxHeight: '100px' }} />
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="modal-actions">
                  <button type="button" className="btn cancel" onClick={() => setIsAddModalOpen(false)}>
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
      
      {/* Edit Product Modal */}
      {isEditModalOpen && (
        <div className="modal-overlay">
          <div className="add-ordonnance-modal">
            <div className="modal-header">
              <h3>Modifier le Produit :</h3>
              <button className="close-modal" onClick={() => setIsEditModalOpen(false)}>
                <FaTimes />
              </button>
            </div>
            <div className="modal-content">
              <form onSubmit={handleSubmit} noValidate>
                <div className="form-fields">
                  <div className="form-group">
                    <label>Nom du Produit :</label>
                    <input
                      type="text"
                      name="nom"
                      value={formData.nom}
                      onChange={handleInputChange}
                      required
                    />
                    {!formData.nom && <span className="error-message" style={{color: 'red'}}>Ce champ est obligatoire</span>}
                  </div>
                  
                  <div className="form-group">
                    <label>Description :</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows="4"
                    />
                  </div>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label>Référence :</label>
                      <input
                        type="text"
                        name="ref"
                        value={formData.ref}
                        onChange={handleInputChange}
                        required
                      />
                      {!formData.ref && <span className="error-message" style={{color: 'red'}}>Ce champ est obligatoire</span>}
                    </div>
                    
                    <div className="form-group">
                      <label>Date d'Ajout :</label>
                      <input
                        type="date"
                        name="dateAjout"
                        value={formData.dateAjout}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label>Catégorie :</label>
                      <select
                        name="categorie"
                        value={formData.categorie}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="montures optiques">Montures optiques</option>
                        <option value="montures solaires">Montures solaires</option>
                        <option value="accessoires">Accessoires</option>
                        <option value="verres">Verres</option>
                      </select>
                    </div>
                    
                    <div className="form-group">
                      <label>Marque :</label>
                      <input
                        type="text"
                        name="marque"
                        value={formData.marque}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label>Prix unitaire (DT) :</label>
                      <input
                        type="number"
                        name="prixUnitaire"
                        value={formData.prixUnitaire}
                        onChange={handleInputChange}
                        min="0"
                        step="0.01"
                        required
                      />
                      {!formData.prixUnitaire && <span className="error-message" style={{color: 'red'}}>Ce champ est obligatoire</span>}
                    </div>
                    
                    <div className="form-group">
                      <label>Statut :</label>
                      <select
                        name="statut"
                        value={formData.statut}
                        onChange={handleInputChange}
                      >
                        <option value="standard">Standard</option>
                        <option value="promotion exclusive">Promotion exclusive</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label>Remise (%) :</label>
                      <input
                        type="number"
                        name="remise"
                        value={formData.remise}
                        onChange={handleInputChange}
                        min="0"
                        max="100"
                        step="1"
                      />
                    </div>
                  </div>
                  
                  <div className="form-group">
                    <label>Image du Produit :</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                    {formData.image && (
                      <div className="image-preview">
                        <img src={formData.image} alt="Preview" style={{ maxWidth: '100px', maxHeight: '100px' }} />
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="modal-actions">
                  <button type="button" className="btn cancel" onClick={() => setIsEditModalOpen(false)}>
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
      
      {/* View Product Modal */}
      {isViewModalOpen && currentProduct && (
        <div className="modal-overlay">
          <div className="view-ordonnance-modal">
            <div className="modal-header">
              <h3>Détails du Produit</h3>
              <button className="close-modal" onClick={() => setIsViewModalOpen(false)}>
                <FaTimes />
              </button>
            </div>
            <div className="modal-content">
              <div className="ordonnance-details">
                <div className="detail-row">
                  <div className="detail-label">Nom :</div>
                  <div className="detail-value">{currentProduct.nom}</div>
                </div>
                <div className="detail-row">
                  <div className="detail-label">Référence :</div>
                  <div className="detail-value">{currentProduct.ref}</div>
                </div>
                <div className="detail-row">
                  <div className="detail-label">Date d'ajout :</div>
                  <div className="detail-value">{currentProduct.dateAjout}</div>
                </div>
                <div className="detail-row">
                  <div className="detail-label">Catégorie :</div>
                  <div className="detail-value">{currentProduct.categorie}</div>
                </div>
                <div className="detail-row">
                  <div className="detail-label">Marque :</div>
                  <div className="detail-value">{currentProduct.marque || 'Non spécifiée'}</div>
                </div>
                <div className="detail-row">
                  <div className="detail-label">Statut :</div>
                  <div className="detail-value">
                    <span className={`status-badge ${currentProduct.statut === 'promotion exclusive' ? 'exclusive' : 'regular'}`}>
                      {currentProduct.statut}
                    </span>
                  </div>
                </div>
                <div className="detail-row">
                  <div className="detail-label">Prix unitaire :</div>
                  <div className="detail-value">{currentProduct.prixUnitaire} DT</div>
                </div>
                <div className="detail-row">
                  <div className="detail-label">Remise :</div>
                  <div className="detail-value">{currentProduct.remise ? `${currentProduct.remise}%` : 'Aucune'}</div>
                </div>
                <div className="detail-row">
                  <div className="detail-label">Description :</div>
                  <div className="detail-value">{currentProduct.description}</div>
                </div>
                {currentProduct.image && (
                  <div className="detail-row">
                    <div className="detail-label">Image :</div>
                    <div className="detail-value">
                      <img src={currentProduct.image} alt="Produit" style={{ maxWidth: '200px' }} />
                    </div>
                  </div>
                )}
              </div>
              
              <div className="modal-actions">
                <button type="button" className="btn cancel" onClick={() => setIsViewModalOpen(false)}>
                  Fermer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && currentProduct && (
        <div className="modal-overlay">
          <div className="delete-confirmation-modal">
            <h3>Supprimer?</h3>
            <p>Êtes-vous sûr de vouloir supprimer ce produit?</p>
            <div className="modal-actions">
              <button 
                type="button" 
                className="btn cancel" 
                onClick={() => setIsDeleteModalOpen(false)}
              >
                Annuler
              </button>
              <button 
                type="button" 
                className="btn delete" 
                onClick={handleDelete}
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Products;