import React, { useState } from 'react';
import './purchases.css';
import { 
  FaSearch, 
  FaPlus, 
  FaEye,  
  FaTrash,
  FaChevronDown,
  FaTimes
} from 'react-icons/fa';

const Purchases = () => {
  // Sample data with unified structure
  const [products, setProducts] = useState([
    { 
      id: 1,
      name: 'Verres progressifs Essilor',
      supplier: 'Optique Service',
      price: 120.50,
      stock: 10,
      alertThreshold: 5,
      reference: 'ESSI-PRO-2023',
      category: 'Verres',
      model: 'Varilux X'
    },
    { 
      id: 2,
      name: 'Monture Ray-Ban RB2140',
      supplier: 'Luxottica',
      price: 89.90,
      stock: 5,
      alertThreshold: 3,
      reference: 'RAY-2140-BLK',
      category: 'Montures solaires',
      model: 'Wayfarer'
    }
  ]);

  const [purchases, setPurchases] = useState([
    { 
      id: 1,
      productId: 1,
      quantity: 10,
      date: '2023-05-15',
      paymentMethod: 'virement',
      totalPrice: 1205.00
    },
    { 
      id: 2,
      productId: 2,
      quantity: 5,
      date: '2023-05-18',
      paymentMethod: 'carte bancaire',
      totalPrice: 449.50
    }
  ]);

  // Dropdown options
  const categories = ['Montures optiques', 'Montures solaires', 'Lentilles', 'Verres'];
  const paymentMethods = ['virement', 'chèque', 'espece', 'carte bancaire'];
  const suppliers = ['Optique Service', 'Luxottica', 'Johnson & Johnson', 'Silhouette'];

  // State management
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [newItem, setNewItem] = useState({
    name: '',
    supplier: '',
    price: '',
    stock: '',
    alertThreshold: '',
    reference: '',
    category: '',
    model: '',
    quantity: '',
    paymentMethod: 'virement',
    date: new Date().toISOString().split('T')[0]
  });

  // Filter purchases with product details
  const filteredPurchases = purchases.map(purchase => {
    const product = products.find(p => p.id === purchase.productId);
    return {
      ...purchase,
      productName: product?.name || 'Produit supprimé',
      supplier: product?.supplier || '',
      price: product?.price || 0,
      category: product?.category || '',
      model: product?.model || ''
    };
  }).filter(purchase => {
    const searchLower = searchTerm.toLowerCase();
    return (
      purchase.productName.toLowerCase().includes(searchLower) ||
      purchase.supplier.toLowerCase().includes(searchLower) ||
      purchase.paymentMethod.toLowerCase().includes(searchLower)
    );
  });

  // Handle form changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewItem(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Add new purchase and update stock
  const handleAddPurchase = (e) => {
    e.preventDefault();
    
    // First check if product exists
    let product = products.find(p => 
      p.name === newItem.name && 
      p.reference === newItem.reference
    );

    if (!product) {
      // Create new product if doesn't exist
      product = {
        id: products.length + 1,
        name: newItem.name,
        supplier: newItem.supplier,
        price: parseFloat(newItem.price),
        stock: parseInt(newItem.quantity), // Initial stock = purchase quantity
        alertThreshold: parseInt(newItem.alertThreshold) || 5,
        reference: newItem.reference,
        category: newItem.category,
        model: newItem.model
      };
      setProducts([...products, product]);
    } else {
      // Update existing product stock
      const updatedProducts = products.map(p => 
        p.id === product.id 
          ? { ...p, stock: p.stock + parseInt(newItem.quantity) }
          : p
      );
      setProducts(updatedProducts);
    }

    // Add purchase record
    const newPurchase = {
      id: purchases.length + 1,
      productId: product.id,
      quantity: parseInt(newItem.quantity),
      date: newItem.date,
      paymentMethod: newItem.paymentMethod,
      totalPrice: product.price * parseInt(newItem.quantity)
    };

    setPurchases([...purchases, newPurchase]);
    setShowAddModal(false);
    setNewItem({
      name: '',
      supplier: '',
      price: '',
      stock: '',
      alertThreshold: '',
      reference: '',
      category: '',
      model: '',
      quantity: '',
      paymentMethod: 'virement',
      date: new Date().toISOString().split('T')[0]
    });
  };

  // View purchase details
  const handleView = (purchaseId) => {
    const purchase = purchases.find(p => p.id === purchaseId);
    const product = products.find(p => p.id === purchase.productId);
    setCurrentItem({ ...purchase, ...product });
    setShowViewModal(true);
  };

  // Delete purchase and adjust stock
  const handleDelete = (purchaseId) => {
    const purchase = purchases.find(p => p.id === purchaseId);
    setCurrentItem(purchase);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    // Adjust stock
    const updatedProducts = products.map(p => 
      p.id === currentItem.productId 
        ? { ...p, stock: p.stock - currentItem.quantity } 
        : p
    );
    
    setProducts(updatedProducts);
    setPurchases(purchases.filter(p => p.id !== currentItem.id));
    setShowDeleteModal(false);
  };

  // Render select dropdown
  const renderSelect = (options, value, onChange, name) => (
    <select
      value={value}
      onChange={onChange}
      name={name}
      className="form-select"
    >
      <option value="">Sélectionner...</option>
      {options.map(option => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  );

  // Get stock status
  const getStockStatus = (stock) => {
    if (stock <= 0) return 'Stock fini';
    if (stock <= 5) return 'Stock faible'; // Using fixed threshold for simplicity
    return 'Stock suffisant';
  };

  return (
    <div className="purchases-section">
      {/* Add Purchase Modal */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="add-purchase-modal">
            <div className="modal-header">
              <h3>Ajouter un achat</h3>
              <button className="close-modal" onClick={() => setShowAddModal(false)}>
                <FaTimes />
              </button>
            </div>
            
            <div className="modal-content">
              <form onSubmit={handleAddPurchase}>
                <div className="form-fields">
                  <div className="form-row">
                    <div className="form-group">
                      <label>Produit:</label>
                      <input
                        type="text"
                        name="name"
                        value={newItem.name}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Fournisseur:</label>
                      {renderSelect(suppliers, newItem.supplier, handleInputChange, 'supplier')}
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Prix unitaire:</label>
                      <input
                        type="number"
                        name="price"
                        value={newItem.price}
                        onChange={handleInputChange}
                        step="0.01"
                        min="0"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Quantité:</label>
                      <input
                        type="number"
                        name="quantity"
                        value={newItem.quantity}
                        onChange={handleInputChange}
                        min="1"
                        required
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Référence:</label>
                      <input
                        type="text"
                        name="reference"
                        value={newItem.reference}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Seuil d'alerte:</label>
                      <input
                        type="number"
                        name="alertThreshold"
                        value={newItem.alertThreshold}
                        onChange={handleInputChange}
                        min="1"
                        placeholder="5"
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Catégorie:</label>
                      {renderSelect(categories, newItem.category, handleInputChange, 'category')}
                    </div>
                    <div className="form-group">
                      <label>Modèle:</label>
                      <input
                        type="text"
                        name="model"
                        value={newItem.model}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Date:</label>
                      <input
                        type="date"
                        name="date"
                        value={newItem.date}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Méthode de paiement:</label>
                      {renderSelect(paymentMethods, newItem.paymentMethod, handleInputChange, 'paymentMethod')}
                    </div>
                  </div>
                </div>
                
                <div className="modal-actions">
                  <button type="button" className="btn cancel" onClick={() => setShowAddModal(false)}>
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
      {showViewModal && currentItem && (
        <div className="modal-overlay">
          <div className="view-purchase-modal">
            <div className="modal-header">
              <h3>Détails de l'achat</h3>
              <button className="close-modal" onClick={() => setShowViewModal(false)}>
                <FaTimes />
              </button>
            </div>
            
            <div className="purchase-details">
              <div className="detail-row">
                <span className="detail-label">Produit:</span>
                <span className="detail-value">{currentItem.name}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Fournisseur:</span>
                <span className="detail-value">{currentItem.supplier}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Prix unitaire:</span>
                <span className="detail-value">{currentItem.price.toFixed(3)} dt</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Quantité:</span>
                <span className="detail-value">{currentItem.quantity}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Total:</span>
                <span className="detail-value">{(currentItem.price * currentItem.quantity).toFixed(3)} dt</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Stock actuel:</span>
                <span className={`detail-value ${getStockStatus(currentItem.stock).toLowerCase().replace(' ', '-')}`}>
                  {currentItem.stock} ({getStockStatus(currentItem.stock)})
                </span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Référence:</span>
                <span className="detail-value">{currentItem.reference}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Date:</span>
                <span className="detail-value">{currentItem.date}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Catégorie:</span>
                <span className="detail-value">{currentItem.category}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Modèle:</span>
                <span className="detail-value">{currentItem.model}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Méthode de paiement:</span>
                <span className="detail-value">
                  {currentItem.paymentMethod === 'virement' && 'Virement bancaire'}
                  {currentItem.paymentMethod === 'cheque' && 'Chèque'}
                  {currentItem.paymentMethod === 'espece' && 'Espèces'}
                  {currentItem.paymentMethod === 'carte bancaire' && 'Carte bancaire'}
                </span>
              </div>
            </div>
            
            <div className="modal-actions">
              <button 
                type="button" 
                className="btn close" 
                onClick={() => setShowViewModal(false)}
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && currentItem && (
        <div className="modal-overlay">
          <div className="delete-confirmation-modal">
            <h3>Supprimer?</h3>
            <p>Êtes-vous sûr de vouloir supprimer cet achat?</p>
            <p>Le stock sera diminué de {currentItem.quantity} unités.</p>
            <div className="modal-actions">
              <button 
                type="button" 
                className="btn cancel" 
                onClick={() => setShowDeleteModal(false)}
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
        <h2>Achats et Stock</h2>
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
            onClick={() => setShowAddModal(true)}
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
                <th>Prix unitaire</th>
                <th>Quantité</th>
                <th>Total</th>
                <th>Stock</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPurchases.map((purchase) => {
                const product = products.find(p => p.id === purchase.productId) || {};
                return (
                  <tr key={purchase.id}>
                    <td>{purchase.productName}</td>
                    <td>{purchase.supplier}</td>
                    <td>{purchase.price.toFixed(3)} dt</td>
                    <td>{purchase.quantity}</td>
                    <td>{purchase.totalPrice.toFixed(3)} dt</td>
                    <td>
                      <span className={`stock-status ${getStockStatus(product.stock || 0).toLowerCase().replace(' ', '-')}`}>
                        {product.stock || 0} ({getStockStatus(product.stock || 0)})
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button 
                          className="btn action-button view"
                          onClick={() => handleView(purchase.id)}
                        >
                          <FaEye className="action-icon" />
                        </button>
                        <button 
                          className="btn action-button delete"
                          onClick={() => handleDelete(purchase.id)}
                        >
                          <FaTrash className="action-icon" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
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