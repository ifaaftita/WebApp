import React, { useState } from 'react';
import './orders.css';
import { 
  FaSearch, 
  FaPlus, 
  FaEye, 
  FaEdit, 
  FaTrash,
  FaChevronDown,
  FaTimes
} from 'react-icons/fa';

const Orders = () => {
  // Sample orders data
  const [orders, setOrders] = useState([
    { 
      id: 1, 
      client: 'AMIRA ZAARA', 
      orderDate: '2025-05-12', 
      totalAmount: 450.000,
      status: 'en cours',
      deliveryMethod: 'Livraison standard',
      address: '123 Rue Principale, Tunis'
    },
    { 
      id: 2, 
      client: 'KENZA ROKH', 
      orderDate: '2025-05-13', 
      totalAmount: 320.500,
      status: 'livré',
      deliveryMethod: 'Express',
      address: '456 Avenue Secondaire, Sousse'
    },
    { 
      id: 3, 
      client: 'MOHAMED ALI', 
      orderDate: '2025-05-14', 
      totalAmount: 275.000,
      status: 'annulé',
      deliveryMethod: 'Retrait en magasin',
      address: '789 Boulevard Central, Bizerte'
    }
  ]);

  // Dropdown options
  const statusOptions = ['livré', 'annulé', 'en préparation'];
  const deliveryMethods = ['Livraison standard', 'Express', 'Retrait en magasin'];

  // State management
  const [searchTerm, setSearchTerm] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [showAddOrderModal, setShowAddOrderModal] = useState(false);
  const [showEditOrderModal, setShowEditOrderModal] = useState(false);
  const [newOrder, setNewOrder] = useState({
    client: '',
    orderDate: '',
    totalAmount: '',
    status: 'en cours',
    deliveryMethod: 'Livraison standard',
    address: ''
  });
  const [editingOrder, setEditingOrder] = useState(null);
  const [orderToDelete, setOrderToDelete] = useState(null);
  const [viewingOrder, setViewingOrder] = useState(null);

  // Filter orders
  const filteredOrders = orders.filter(order => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = (
      order.client.toLowerCase().includes(searchLower) ||
      order.orderDate.includes(searchTerm) ||
      order.address.toLowerCase().includes(searchLower))
    
    const matchesStatus = selectedFilter === 'all' || order.status === selectedFilter;
    
    return matchesSearch && matchesStatus;
  });

  const statusFilters = [
    { value: 'all', label: 'Toutes les commandes' },
    { value: 'en préparation', label: 'En préparation' },
    { value: 'livré', label: 'Livré' },
    { value: 'annulé', label: 'Annulé' }
  ];

  // Handle form changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewOrder(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Similar handlers for editing
  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditingOrder(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Modal handlers
  const handleAddOrder = () => {
    setShowAddOrderModal(true);
  };

  const handleCloseModal = () => {
    setShowAddOrderModal(false);
    setNewOrder({
      client: '',
      orderDate: '',
      totalAmount: '',
      status: 'en cours',
      deliveryMethod: 'Livraison standard',
      address: ''
    });
  };

  const handleCloseEditModal = () => {
    setShowEditOrderModal(false);
    setEditingOrder(null);
  };

  // Form submission
  const handleSubmitOrder = (e) => {
    e.preventDefault();
    const order = {
      id: orders.length + 1,
      ...newOrder,
      totalAmount: parseFloat(newOrder.totalAmount)
    };
    setOrders([...orders, order]);
    handleCloseModal();
  };

  const handleUpdateOrder = (e) => {
    e.preventDefault();
    setOrders(orders.map(o => 
      o.id === editingOrder.id ? editingOrder : o
    ));
    handleCloseEditModal();
  };

  // Action handlers
  const handleView = (orderId) => {
    const order = orders.find(o => o.id === orderId);
    setViewingOrder(order);
  };

  const handleCloseView = () => {
    setViewingOrder(null);
  };

  const handleEdit = (orderId) => {
    const order = orders.find(o => o.id === orderId);
    setEditingOrder({...order});
    setShowEditOrderModal(true);
  };

  const handleDelete = (orderId) => {
    setOrderToDelete(orderId);
  };

  const confirmDelete = () => {
    setOrders(orders.filter(o => o.id !== orderToDelete));
    setOrderToDelete(null);
  };

  const cancelDelete = () => {
    setOrderToDelete(null);
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

  return (
    <div className="orders-section">
      {/* Add Order Modal */}
      {showAddOrderModal && (
        <div className="modal-overlay">
          <div className="add-order-modal">
            <div className="modal-header">
              <h3>Ajouter une nouvelle commande :</h3>
              <button className="close-modal" onClick={handleCloseModal}>
                <FaTimes />
              </button>
            </div>
            
            <div className="modal-content">
              <form onSubmit={handleSubmitOrder}>
                <div className="form-fields">
                  <div className="form-group">
                    <label htmlFor="client">Client :</label>
                    <input
                      type="text"
                      id="client"
                      name="client"
                      value={newOrder.client}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="orderDate">Date de commande :</label>
                      <input
                        type="date"
                        id="orderDate"
                        name="orderDate"
                        value={newOrder.orderDate}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="totalAmount">Montant total :</label>
                      <input
                        type="number"
                        id="totalAmount"
                        name="totalAmount"
                        value={newOrder.totalAmount}
                        onChange={handleInputChange}
                        step="0.01"
                        min="0"
                        required
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="status">Statut :</label>
                      {renderSelect(
                        statusOptions,
                        newOrder.status,
                        handleInputChange,
                        'status'
                      )}
                    </div>
                    <div className="form-group">
                      <label htmlFor="deliveryMethod">Mode de livraison :</label>
                      {renderSelect(
                        deliveryMethods,
                        newOrder.deliveryMethod,
                        handleInputChange,
                        'deliveryMethod'
                      )}
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="address">Adresse :</label>
                    <input
                      type="text"
                      id="address"
                      name="address"
                      value={newOrder.address}
                      onChange={handleInputChange}
                      required
                    />
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

      {/* Edit Order Modal */}
      {showEditOrderModal && editingOrder && (
        <div className="modal-overlay">
          <div className="add-order-modal">
            <div className="modal-header">
              <h3>Modifier la commande :</h3>
              <button className="close-modal" onClick={handleCloseEditModal}>
                <FaTimes />
              </button>
            </div>
            
            <div className="modal-content">
              <form onSubmit={handleUpdateOrder}>
                <div className="form-fields">
                  <div className="form-group">
                    <label htmlFor="edit-client">Client :</label>
                    <input
                      type="text"
                      id="edit-client"
                      name="client"
                      value={editingOrder.client}
                      onChange={handleEditInputChange}
                      required
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="edit-orderDate">Date de commande :</label>
                      <input
                        type="date"
                        id="edit-orderDate"
                        name="orderDate"
                        value={editingOrder.orderDate}
                        onChange={handleEditInputChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="edit-totalAmount">Montant total :</label>
                      <input
                        type="number"
                        id="edit-totalAmount"
                        name="totalAmount"
                        value={editingOrder.totalAmount}
                        onChange={handleEditInputChange}
                        step="0.01"
                        min="0"
                        required
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="edit-status">Statut :</label>
                      {renderSelect(
                        statusOptions,
                        editingOrder.status,
                        handleEditInputChange,
                        'status'
                      )}
                    </div>
                    <div className="form-group">
                      <label htmlFor="edit-deliveryMethod">Mode de livraison :</label>
                      {renderSelect(
                        deliveryMethods,
                        editingOrder.deliveryMethod,
                        handleEditInputChange,
                        'deliveryMethod'
                      )}
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="edit-address">Adresse :</label>
                    <input
                      type="text"
                      id="edit-address"
                      name="address"
                      value={editingOrder.address}
                      onChange={handleEditInputChange}
                      required
                    />
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
      {orderToDelete && (
        <div className="modal-overlay">
          <div className="delete-confirmation-modal">
            <h3>Supprimer?</h3>
            <p>Êtes-vous sûr de vouloir supprimer cette commande?</p>
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

      {/* View Order Modal */}
      {viewingOrder && (
        <div className="modal-overlay">
          <div className="view-order-modal">
            <div className="modal-header">
              <h3>Détails de la commande :</h3>
              <button className="close-modal" onClick={handleCloseView}>
                <FaTimes />
              </button>
            </div>
            
            <div className="order-details">
              <div className="detail-row">
                <span className="detail-label">Client :</span>
                <span className="detail-value">{viewingOrder.client}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Date de commande :</span>
                <span className="detail-value">{viewingOrder.orderDate}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Montant total :</span>
                <span className="detail-value">{viewingOrder.totalAmount.toFixed(2)} TND</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Statut :</span>
                <span className="detail-value">{viewingOrder.status}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Mode de livraison :</span>
                <span className="detail-value">{viewingOrder.deliveryMethod}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Adresse :</span>
                <span className="detail-value">{viewingOrder.address}</span>
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

      {/* Main Orders Section */}
      <div className="orders-header">
        <h2>Commandes</h2>
        <div className="orders-controls">
          <div className="search-bar">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Rechercher une commande ..."
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
            className="btn add-order-btn"
            onClick={handleAddOrder}
          >
            <FaPlus className="btn-icon" /> 
            <span>Ajouter Commande</span>
          </button>
        </div>
      </div>

      <div className="orders-table-container">
        {filteredOrders.length > 0 ? (
          <table className="orders-table">
            <thead>
              <tr>
                <th>Client</th>
                <th>Date commande</th>
                <th>Montant total</th>
                <th>Statut</th>
                <th>Mode livraison</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order.id}>
                  <td>{order.client}</td>
                  <td>{order.orderDate}</td>
                  <td>{order.totalAmount.toFixed(3)} dt</td>
                  <td>
                    <span className={`status-badge ${order.status.replace(' ', '-')}`}>
                      {order.status}
                    </span>
                  </td>
                  <td>{order.deliveryMethod}</td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        className="btn action-button view"
                        onClick={() => handleView(order.id)}
                      >
                        <FaEye className="action-icon" />
                      </button>
                      <button 
                        className="btn action-button edit"
                        onClick={() => handleEdit(order.id)}
                      >
                        <FaEdit className="action-icon" />
                      </button>
                      <button 
                        className="btn action-button delete"
                        onClick={() => handleDelete(order.id)}
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
            <p>Aucune commande trouvée</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;