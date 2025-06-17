import React, { useEffect, useState } from 'react';
import './ClientsSection.css';
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
import { getClientsByOptician, addClientToOptician,deleteClientFromOptician,updateClient } from '../../services/clientService';


const ClientsSection = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [showAddClientModal, setShowAddClientModal] = useState(false);
  const [showEditClientModal, setShowEditClientModal] = useState(false);
  const [newClient, setNewClient] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    adresse: '',
    email: '',
    type: 'mobile'
  });
  const [editingClient, setEditingClient] = useState(null);
  const [errors, setErrors] = useState({
    firstName: false,
    lastName: false,
    phone: false
  });
  const [clientToDelete, setClientToDelete] = useState(null);
  const [viewingClient, setViewingClient] = useState(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  
  const OPTICIAN_ID = '6734f979-bc42-4c75-f8aa-08dda6c401a1';
  const fetchData = async () => {
      try {
        const { data } = await getClientsByOptician(OPTICIAN_ID);
        const formatted = data.map((c) => ({
          id: c.id,
          name: c.firstName && c.lastName 
            ? `${c.lastName} ${c.firstName}`.toUpperCase() 
            : 'Nom non spécifié',
          phone: c.phoneNumber || 'Non spécifié',
          adresse: c.address || 'Non spécifié',
          email: c.email || 'Non spécifié',
          type: c.isMobileClient ? 'mobile' : 'store',
          firstname: c.firstName || '',
          lastname: c.lastName || ''
        }));
        setClients(formatted);
      } catch (err) {
        console.error('Error fetching clients', err);
      } finally {
        setLoading(false);
      }
    };
  useEffect(() => {
  
    fetchData();
  }, [OPTICIAN_ID]);

  const filteredClients = clients.filter(client => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = (
      client.name.toLowerCase().includes(searchLower) ||
      (client.phone && client.phone.includes(searchTerm)) ||
      (client.email && client.email.toLowerCase().includes(searchLower)) ||
      (client.adresse && client.adresse.toLowerCase().includes(searchLower))
    );
    const matchesType = selectedFilter === 'all' || client.type === selectedFilter;
    
    return matchesSearch && matchesType;
  });

  const typeFilters = [
    { value: 'all', label: 'Tous les clients' },
    { value: 'mobile', label: 'Utilisateurs Mobile', icon: <FaMobileAlt /> },
    { value: 'store', label: 'Visiteurs Boutique', icon: <FaStore /> }
  ];

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
      adresse: '',
      email: '',
      type: 'mobile'
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewClient(prev => ({
      ...prev,
      [name]: value || ''
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: false
      }));
    }
  };
const handleDeleteClick = (client) => {
  setClientToDelete(client);
  setShowDeleteConfirmation(true);
};

const handleConfirmDelete = async () => {
  try {
    await deleteClientFromOptician(OPTICIAN_ID, clientToDelete.id);
    
    setClients(prevClients => 
      prevClients.filter(client => client.id !== clientToDelete.id)
    );
    
    setShowDeleteConfirmation(false);
    setClientToDelete(null);
   
  } catch (error) {
    console.error('Error deleting client:', error);
    alert(`Erreur lors de la suppression: ${error.message}`);
  }
};

const handleCancelDelete = () => {
  setShowDeleteConfirmation(false);
  setClientToDelete(null);
};
const handleSubmitClient = async (e) => {
  e.preventDefault();
  
  // Validate required fields first
  const validationErrors = {
    firstName: !newClient.firstName?.trim(),
    lastName: !newClient.lastName?.trim(),
    phone: !newClient.phone?.trim()
  };

  setErrors(validationErrors);

  // Check if there are any validation errors
  if (Object.values(validationErrors).some(error => error)) {
    alert("Veuillez remplir tous les champs obligatoires (Nom, Prénom et Téléphone)");
    return;
  }

  try {
    // Prepare the payload with proper fallbacks
    const payload = {
      firstName: newClient.firstName.trim(),
      lastName: newClient.lastName.trim(),
      phoneNumber: newClient.phone.trim(),
      lastVisit: new Date().toISOString(),
      address: newClient.adresse?.trim() || "Non spécifié",
      email: newClient.email?.trim() || "Non spécifié",
      isMobileClient: newClient.type === 'mobile',
      isActive: true
    };

    console.log("Submitting client data:", payload); // Debug log

    const response = await addClientToOptician(OPTICIAN_ID, payload);
    
    if (!response?.data) {
      throw new Error("La réponse du serveur est vide");
    }

    const createdClient = response.data;
    
    // Update the clients list
    setClients(prevClients => [
      ...prevClients,
      {
        id: createdClient.id,
        name: `${createdClient.lastName} ${createdClient.firstName}`.toUpperCase(),
        phone: createdClient.phoneNumber,
        adresse: createdClient.address,
        email: createdClient.email,
        type: createdClient.isMobileClient ? 'mobile' : 'store',
        isActive: createdClient.isActive
      }
    ]);

    // Close modal and reset form
    handleCloseModal();
    fetchData();
    alert('Client ajouté avec succès!');

  } catch (error) {
    console.error("Erreur détaillée:", {
      error: error,
      response: error.response,
      message: error.message
    });

    let errorMessage = "Une erreur est survenue lors de l'ajout du client";
    
    if (error.response) {
      // Handle HTTP errors
      if (error.response.status === 400) {
        errorMessage = "Données invalides: " + 
          (error.response.data?.message || JSON.stringify(error.response.data));
      } else if (error.response.status === 500) {
        errorMessage = "Erreur serveur. Veuillez réessayer plus tard.";
      }
    } else if (error.message) {
      // Handle other errors
      errorMessage = error.message;
    }

    alert(errorMessage);
  }
};

const handleEditClient = (client) => {
  setEditingClient({
    id: client.id,
    firstName: client.firstname || '',
    lastName: client.lastname || '',
    phone: client.phone || '',
    adresse: client.adresse || '',
    email: client.email || '',
    type: client.type || 'mobile'
  });
  setShowEditClientModal(true);
};

const handleUpdateClient = async (e) => {
  e.preventDefault();
  
  // Validate required fields
  if (!editingClient.firstName || !editingClient.lastName || !editingClient.phone) {
    alert("Veuillez remplir tous les champs obligatoires");
    return;
  }

  try {
    const opticianId = "6734f979-bc42-4c75-f8aa-08dda6c401a1";
    const response = await updateClient(opticianId, editingClient.id, editingClient);
    
    // Update the client in the local state
    setClients(clients.map(client => 
      client.id === editingClient.id 
        ? { 
            ...client, 
            name: `${editingClient.lastName} ${editingClient.firstName}`.toUpperCase(),
            phone: editingClient.phone,
            adresse: editingClient.adresse,
            email: editingClient.email,
            type: editingClient.type
          } 
        : client
    ));

    setShowEditClientModal(false);
    alert('Client mis à jour avec succès!');
  } catch (err) {
    console.error('Error updating client:', err);
    alert(`Erreur lors de la mise à jour du client: ${err.response?.data?.message || err.message}`);
  }
};



  return (
    <div className="clients-section">
      {/* Add Client Modal */}
      {showAddClientModal && (
        <div className="modal-overlay">
          <div className="add-client-modal">
            <div className="modal-header">
              <h3>Ajouter un nouveau client</h3>
              <button className="close-modal" onClick={handleCloseModal}>
                <FaTimes />
              </button>
            </div>
            
            <div className="modal-content">
              <form onSubmit={handleSubmitClient}>
                <div className="form-fields">
                  <div className="form-group">
                    <label>Nom :</label>
                    <input
                      type="text"
                      name="lastName"
                      value={newClient.lastName}
                      onChange={handleInputChange}
                      className={errors.lastName ? 'error' : ''}
                    />
                    {errors.lastName && <span className="error-message">Ce champ est obligatoire</span>}
                  </div>
                  
                  <div className="form-group">
                    <label>Prénom :</label>
                    <input
                      type="text"
                      name="firstName"
                      value={newClient.firstName}
                      onChange={handleInputChange}
                      className={errors.firstName ? 'error' : ''}
                    />
                    {errors.firstName && <span className="error-message">Ce champ est obligatoire</span>}
                  </div>
                  
                  <div className="form-group">
                    <label>Téléphone :</label>
                    <input
                      type="tel"
                      name="phone"
                      value={newClient.phone}
                      onChange={handleInputChange}
                      className={errors.phone ? 'error' : ''}
                    />
                    {errors.phone && <span className="error-message">Ce champ est obligatoire</span>}
                  </div>
                  
                  <div className="form-group">
                    <label>Adresse : (optionnel)</label>
                    <input
                      type="text"
                      name="adresse"
                      value={newClient.adresse}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Email : (optionnel)</label>
                    <input
                      type="email"
                      name="email"
                      value={newClient.email}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Type :</label>
                    <div className="type-options">
                      <label className={newClient.type === 'mobile' ? 'selected' : ''}>
                        <input
                          type="radio"
                          name="type"
                          value="mobile"
                          checked={newClient.type === 'mobile'}
                          onChange={() => setNewClient({...newClient, type: 'mobile'})}
                        />
                        <FaMobileAlt /> Mobile
                      </label>
                      <label className={newClient.type === 'store' ? 'selected' : ''}>
                        <input
                          type="radio"
                          name="type"
                          value="store"
                          checked={newClient.type === 'store'}
                          onChange={() => setNewClient({...newClient, type: 'store'})}
                        />
                        <FaStore /> Boutique
                      </label>
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
      {showEditClientModal && (
  <div className="modal-overlay">
    <div className="add-client-modal">
      <div className="modal-header">
        <h3>Modifier le client</h3>
        <button className="close-modal" onClick={() => setShowEditClientModal(false)}>
          <FaTimes />
        </button>
      </div>
      
      <div className="modal-content">
        <form onSubmit={handleUpdateClient}>
          <div className="form-fields">
            <div className="form-group">
              <label>Nom :</label>
              <input
                type="text"
                name="lastName"
                value={editingClient?.lastName || ''}
                onChange={(e) => setEditingClient({...editingClient, lastName: e.target.value})}
              />
            </div>
            
            <div className="form-group">
              <label>Prénom :</label>
              <input
                type="text"
                name="firstName"
                value={editingClient?.firstName || ''}
                onChange={(e) => setEditingClient({...editingClient, firstName: e.target.value})}
              />
            </div>
            
            <div className="form-group">
              <label>Téléphone :</label>
              <input
                type="tel"
                name="phone"
                value={editingClient?.phone || ''}
                onChange={(e) => setEditingClient({...editingClient, phone: e.target.value})}
              />
            </div>
            
            <div className="form-group">
              <label>Adresse : (optionnel)</label>
              <input
                type="text"
                name="adresse"
                value={editingClient?.adresse || ''}
                onChange={(e) => setEditingClient({...editingClient, adresse: e.target.value})}
              />
            </div>
            
            <div className="form-group">
              <label>Email : (optionnel)</label>
              <input
                type="email"
                name="email"
                value={editingClient?.email || ''}
                onChange={(e) => setEditingClient({...editingClient, email: e.target.value})}
              />
            </div>
            
            <div className="form-group">
              <label>Type :</label>
              <div className="type-options">
                <label className={editingClient?.type === 'mobile' ? 'selected' : ''}>
                  <input
                    type="radio"
                    name="type"
                    value="mobile"
                    checked={editingClient?.type === 'mobile'}
                    onChange={() => setEditingClient({...editingClient, type: 'mobile'})}
                  />
                  <FaMobileAlt /> Mobile
                </label>
                <label className={editingClient?.type === 'store' ? 'selected' : ''}>
                  <input
                    type="radio"
                    name="type"
                    value="store"
                    checked={editingClient?.type === 'store'}
                    onChange={() => setEditingClient({...editingClient, type: 'store'})}
                  />
                  <FaStore /> Boutique
                </label>
              </div>
            </div>
          </div>
          
          <div className="modal-actions">
            <button type="button" className="btn cancel" onClick={() => setShowEditClientModal(false)}>
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

 {showDeleteConfirmation && (
        <div className="modal-overlay">
          <div className="confirmation-modal">
            <div className="modal-header">
              <h3>Confirmer la suppression</h3>
              <button className="close-modal" onClick={handleCancelDelete}>
                <FaTimes />
              </button>
            </div>
            <div className="modal-content">
              <p>Êtes-vous sûr de vouloir supprimer le client {clientToDelete?.name} ?</p>
              <div className="modal-actions">
                <button 
                  className="btn cancel" 
                  onClick={handleCancelDelete}
                >
                  Annuler
                </button>
                <button 
                  className="btn delete-confirm" 
                  onClick={handleConfirmDelete}
                >
                  Supprimer
                </button>
              </div>
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
        {loading ? (
          <div className="loading">
            <p>Chargement des clients...</p>
          </div>
        ) : filteredClients.length > 0 ? (
          <table className="clients-table">
            <thead>
              <tr>
                <th>Nom et Prénom</th>
                <th>Téléphone</th>
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
                  <td>{client.adresse}</td>
                  <td>{client.email}</td>
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
                      >
                        <FaEye className="action-icon" />
                      </button>
                      <button 
                        className="btn action-button edit"
                        onClick={() => handleEditClient(client)}
                      >
                        <FaEdit className="action-icon"  />

                      </button>
                      <button 
                        className="btn action-button delete"
                        onClick={() => handleDeleteClick(client)}
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