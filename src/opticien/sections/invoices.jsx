import React, { useState } from 'react';
import './invoices.css';
import { 
  FaSearch, 
  FaPlus, 
  FaEye, 
  FaEdit, 
  FaTrash,
  FaPrint,
  FaChevronDown,
  FaTimes,
  FaFileInvoiceDollar
} from 'react-icons/fa';
import moment from 'moment';

const Invoices = () => {
  // Sample invoices data
  const [invoices, setInvoices] = useState([
    { 
      id: 1, 
      invoiceNumber: 'FAC-2023-001', 
      date: '2023-01-15', 
      client: 'AMIRA ZAARA', 
      total: 120.000,
      discount: 10, 
      amountDue: 108.000, // 120 - (120 * 10%)
      status: 'payé',
      paymentMethod: 'Espèces'
    },
    { 
      id: 2, 
      invoiceNumber: 'FAC-2023-002', 
      date: '2023-02-20', 
      client: 'KENZA ROKH', 
      total: 850.500,
      discount: 15, 
      amountDue: 722.925, // 850.5 - (850.5 * 15%)
      status: 'non payé',
      paymentMethod: ''
    },
    { 
      id: 3, 
      invoiceNumber: 'FAC-2023-003', 
      date: '2023-03-10', 
      client: 'YASSINE LAMRANI', 
      total: 500.000,
      discount: 0, 
      amountDue: 500.000,
      status: 'avance-chèque',
      paymentMethod: 'Chèque'
    }
  ]);

  // Status options
  const statusOptions = ['payé', 'non payé', 'avance-chèque'];
  const paymentMethods = ['Espèces', 'Chèque', 'Carte Bancaire', 'Virement'];

  // State management
  const [searchTerm, setSearchTerm] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [showAddInvoiceModal, setShowAddInvoiceModal] = useState(false);
  const [showEditInvoiceModal, setShowEditInvoiceModal] = useState(false);
  const [newInvoice, setNewInvoice] = useState({
    invoiceNumber: '',
    date: '',
    client: '',
    total: 0,
    discount: 0, 
    amountDue: 0,
    status: 'non payé',
    paymentMethod: ''
  });
  const [editingInvoice, setEditingInvoice] = useState(null);
  const [invoiceToDelete, setInvoiceToDelete] = useState(null);
  const [viewingInvoice, setViewingInvoice] = useState(null);
  const [errors, setErrors] = useState({
    invoiceNumber: false,
    date: false,
    client: false,
    total: false
  });

  // Filter invoices
  const filteredInvoices = invoices.filter(invoice => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = (
      invoice.client.toLowerCase().includes(searchLower) ||
      invoice.invoiceNumber.toLowerCase().includes(searchLower) ||
      invoice.date.includes(searchTerm))
    
    const matchesStatus = selectedFilter === 'all' || invoice.status === selectedFilter;
    
    return matchesSearch && matchesStatus;
  });

  const statusFilters = [
    { value: 'all', label: 'Toutes les Factures' },
    { value: 'payé', label: 'Payé' },
    { value: 'non payé', label: 'Non Payé' },
    { value: 'avance-chèque', label: "Avance-Chèque" }
  ];

  // Validate form function
  const validateForm = (formData) => {
    const newErrors = {
      invoiceNumber: !formData.invoiceNumber,
      date: !formData.date,
      client: !formData.client,
      total: formData.total <= 0
    };
    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error);
  };

  // Handle form changes with uppercase conversion for client name
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewInvoice(prev => ({
      ...prev,
      [name]: name === 'client' ? value.toUpperCase() : value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: false }));
    }
  };

  // Handle numeric input changes
  const handleNumericInputChange = (e) => {
    const { name, value } = e.target;
    setNewInvoice(prev => ({
      ...prev,
      [name]: parseFloat(value) || 0
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: false }));
    }
  };

  // Similar handlers for editing with uppercase conversion for client name
  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditingInvoice(prev => ({
      ...prev,
      [name]: name === 'client' ? value.toUpperCase() : value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: false }));
    }
  };

  const handleEditNumericInputChange = (e) => {
    const { name, value } = e.target;
    setEditingInvoice(prev => ({
      ...prev,
      [name]: parseFloat(value) || 0
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: false }));
    }
  };

  // Calculate amount due based on percentage discount
  const calculateAmountDue = (total, discount) => {
    const totalAmount = parseFloat(total) || 0;
    const discountPercentage = Math.min(100, Math.max(0, parseFloat(discount) || 0));
    return totalAmount * (1 - discountPercentage / 100);
  };

  // Modal handlers
  const handleAddInvoice = () => {
    setShowAddInvoiceModal(true);
    setErrors({
      invoiceNumber: false,
      date: false,
      client: false,
      total: false
    });
  };

  const handleCloseModal = () => {
    setShowAddInvoiceModal(false);
    setNewInvoice({
      invoiceNumber: '',
      date: '',
      client: '',
      total: 0,
      discount: 0,
      amountDue: 0,
      status: 'non payé',
      paymentMethod: ''
    });
  };

  const handleCloseEditModal = () => {
    setShowEditInvoiceModal(false);
    setEditingInvoice(null);
  };

  // Form submission with uppercase enforcement for client name
  const handleSubmitInvoice = (e) => {
    e.preventDefault();
    if (!validateForm(newInvoice)) return;
    
    const invoice = {
      id: invoices.length + 1,
      ...newInvoice,
      client: newInvoice.client.toUpperCase(),
      amountDue: calculateAmountDue(newInvoice.total, newInvoice.discount)
    };
    setInvoices([...invoices, invoice]);
    handleCloseModal();
  };

  const handleUpdateInvoice = (e) => {
    e.preventDefault();
    if (!validateForm(editingInvoice)) return;
    
    const updatedInvoice = {
      ...editingInvoice,
      client: editingInvoice.client.toUpperCase(),
      amountDue: calculateAmountDue(editingInvoice.total, editingInvoice.discount)
    };
    setInvoices(invoices.map(i => i.id === updatedInvoice.id ? updatedInvoice : i));
    handleCloseEditModal();
  };

  // Action handlers
  const handleView = (invoiceId) => {
    const invoice = invoices.find(i => i.id === invoiceId);
    setViewingInvoice(invoice);
  };

  const handleCloseView = () => {
    setViewingInvoice(null);
  };

  const handleEdit = (invoiceId) => {
    const invoice = invoices.find(i => i.id === invoiceId);
    setEditingInvoice({...invoice});
    setShowEditInvoiceModal(true);
    setErrors({
      invoiceNumber: false,
      date: false,
      client: false,
      total: false
    });
  };

  const handleDelete = (invoiceId) => {
    setInvoiceToDelete(invoiceId);
  };

  const confirmDelete = () => {
    setInvoices(invoices.filter(i => i.id !== invoiceToDelete));
    setInvoiceToDelete(null);
  };

  const cancelDelete = () => {
    setInvoiceToDelete(null);
  };

  const handlePrint = (invoiceId) => {
    const invoice = invoices.find(i => i.id === invoiceId);
    const printWindow = window.open('', '', 'width=800,height=600');
    
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Facture ${invoice.invoiceNumber}</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
            color: #333;
          }
          .invoice-container {
            max-width: 800px;
            margin: 0 auto;
            border: 1px solid #ddd;
            padding: 20px;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
          }
          .header {
            display: flex;
            justify-content: space-between;
            margin-bottom: 20px;
            padding-bottom: 20px;
            border-bottom: 1px solid #eee;
          }
          .company-info, .client-info {
            width: 45%;
          }
          h1 {
            color: #2a3042;
            margin: 0 0 10px 0;
            font-size: 24px;
          }
          h2 {
            font-size: 18px;
            margin: 20px 0 10px 0;
            color: #2a3042;
          }
          .invoice-details {
            margin: 20px 0;
            padding: 15px;
            background: #f9f9f9;
            border-radius: 5px;
          }
          .detail-row {
            display: flex;
            margin-bottom: 5px;
          }
          .detail-label {
            font-weight: bold;
            width: 150px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
          }
          th, td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
          }
          th {
            background-color: #f2f2f2;
          }
          .totals {
            margin-top: 20px;
            text-align: right;
          }
          .total-row {
            font-weight: bold;
            font-size: 1.1em;
            margin: 5px 0;
          }
          .footer {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #eee;
            font-size: 0.9em;
            color: #666;
          }
          @media print {
            .no-print {
              display: none;
            }
            body {
              padding: 0;
            }
            .invoice-container {
              border: none;
              box-shadow: none;
            }
          }
        </style>
      </head>
      <body>
        <div class="invoice-container">
          <div class="header">
            <div class="company-info">
              <h2>Mon Entreprise</h2>
              <p>22, Avenue Voltaire</p>
              <p>13000 Marseille</p>
              <p>N° SIRET: 123456789</p>
              <p>N° TVA: FRXX999999999</p>
            </div>
            
            <div class="client-info">
              <p><strong>Client:</strong> ${invoice.client}</p>
              <p><strong>Date:</strong> ${invoice.date}</p>
              <p><strong>N° Facture:</strong> ${invoice.invoiceNumber}</p>
            </div>
          </div>
          
          <div class="invoice-details">
            <div class="detail-row">
              <div class="detail-label">Date d'échéance:</div>
              <div>${moment(invoice.date).add(30, 'days').format('YYYY-MM-DD')}</div>
            </div>
            <div class="detail-row">
              <div class="detail-label">Statut:</div>
              <div>${invoice.status.toUpperCase()}</div>
            </div>
            ${invoice.status !== 'non payé' ? `
            <div class="detail-row">
              <div class="detail-label">Méthode de paiement:</div>
              <div>${invoice.paymentMethod}</div>
            </div>
            ` : ''}
          </div>
          
          <h2>Détails de la facture</h2>
          <table>
            <thead>
              <tr>
                <th>Description</th>
                <th>Quantité</th>
                <th>Prix unitaire</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Produit/Services</td>
                <td>1</td>
                <td>${invoice.amountDue.toFixed(3)} dt</td>
                <td>${invoice.amountDue.toFixed(3)} dt</td>
              </tr>
            </tbody>
          </table>
          
          <div class="totals">
            <div class="total-row">Total HT: ${invoice.total.toFixed(3)} dt</div>
            <div class="total-row">Remise: ${invoice.discount}%</div>
            <div class="total-row" style="font-size: 1.2em; color: #2a3042;">
              Total TTC: ${invoice.amountDue.toFixed(3)} dt
            </div>
          </div>
          
          <div class="footer">
            <p><strong>Type d'assurance:</strong> CNAM</p>
            <p><strong>Coordonnées:</strong> Tél: +216 20 829 991 | Email: contact@monentreprise.com</p>
          </div>
        </div>
        
        <script>
          window.onload = function() {
            setTimeout(function() {
              window.print();
              window.close();
            }, 500);
          };
        </script>
      </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="invoices-section">
      {/* Add Invoice Modal */}
      {showAddInvoiceModal && (
        <div className="modal-overlay">
          <div className="add-invoice-modal">
            <div className="modal-header">
              <h3>Ajouter une nouvelle facture :</h3>
              <button className="close-modal" onClick={handleCloseModal}>
                <FaTimes />
              </button>
            </div>
            
            <div className="modal-content">
              <form onSubmit={handleSubmitInvoice} noValidate>
                <div className="form-fields">
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="invoiceNumber">Numéro Facture :</label>
                      <input
                        type="text"
                        id="invoiceNumber"
                        name="invoiceNumber"
                        value={newInvoice.invoiceNumber}
                        onChange={handleInputChange}
                        className={errors.invoiceNumber ? 'error' : ''}
                      />
                      {errors.invoiceNumber && (
                        <span className="error-message">Ce champ est obligatoire.</span>
                      )}
                    </div>
                    <div className="form-group">
                      <label htmlFor="date">Date :</label>
                      <input
                        type="date"
                        id="date"
                        name="date"
                        value={newInvoice.date}
                        onChange={handleInputChange}
                        className={errors.date ? 'error' : ''}
                      />
                      {errors.date && (
                        <span className="error-message">Ce champ est obligatoire.</span>
                      )}
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="client">Client :</label>
                    <input
                      type="text"
                      id="client"
                      name="client"
                      value={newInvoice.client}
                      onChange={handleInputChange}
                      style={{ textTransform: 'uppercase' }}
                      className={errors.client ? 'error' : ''}
                    />
                    {errors.client && (
                      <span className="error-message">Ce champ est obligatoire.</span>
                    )}
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="total">Total (dt) :</label>
                      <input
                        type="number"
                        id="total"
                        name="total"
                        value={newInvoice.total}
                        onChange={(e) => {
                          handleNumericInputChange(e);
                          setNewInvoice(prev => ({
                            ...prev,
                            amountDue: calculateAmountDue(e.target.value, prev.discount)
                          }));
                        }}
                        min="0"
                        step="0.001"
                        className={errors.total ? 'error' : ''}
                      />
                      {errors.total && (
                        <span className="error-message">Le total doit être supérieur à 0.</span>
                      )}
                    </div>
                    <div className="form-group">
                      <label htmlFor="discount">Remise (%) :</label>
                      <input
                        type="number"
                        id="discount"
                        name="discount"
                        value={newInvoice.discount}
                        onChange={(e) => {
                          handleNumericInputChange(e);
                          setNewInvoice(prev => ({
                            ...prev,
                            amountDue: calculateAmountDue(prev.total, e.target.value)
                          }));
                        }}
                        min="0"
                        max="100"
                        step="1"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="amountDue">Total à Payer (dt) :</label>
                    <input
                      type="number"
                      id="amountDue"
                      name="amountDue"
                      value={newInvoice.amountDue.toFixed(3)}
                      readOnly
                      className="read-only"
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="status">Statut :</label>
                      <select
                        id="status"
                        name="status"
                        value={newInvoice.status}
                        onChange={handleInputChange}
                      >
                        {statusOptions.map(status => (
                          <option key={status} value={status}>
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group">
                      <label htmlFor="paymentMethod">Méthode de Paiement :</label>
                      <select
                        id="paymentMethod"
                        name="paymentMethod"
                        value={newInvoice.paymentMethod}
                        onChange={handleInputChange}
                        disabled={newInvoice.status === 'non payé'}
                      >
                        <option value="">-- Sélectionner --</option>
                        {paymentMethods.map(method => (
                          <option key={method} value={method}>{method}</option>
                        ))}
                      </select>
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

      {/* Edit Invoice Modal */}
      {showEditInvoiceModal && editingInvoice && (
        <div className="modal-overlay">
          <div className="add-invoice-modal">
            <div className="modal-header">
              <h3>Modifier la Facture :</h3>
              <button className="close-modal" onClick={handleCloseEditModal}>
                <FaTimes />
              </button>
            </div>
            
            <div className="modal-content">
              <form onSubmit={handleUpdateInvoice} noValidate>
                <div className="form-fields">
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="edit-invoiceNumber">Numéro Facture :</label>
                      <input
                        type="text"
                        id="edit-invoiceNumber"
                        name="invoiceNumber"
                        value={editingInvoice.invoiceNumber}
                        onChange={handleEditInputChange}
                        className={errors.invoiceNumber ? 'error' : ''}
                      />
                      {errors.invoiceNumber && (
                        <span className="error-message">Ce champ est obligatoire.</span>
                      )}
                    </div>
                    <div className="form-group">
                      <label htmlFor="edit-date">Date :</label>
                      <input
                        type="date"
                        id="edit-date"
                        name="date"
                        value={editingInvoice.date}
                        onChange={handleEditInputChange}
                        className={errors.date ? 'error' : ''}
                      />
                      {errors.date && (
                        <span className="error-message">Ce champ est obligatoire.</span>
                      )}
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="edit-client">Client :</label>
                    <input
                      type="text"
                      id="edit-client"
                      name="client"
                      value={editingInvoice.client}
                      onChange={handleEditInputChange}
                      style={{ textTransform: 'uppercase' }}
                      className={errors.client ? 'error' : ''}
                    />
                    {errors.client && (
                      <span className="error-message">Ce champ est obligatoire.</span>
                    )}
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="edit-total">Total (dt) :</label>
                      <input
                        type="number"
                        id="edit-total"
                        name="total"
                        value={editingInvoice.total}
                        onChange={(e) => {
                          handleEditNumericInputChange(e);
                          setEditingInvoice(prev => ({
                            ...prev,
                            amountDue: calculateAmountDue(e.target.value, prev.discount)
                          }));
                        }}
                        min="0"
                        step="0.001"
                        className={errors.total ? 'error' : ''}
                      />
                      {errors.total && (
                        <span className="error-message">Le total doit être supérieur à 0.</span>
                      )}
                    </div>
                    <div className="form-group">
                      <label htmlFor="edit-discount">Remise (%) :</label>
                      <input
                        type="number"
                        id="edit-discount"
                        name="discount"
                        value={editingInvoice.discount}
                        onChange={(e) => {
                          handleEditNumericInputChange(e);
                          setEditingInvoice(prev => ({
                            ...prev,
                            amountDue: calculateAmountDue(prev.total, e.target.value)
                          }));
                        }}
                        min="0"
                        max="100"
                        step="1"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="edit-amountDue">Total à Payer (dt) :</label>
                    <input
                      type="number"
                      id="edit-amountDue"
                      name="amountDue"
                      value={editingInvoice.amountDue.toFixed(3)}
                      readOnly
                      className="read-only"
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="edit-status">Statut :</label>
                      <select
                        id="edit-status"
                        name="status"
                        value={editingInvoice.status}
                        onChange={(e) => {
                          handleEditInputChange(e);
                          if (e.target.value === 'non payé') {
                            setEditingInvoice(prev => ({
                              ...prev,
                              paymentMethod: ''
                            }));
                          }
                        }}
                      >
                        {statusOptions.map(status => (
                          <option key={status} value={status}>
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group">
                      <label htmlFor="edit-paymentMethod">Méthode de Paiement :</label>
                      <select
                        id="edit-paymentMethod"
                        name="paymentMethod"
                        value={editingInvoice.paymentMethod}
                        onChange={handleEditInputChange}
                        disabled={editingInvoice.status === 'non payé'}
                      >
                        <option value="">-- Sélectionner --</option>
                        {paymentMethods.map(method => (
                          <option key={method} value={method}>{method}</option>
                        ))}
                      </select>
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
      {invoiceToDelete && (
        <div className="modal-overlay">
          <div className="delete-confirmation-modal">
            <h3>Supprimer?</h3>
            <p>Êtes-vous sûr de vouloir supprimer cette facture?</p>
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

      {/* View Invoice Modal */}
      {viewingInvoice && (
        <div className="modal-overlay">
          <div className="view-invoice-modal">
            <div className="modal-header">
              <h3>Détails de la Facture :</h3>
              <button className="close-modal" onClick={handleCloseView}>
                <FaTimes />
              </button>
            </div>
            
            <div className="invoice-details">
              <div className="invoice-header">
                <div className="invoice-number">
                  <FaFileInvoiceDollar className="invoice-icon" />
                  <span>{viewingInvoice.invoiceNumber}</span>
                </div>
                <div className={`invoice-status ${viewingInvoice.status.replace('-', '')}`}>
                  {viewingInvoice.status.toUpperCase()}
                </div>
              </div>

              <div className="detail-grid">
                <div className="detail-item">
                  <span className="detail-label">Date :</span>
                  <span className="detail-value">{viewingInvoice.date}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Client :</span>
                  <span className="detail-value">{viewingInvoice.client}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Total :</span>
                  <span className="detail-value">{viewingInvoice.total.toFixed(3)} dt</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Remise :</span>
                  <span className="detail-value">{viewingInvoice.discount}%</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Total à Payer :</span>
                  <span className="detail-value">{viewingInvoice.amountDue.toFixed(3)} dt</span>
                </div>
                {viewingInvoice.status !== 'non payé' && (
                  <div className="detail-item">
                    <span className="detail-label">Méthode de Paiement :</span>
                    <span className="detail-value">{viewingInvoice.paymentMethod}</span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="modal-actions">
              <button 
                type="button" 
                className="btn print"
                onClick={() => handlePrint(viewingInvoice.id)}
              >
                <FaPrint className="btn-icon" /> Imprimer
              </button>
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

      {/* Main Invoices Section */}
      <div className="invoices-header">
        <h2>Factures</h2>
        <div className="invoices-controls">
          <div className="search-bar">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Rechercher une facture ..."
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
            className="btn add-invoice-btn"
            onClick={handleAddInvoice}
          >
            <FaPlus className="btn-icon" /> 
            <span>Ajouter une facture</span>
          </button>
        </div>
      </div>

      <div className="invoices-table-container">
        {filteredInvoices.length > 0 ? (
          <table className="invoices-table">
            <thead>
              <tr>
                <th>Num Facture</th>
                <th>Date</th>
                <th>Client</th>
                <th>Prix</th>
                <th>Remise</th>
                <th>Total à Payer</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredInvoices.map((invoice) => (
                <tr key={invoice.id}>
                  <td>{invoice.invoiceNumber}</td>
                  <td>{invoice.date}</td>
                  <td>{invoice.client}</td>
                  <td>{invoice.total.toFixed(3)}</td>
                  <td>{invoice.discount}%</td>
                  <td>{invoice.amountDue.toFixed(3)}</td>
                  <td>
                    <span className={`status-badge ${invoice.status.replace('-', '')}`}>
                      {invoice.status}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        className="btn action-button view"
                        onClick={() => handleView(invoice.id)}
                      >
                        <FaEye className="action-icon" />
                      </button>
                      <button 
                        className="btn action-button edit"
                        onClick={() => handleEdit(invoice.id)}
                      >
                        <FaEdit className="action-icon" />
                      </button>
                      <button 
                        className="btn action-button delete"
                        onClick={() => handleDelete(invoice.id)}
                      >
                        <FaTrash className="action-icon" />
                      </button>
                      <button 
                        className="btn action-button print"
                        onClick={() => handlePrint(invoice.id)}
                      >
                        <FaPrint className="action-icon" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="no-results">
            <p>Aucune facture trouvée</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Invoices;