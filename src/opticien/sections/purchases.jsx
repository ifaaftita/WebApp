import React, { useState } from 'react';
import './purchases.css';
import { 
  FaSearch, 
  FaPlus, 
  FaEye, 
  FaEdit, 
  FaTrash,
  FaChevronDown,
  FaTimes
} from 'react-icons/fa';

const Purchases = () => {
  // Sample purchases data with updated categories
  const [purchases, setPurchases] = useState([
    { 
      id: 1,
      product: 'Verres progressifs Essilor',
      supplier: 'Optique Service',
      price: 120.50,
      quantity: 10,
      reference: 'ESSI-PRO-2023',
      category: 'Verres',
      model: 'Varilux X',
      paymentMethod: 'virement',
      date: '2023-05-15'
    },
    { 
      id: 2,
      product: 'Monture Ray-Ban RB2140',
      supplier: 'Luxottica',
      price: 89.90,
      quantity: 5,
      reference: 'RAY-2140-BLK',
      category: 'Montures solaires',
      model: 'Wayfarer',
      paymentMethod: 'carte bancaire',
      date: '2023-05-18'
    },
    { 
      id: 3,
      product: 'Lentilles journalières Acuvue',
      supplier: 'Johnson & Johnson',
      price: 45.00,
      quantity: 30,
      reference: 'ACU-JOUR-30',
      category: 'Lentilles',
      model: 'Acuvue Oasys',
      paymentMethod: 'virement',
      date: '2023-05-20'
    },
    { 
      id: 4,
      product: 'Monture optique Titanium',
      supplier: 'Silhouette',
      price: 150.00,
      quantity: 3,
      reference: 'SIL-TIT-2023',
      category: 'Montures optiques',
      model: 'Titan Minimal Art',
      paymentMethod: 'carte bancaire',
      date: '2023-05-22'
    }
  ]);

  // Updated dropdown options
  const categories = ['Montures optiques', 'Montures solaires', 'Lentilles', 'Verres'];
  const paymentMethods = ['virement', 'chèque', 'espece', 'carte bancaire'];

  // State management
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddPurchaseModal, setShowAddPurchaseModal] = useState(false);
  const [showViewPurchaseModal, setShowViewPurchaseModal] = useState(false);
  const [showEditPurchaseModal, setShowEditPurchaseModal] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [purchaseToDelete, setPurchaseToDelete] = useState(null);
  const [newPurchase, setNewPurchase] = useState({
    product: '',
    supplier: '',
    price: '',
    quantity: 1,
    reference: '',
    category: '',
    model: '',
    paymentMethod: 'virement',
    date: new Date().toISOString().split('T')[0]
  });
  const [viewingPurchase, setViewingPurchase] = useState(null);
  const [editingPurchase, setEditingPurchase] = useState(null);

  // Filter purchases
  const filteredPurchases = purchases.filter(purchase => {
    const searchLower = searchTerm.toLowerCase();
    return (
      purchase.product.toLowerCase().includes(searchLower) ||
      purchase.supplier.toLowerCase().includes(searchLower) ||
      purchase.reference.toLowerCase().includes(searchLower)
    );
  });

  // Handle form changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPurchase(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditingPurchase(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Modal handlers
  const handleAddPurchase = () => {
    setShowAddPurchaseModal(true);
  };

  const handleCloseModal = () => {
    setShowAddPurchaseModal(false);
    setNewPurchase({
      product: '',
      supplier: '',
      price: '',
      quantity: 1,
      reference: '',
      category: '',
      model: '',
      paymentMethod: 'virement',
      date: new Date().toISOString().split('T')[0]
    });
  };

  const handleCloseViewModal = () => {
    setShowViewPurchaseModal(false);
  };

  const handleCloseEditModal = () => {
    setShowEditPurchaseModal(false);
    setEditingPurchase(null);
  };

  // Form submission
  const handleSubmitPurchase = (e) => {
    e.preventDefault();
    const purchase = {
      id: purchases.length + 1,
      ...newPurchase,
      price: parseFloat(newPurchase.price),
      quantity: parseInt(newPurchase.quantity)
    };
    setPurchases([...purchases, purchase]);
    handleCloseModal();
  };

  const handleSubmitEdit = (e) => {
    e.preventDefault();
    const updatedPurchases = purchases.map(purchase => 
      purchase.id === editingPurchase.id ? {
        ...editingPurchase,
        price: parseFloat(editingPurchase.price),
        quantity: parseInt(editingPurchase.quantity)
      } : purchase
    );
    setPurchases(updatedPurchases);
    handleCloseEditModal();
  };

  // Action handlers
  const handleView = (purchaseId) => {
    const purchase = purchases.find(p => p.id === purchaseId);
    setViewingPurchase(purchase);
    setShowViewPurchaseModal(true);
  };

  const handleEdit = (purchaseId) => {
    const purchase = purchases.find(p => p.id === purchaseId);
    setEditingPurchase({...purchase});
    setShowEditPurchaseModal(true);
  };

  const handleDeleteClick = (purchaseId) => {
    const purchase = purchases.find(p => p.id === purchaseId);
    setPurchaseToDelete(purchase);
    setShowDeleteConfirmation(true);
  };

  const confirmDelete = () => {
    setPurchases(purchases.filter(p => p.id !== purchaseToDelete.id));
    setShowDeleteConfirmation(false);
    setPurchaseToDelete(null);
  };

  const cancelDelete = () => {
    setShowDeleteConfirmation(false);
    setPurchaseToDelete(null);
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
        <option key={option} value={option}>
          {option.charAt(0).toUpperCase() + option.slice(1)}
        </option>
      ))}
    </select>
  );

  return (
    <div className="purchases-section">
      {/* Add Purchase Modal */}
      {showAddPurchaseModal && (
        <div className="modal-overlay">
          <div className="add-purchase-modal">
            <div className="modal-header">
              <h3>Ajouter un achat :</h3>
              <button className="close-modal" onClick={handleCloseModal}>
                <FaTimes />
              </button>
            </div>
            
            <div className="modal-content">
              <form onSubmit={handleSubmitPurchase}>
                <div className="form-fields">
                  <div className="form-row">
                    <div className="form-group">
                      <label>Produit :</label>
                      <input
                        type="text"
                        name="product"
                        value={newPurchase.product}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Fournisseur :</label>
                      <input
                        type="text"
                        name="supplier"
                        value={newPurchase.supplier}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Prix unitaire :</label>
                      <input
                        type="number"
                        name="price"
                        value={newPurchase.price}
                        onChange={handleInputChange}
                        step="0.01"
                        min="0"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Quantité :</label>
                      <input
                        type="number"
                        name="quantity"
                        value={newPurchase.quantity}
                        onChange={handleInputChange}
                        min="1"
                        required
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Référence :</label>
                      <input
                        type="text"
                        name="reference"
                        value={newPurchase.reference}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Date :</label>
                      <input
                        type="date"
                        name="date"
                        value={newPurchase.date}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Catégorie :</label>
                      {renderSelect(
                        categories,
                        newPurchase.category,
                        handleInputChange,
                        'category'
                      )}
                    </div>
                    <div className="form-group">
                      <label>Modèle :</label>
                      <input
                        type="text"
                        name="model"
                        value={newPurchase.model}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Méthode de paiement :</label>
                      {renderSelect(
                        paymentMethods,
                        newPurchase.paymentMethod,
                        handleInputChange,
                        'paymentMethod'
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="modal-actions">
                  <button type="button" className="btn cancel" onClick={handleCloseModal}>
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

      {/* Edit Purchase Modal */}
      {showEditPurchaseModal && editingPurchase && (
        <div className="modal-overlay">
          <div className="add-purchase-modal">
            <div className="modal-header">
              <h3>Modifier l'achat :</h3>
              <button className="close-modal" onClick={handleCloseEditModal}>
                <FaTimes />
              </button>
            </div>
            
            <div className="modal-content">
              <form onSubmit={handleSubmitEdit}>
                <div className="form-fields">
                  <div className="form-row">
                    <div className="form-group">
                      <label>Produit :</label>
                      <input
                        type="text"
                        name="product"
                        value={editingPurchase.product}
                        onChange={handleEditInputChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Fournisseur :</label>
                      <input
                        type="text"
                        name="supplier"
                        value={editingPurchase.supplier}
                        onChange={handleEditInputChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Prix unitaire :</label>
                      <input
                        type="number"
                        name="price"
                        value={editingPurchase.price}
                        onChange={handleEditInputChange}
                        step="0.01"
                        min="0"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Quantité :</label>
                      <input
                        type="number"
                        name="quantity"
                        value={editingPurchase.quantity}
                        onChange={handleEditInputChange}
                        min="1"
                        required
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Référence :</label>
                      <input
                        type="text"
                        name="reference"
                        value={editingPurchase.reference}
                        onChange={handleEditInputChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Date :</label>
                      <input
                        type="date"
                        name="date"
                        value={editingPurchase.date}
                        onChange={handleEditInputChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Catégorie</label>
                      {renderSelect(
                        categories,
                        editingPurchase.category,
                        handleEditInputChange,
                        'category'
                      )}
                    </div>
                    <div className="form-group">
                      <label>Modèle :</label>
                      <input
                        type="text"
                        name="model"
                        value={editingPurchase.model}
                        onChange={handleEditInputChange}
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Méthode de paiement :</label>
                      {renderSelect(
                        paymentMethods,
                        editingPurchase.paymentMethod,
                        handleEditInputChange,
                        'paymentMethod'
                      )}
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

      {/* View Purchase Modal */}
      {showViewPurchaseModal && viewingPurchase && (
        <div className="modal-overlay">
          <div className="view-purchase-modal">
            <div className="modal-header">
              <h3>Détails de l'achat :</h3>
              <button className="close-modal" onClick={handleCloseViewModal}>
                <FaTimes />
              </button>
            </div>
            
            <div className="purchase-details">
              <div className="detail-row">
                <span className="detail-label">Produit :</span>
                <span className="detail-value">{viewingPurchase.product}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Fournisseur :</span>
                <span className="detail-value">{viewingPurchase.supplier}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Prix unitaire :</span>
                <span className="detail-value">{viewingPurchase.price.toFixed(3)} dt</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Quantité :</span>
                <span className="detail-value">{viewingPurchase.quantity}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Total :</span>
                <span className="detail-value">{(viewingPurchase.price * viewingPurchase.quantity).toFixed(3)} dt</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Référence :</span>
                <span className="detail-value">{viewingPurchase.reference}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Date :</span>
                <span className="detail-value">{viewingPurchase.date}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Catégorie :</span>
                <span className="detail-value">{viewingPurchase.category}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Modèle :</span>
                <span className="detail-value">{viewingPurchase.model}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Méthode de paiement :</span>
                <span className="detail-value">
                  {viewingPurchase.paymentMethod === 'virement' && 'Virement bancaire'}
                  {viewingPurchase.paymentMethod === 'cheque' && 'Chèque'}
                  {viewingPurchase.paymentMethod === 'espece' && 'Espèces'}
                  {viewingPurchase.paymentMethod === 'carte bancaire' && 'Carte bancaire'}
                </span>
              </div>
            </div>
            
            <div className="modal-actions">
              <button 
                type="button" 
                className="btn close" 
                onClick={handleCloseViewModal}
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirmation && purchaseToDelete && (
        <div className="modal-overlay">
          <div className="delete-confirmation-modal">
            <h3>Supprimer?</h3>
            <p>Êtes-vous sûr de vouloir supprimer cet achat?</p>
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

      {/* Main Purchases Section */}
      <div className="purchases-header">
        <h2>Achats</h2>
        <div className="purchases-controls">
          <div className="search-bar">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Rechercher un achat..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <button 
            className="btn add-purchase-btn"
            onClick={handleAddPurchase}
          >
            <FaPlus className="btn-icon" /> 
            <span>Ajouter un achat</span>
          </button>
        </div>
      </div>

      <div className="purchases-table-container">
        {filteredPurchases.length > 0 ? (
          <table className="purchases-table">
            <thead>
              <tr>
                <th>Produit</th>
                <th>Fournisseur</th>
                <th>Prix</th>
                <th>Quantité</th>
                <th>Total</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPurchases.map((purchase) => (
                <tr key={purchase.id}>
                  <td>{purchase.product}</td>
                  <td>{purchase.supplier}</td>
                  <td>{purchase.price.toFixed(3)} dt</td>
                  <td>{purchase.quantity}</td>
                  <td>{(purchase.price * purchase.quantity).toFixed(3)} dt</td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        className="btn action-button view"
                        onClick={() => handleView(purchase.id)}
                      >
                        <FaEye className="action-icon" />
                      </button>
                      <button 
                        className="btn action-button edit"
                        onClick={() => handleEdit(purchase.id)}
                      >
                        <FaEdit className="action-icon" />
                      </button>
                      <button 
                        className="btn action-button delete"
                        onClick={() => handleDeleteClick(purchase.id)}
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
            <p>Aucun achat trouvé</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Purchases;