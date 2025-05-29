import React, { useState, useEffect } from 'react';
import './ClientsSection.css';

import { getAllUsers, createUsers, deleteUsers } from '../../api/usersApi'
import { createUserMappertoApi } from '../../helper/index'

import { 
  FaSearch, 
  FaPlus, 
  FaEye, 
  FaEdit, 
  FaTrash,
  FaChevronDown,
  FaMobileAlt,
  FaStore,
  FaTimes
} from 'react-icons/fa';

const ClientsSection = () => {
  // Sample client data
  const [clients, setClients] = useState([
    { 
      id: 1, 
      name: 'AMIRA ZAARA', 
      phone: '060000000', 
      lastVisit: '2023-05-15',
      adresse: '123 Rue Principale, Tunis',
      email: 'amira@example.com',
      type: 'mobile'
    },
    { 
      id: 2, 
      name: 'KENZA ROKH', 
      phone: '060000001', 
      lastVisit: '2023-06-20',
      adresse: '456 Avenue Mohammed 5',
      email: 'kenza@example.com',
      type: 'store'
    },
    { 
      id: 3, 
      name: 'AYTOUNI FATMA', 
      phone: '060000002', 
      lastVisit: '2023-04-10',
      adresse: '789 Boulevard Barchalona , ',
      email: 'faytouni@example.com',
      type: 'mobile'
    },
    { 
      id: 4, 
      name: 'AMINE TAKKALI', 
      phone: '060000003', 
      lastVisit: '2023-07-05',
      adresse: '101 Boulevard 5, Ariena',
      email: 'amine@example.com',
      type: 'store'
    },
  ]);

  const [users, setUsers] = useState([]);

  useEffect(() => {
    getAllUsers().then(setUsers);
  }, []);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [showAddClientModal, setShowAddClientModal] = useState(false);
  const [showEditClientModal, setShowEditClientModal] = useState(false);
  const [newClient, setNewClient] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    lastVisit: '',
    adresse: '',
    email: '',
    type: ''
  });
  const [editingClient, setEditingClient] = useState(null);
  const [errors, setErrors] = useState({
    firstName: false,
    lastName: false,
    phone: false
  });
  const [clientToDelete, setClientToDelete] = useState(null);
  const [viewingClient, setViewingClient] = useState(null);

  // Filter clients
  const filteredClients = users.filter(client => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = (
      client.name.toLowerCase().includes(searchLower) ||
      client.phone.includes(searchTerm) ||
      (client.email && client.email.toLowerCase().includes(searchLower)) ||
      (client.adresse && client.adresse.toLowerCase().includes(searchLower)))
    
    const matchesType = selectedFilter === 'all' || client.type === selectedFilter;
    
    return matchesSearch && matchesType;
  });

  const typeFilters = [
    { value: 'all', label: 'Tous les clients' },
    { value: 'mobile', label: 'Utilisateurs Mobile', icon: <FaMobileAlt /> },
    { value: 'store', label: 'Visiteurs Boutique', icon: <FaStore /> }
  ];

  // Handle add new client modal
  const handleAddClient = () => {
    setShowAddClientModal(true);
    setErrors({
      firstName: false,
      lastName: false,
      phone: false
    });
  };

  const handleCloseModal = () => {
    setShowAddClientModal(false);
    setNewClient({
      firstName: '',
      lastName: '',
      phone: '',
      lastVisit: '',
      adresse: '',
      email: '',
      type: ''
    });
  };

  const handleCloseEditModal = () => {
    setShowEditClientModal(false);
    setEditingClient(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewClient(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: false
      }));
    }
  };

  const handleSubmitClient = (e) => {
    e.preventDefault();
    
    // Vérification des champs obligatoires
    const newErrors = {
      firstName: !newClient.firstName,
      lastName: !newClient.lastName,
      phone: !newClient.phone
    };
    
    setErrors(newErrors);
    
    if (newErrors.firstName || newErrors.lastName || newErrors.phone) {
      return;
    }

    const client = {
      name: newClient.firstName,
      lastName: newClient.lastName,
      phone: newClient.phone,
      lastVisit: newClient.lastVisit || undefined,
      adresse: newClient.adresse || undefined,
      email: newClient.email || undefined,
      type: newClient.type
    };
    const userData = createUserMappertoApi(client);

    createUsers(userData)
    handleCloseModal();
  };

  // Action handlers
  const handleView = (clientId) => {
    const client = clients.find(c => c.id === clientId);
    setViewingClient(client);
  };

  const handleCloseView = () => {
    setViewingClient(null);
  };

  const handleEdit = (clientId) => {
    const client = clients.find(c => c.id === clientId);
    if (client) {
      // Split the name into last name and first name
      const [lastName, firstName] = client.name.split(' ').reduce((acc, part, index) => {
        if (index === 0) acc[0] = part;
        else acc[1] = (acc[1] || '') + (index > 1 ? ' ' : '') + part;
        return acc;
      }, ['', '']);
      
      setEditingClient({
        id: client.id,
        firstName: firstName || '',
        lastName: lastName || '',
        phone: client.phone,
        lastVisit: client.lastVisit || '',
        adresse: client.adresse || '',
        email: client.email || '',
        type: client.type
      });
      setShowEditClientModal(true);
      setErrors({
        firstName: false,
        lastName: false,
        phone: false
      });
    }
  };

  const handleDelete = (clientId) => {
    setClientToDelete(clientId);
  };

  const confirmDelete = () => {
    deleteUsers(clientToDelete)
    setClientToDelete(null);
  };

  const cancelDelete = () => {
    setClientToDelete(null);
  };

  const handleUpdateClient = (e) => {
    e.preventDefault();
    
    // Validation
    const newErrors = {
      firstName: !editingClient.firstName,
      lastName: !editingClient.lastName,
      phone: !editingClient.phone
    };
    
    setErrors(newErrors);
    
    if (newErrors.firstName || newErrors.lastName || newErrors.phone) {
      return;
    }

    // Update the client
    setClients(clients.map(client => 
      client.id === editingClient.id ? {
        ...client,
        name: `${editingClient.lastName} ${editingClient.firstName}`.toUpperCase(),
        phone: editingClient.phone,
        lastVisit: editingClient.lastVisit || undefined,
        adresse: editingClient.adresse || undefined,
        email: editingClient.email || undefined,
        type: editingClient.type
      } : client
    ));
    
    handleCloseEditModal();
  };

  return (
    <div className="clients-section">
      {/* Add Client Modal */}
      {showAddClientModal && (
        <div className="modal-overlay">
          <div className="add-client-modal">
            <div className="modal-header">
              <h3>Ajouter un nouveau client :</h3>
              <button className="close-modal" onClick={handleCloseModal}>
                <FaTimes />
              </button>
            </div>
            
            <div className="modal-content">
              <form onSubmit={handleSubmitClient}>
                <div className="form-fields">
                  <div className="form-group">
                    <label htmlFor="lastName">Nom :</label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={newClient.lastName}
                      onChange={handleInputChange}
                      className={errors.lastName ? 'error' : ''}
                    />
                    {errors.lastName && <span className="error-message">Ce champ est obligatoire.</span>}
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="firstName">Prénom :</label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={newClient.firstName}
                      onChange={handleInputChange}
                      className={errors.firstName ? 'error' : ''}
                    />
                    {errors.firstName && <span className="error-message">Ce champ est obligatoire.</span>}
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="phone">Téléphone :</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={newClient.phone}
                      onChange={handleInputChange}
                      className={errors.phone ? 'error' : ''}
                    />
                    {errors.phone && <span className="error-message">Ce champ est obligatoire.</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="lastVisit">Dernière visite : (optionnel)</label>
                    <input
                      type="date"
                      id="lastVisit"
                      name="lastVisit"
                      value={newClient.lastVisit || ''}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="adresse">Adresse : (optionnel)</label>
                    <input
                      type="text"
                      id="adresse"
                      name="adresse"
                      value={newClient.adresse}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="email">Email : (optionnel)</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={newClient.email}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div className="form-group full-width">
                    <label>Type du client :</label>
                    <div className="type-options">
                      <label className={newClient.type === 'mobile' ? 'selected' : ''}>
                        <input
                          type="radio"
                          name="type"
                          value="mobile"
                          checked={newClient.type === 'mobile'}
                          onChange={handleInputChange}
                        />
                        <FaMobileAlt /> Utilisateur Mobile
                      </label>
                      <label className={newClient.type === 'store' ? 'selected' : ''}>
                        <input
                          type="radio"
                          name="type"
                          value="store"
                          checked={newClient.type === 'store'}
                          onChange={handleInputChange}
                        />
                        <FaStore /> Visiteur Boutique
                      </label>
                    </div>
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

      {/* Edit Client Modal */}
      {showEditClientModal && editingClient && (
        <div className="modal-overlay">
          <div className="add-client-modal">
            <div className="modal-header">
              <h3>Modifier le client :</h3>
              <button className="close-modal" onClick={handleCloseEditModal}>
                <FaTimes />
              </button>
            </div>
            
            <div className="modal-content">
              <form onSubmit={handleUpdateClient}>
                <div className="form-fields">
                  <div className="form-group">
                    <label htmlFor="edit-lastName">Nom :</label>
                    <input
                      type="text"
                      id="edit-lastName"
                      name="lastName"
                      value={editingClient.lastName}
                      onChange={(e) => setEditingClient({...editingClient, lastName: e.target.value})}
                      className={errors.lastName ? 'error' : ''}
                    />
                    {errors.lastName && <span className="error-message">Ce champ est obligatoire.</span>}
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="edit-firstName">Prénom :</label>
                    <input
                      type="text"
                      id="edit-firstName"
                      name="firstName"
                      value={editingClient.firstName}
                      onChange={(e) => setEditingClient({...editingClient, firstName: e.target.value})}
                      className={errors.firstName ? 'error' : ''}
                    />
                    {errors.firstName && <span className="error-message">Ce champ est obligatoire.</span>}
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="edit-phone">Téléphone :</label>
                    <input
                      type="tel"
                      id="edit-phone"
                      name="phone"
                      value={editingClient.phone}
                      onChange={(e) => setEditingClient({...editingClient, phone: e.target.value})}
                      className={errors.phone ? 'error' : ''}
                    />
                    {errors.phone && <span className="error-message">Ce champ est obligatoire.</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="edit-lastVisit">Dernière visite : (optionnel)</label>
                    <input
                      type="date"
                      id="edit-lastVisit"
                      name="lastVisit"
                      value={editingClient.lastVisit || ''}
                      onChange={(e) => setEditingClient({...editingClient, lastVisit: e.target.value})}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="edit-adresse">Adresse : (optionnel)</label>
                    <input
                      type="text"
                      id="edit-adresse"
                      name="adresse"
                      value={editingClient.adresse}
                      onChange={(e) => setEditingClient({...editingClient, adresse: e.target.value})}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="edit-email">Email : (optionnel)</label>
                    <input
                      type="email"
                      id="edit-email"
                      name="email"
                      value={editingClient.email}
                      onChange={(e) => setEditingClient({...editingClient, email: e.target.value})}
                    />
                  </div>
                  
                  <div className="form-group full-width">
                    <label>Type du client :</label>
                    <div className="type-options">
                      <label className={editingClient.type === 'mobile' ? 'selected' : ''}>
                        <input
                          type="radio"
                          name="type"
                          value="mobile"
                          checked={editingClient.type === 'mobile'}
                          onChange={() => setEditingClient({...editingClient, type: 'mobile'})}
                        />
                        <FaMobileAlt /> Utilisateur Mobile
                      </label>
                      <label className={editingClient.type === 'store' ? 'selected' : ''}>
                        <input
                          type="radio"
                          name="type"
                          value="store"
                          checked={editingClient.type === 'store'}
                          onChange={() => setEditingClient({...editingClient, type: 'store'})}
                        />
                        <FaStore /> Visiteur Boutique
                      </label>
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
      {clientToDelete && (
        <div className="modal-overlay">
          <div className="delete-confirmation-modal">
            <h3>Supprimer?</h3>
            <p>Êtes-vous sûr de vouloir supprimer ce client?</p>
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

      {/* View Client Modal */}
      {viewingClient && (
        <div className="modal-overlay">
          <div className="view-client-modal">
            <div className="modal-header">
              <h3>Détails du Client :</h3>
              <button className="close-modal" onClick={handleCloseView}>
                <FaTimes />
              </button>
            </div>
            
            <div className="client-details">
              <div className="detail-row">
                <span className="detail-label">Nom et Prénom :</span>
                <span className="detail-value">{viewingClient.name}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Téléphone :</span>
                <span className="detail-value">{viewingClient.phone}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Dernière visite :</span>
                <span className="detail-value">
                  {viewingClient.lastVisit ? new Date(viewingClient.lastVisit).toLocaleDateString() : '-'}
                </span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Adresse :</span>
                <span className="detail-value">{viewingClient.adresse || '-'}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Email :</span>
                <span className="detail-value">{viewingClient.email || '-'}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Type :</span>
                <span className="detail-value">
                  <span className={`type-text ${viewingClient.type}`}>
                    {viewingClient.type === 'mobile' ? 'Mobile' : 'Boutique'}
                  </span>
                </span>
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

      {/* Main Clients Section */}
      <div className="clients-header">
        <h2>Clients</h2>
        <div className="clients-controls">
          <div className="search-bar">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Rechercher un client ..."
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
                {typeFilters.find(f => f.value === selectedFilter)?.label}
              </span>
              <FaChevronDown className={`dropdown-icon ${filterOpen ? 'open' : ''}`} />
            </button>
            
            {filterOpen && (
              <div className="filter-options">
                {typeFilters.map(filter => (
                  <button
                    key={filter.value}
                    className={`filter-option ${selectedFilter === filter.value ? 'active' : ''}`}
                    onClick={() => {
                      setSelectedFilter(filter.value);
                      setFilterOpen(false);
                    }}
                  >
                    {filter.icon && <span className="filter-icon">{filter.icon}</span>}
                    {filter.label}
                  </button>
                ))}
              </div>
            )}
          </div>
          
          <button 
            className="btn add-client-btn"
            onClick={handleAddClient}
          >
            <FaPlus className="btn-icon" /> 
            <span>Ajouter Client</span>
          </button>
        </div>
      </div>

      <div className="clients-table-container">
        {filteredClients.length > 0 ? (
          <table className="clients-table">
            <thead>
              <tr>
                <th>Nom et Prénom</th>
                <th>Téléphone</th>
                <th>Dernière visite</th>
                <th>Adresse</th>
                <th>Email</th>
                <th>Type</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredClients.map((client) => (
                <tr key={client.id}>
                  <td>{client.name}</td>
                  <td>{client.phone}</td>
                  <td>{client.lastVisit ? new Date(client.lastVisit).toLocaleDateString() : '-'}</td>
                  <td>{client.adresse || '-'}</td>
                  <td>{client.email || '-'}</td>
                  <td>
                    <span className={`type-badge ${client.type}`}>
                      {client.type === 'mobile' ? (
                        <>
                          <FaMobileAlt className="type-icon" /> Mobile
                        </>
                      ) : (
                        <>
                          <FaStore className="type-icon" /> Boutique
                        </>
                      )}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        className="btn action-button view"
                        onClick={() => handleView(client.id)}
                      >
                        <FaEye className="action-icon" />
                      </button>
                      <button 
                        className="btn action-button edit"
                        onClick={() => handleEdit(client.id)}
                      >
                        <FaEdit className="action-icon" />
                      </button>
                      <button 
                        className="btn action-button delete"
                        onClick={() => handleDelete(client.id)}
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
            <p>Aucun client trouvé</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientsSection;