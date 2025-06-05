import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './prescriptions.css';
import {
  FaSearch,  
  FaPlus,
  FaEye,
  FaEdit,
  FaTrash,
  FaChevronDown,
  FaTimes
} from 'react-icons/fa';
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

// ⚠️ REMPLACER CETTE VARIABLE PAR LE BON ID OPTICIEN ⚠️
const OPTICIEN_ID = "7718a77f-b99d-4d46-54ef-08dda3c3977e"; // À METTRE À JOUR AVEC LE VRAI ID  

const Prescriptions = () => {
  // ─── ÉTATS (STATE) ────────────────────────────────────────────────────
  const [ordonnances, setOrdonnances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [showAddOrdonnanceModal, setShowAddOrdonnanceModal] = useState(false);
  const [showEditOrdonnanceModal, setShowEditOrdonnanceModal] = useState(false);
  const [newOrdonnance, setNewOrdonnance] = useState({
    client: '',
    date: '',
    correctionType: false,
    od: { sph: '0.00', cyl: '0.00', axe: '0', add: '+0.75' },
    og: { sph: '0.00', cyl: '0.00', axe: '0', add: '+0.75' },
    mesures: { eip: 30, h: 18 }
  });
  const [editingOrdonnance, setEditingOrdonnance] = useState(null);
  const [ordonnanceToDelete, setOrdonnanceToDelete] = useState(null);
  const [viewingOrdonnance, setViewingOrdonnance] = useState(null);

  // ─── OPTIONS POUR LES SELECTIONS ──────────────────────────────────────
  const correctionTypeOptions = [
    { value: false, label: 'Loin' },
    { value: true, label: 'Près' }
  ];
  const sphOptions = [
    '-6.00', '-5.00', '-4.00', '-3.00', '-2.00', '-1.00',
    '0.00', '+0.50', '+1.00', '+1.50', '+2.00', '+2.50'
  ];
  const cylOptions = ['0.00', '-0.25', '-0.50', '-0.75', '-1.00', '-1.25'];
  const axeOptions = ['0', '10', '20', '30', '45', '60', '90', '120', '135', '150', '180'];
  const addOptions = ['+0.75', '+1.00', '+1.25', '+1.50', '+1.75', '+2.00', '+2.25', '+2.50', '+2.75', '+3.00'];
  const eipOptions = [28, 29, 30, 31, 32];
  const hOptions = [16, 17, 18, 19, 20];

  // ─── EFFET POUR CHARGER LES ORDONNANCES AU MONTAGE ────────────────────
  useEffect(() => {
    fetchOrdonnances();
  }, []);

  // ─── RÉCUPÉRATION DES ORDONNANCES DEPUIS L'API ───────────────────────
  const fetchOrdonnances = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`https://localhost:7006/${OPTICIEN_ID}/GetPrescriptions`);

      
      const data = response.data.map(prescription => ({
        id: prescription.id,
        client: prescription.clientName.toUpperCase(),
        date: new Date(prescription.date).toISOString().split('T')[0],
        correctionType: prescription.correctionType,
        od: {
          sph: prescription.rightEyeSphere?.toFixed(2) || '0.00',
          cyl: prescription.rightEyeCylindre?.toFixed(2) || '0.00',
          axe: `${prescription.rightEyeAxe || '0'}`,
          add: `+${prescription.rightEyeAddition?.toFixed(2) || '0.00'}`
        },
        og: {
          sph: prescription.leftEyeSphere?.toFixed(2) || '0.00',
          cyl: prescription.leftEyeCylindre?.toFixed(2) || '0.00',
          axe: `${prescription.leftEyeAxe || '0'}`,
          add: `+${prescription.leftEyeAddition?.toFixed(2) || '0.00'}`
        },
        mesures: {
          eip: prescription.eip || 30,
          h: prescription.height || 18
        }
      }));
      
      setOrdonnances(data);
    } catch (err) {
      console.error('Erreur lors de la récupération des ordonnances:', err);
      setError('Impossible de charger les ordonnances.');
    } finally {
      setLoading(false);
    }
  };

  // ─── AJOUT D'UNE NOUVELLE ORDONNANCE ──────────────────────────────────
  const createOrdonnance = async (ordonnance) => {
    try {
      const payload = {
        ClientName: ordonnance.client,
        CorrectionType: ordonnance.correctionType,
        Date: ordonnance.date,
        EIP: parseInt(ordonnance.mesures.eip),
        Height: parseInt(ordonnance.mesures.h),
        LeftEyeAddition: parseFloat(ordonnance.og.add.replace('+', '')),
        LeftEyeAxe: parseInt(ordonnance.og.axe),
        LeftEyeCylindre: parseFloat(ordonnance.og.cyl),
        LeftEyeSphere: parseFloat(ordonnance.og.sph),
        RightEyeAddition: parseFloat(ordonnance.od.add.replace('+', '')),
        RightEyeAxe: parseInt(ordonnance.od.axe),
        RightEyeCylindre: parseFloat(ordonnance.od.cyl),
        RightEyeSphere: parseFloat(ordonnance.od.sph)
      };
      
      await axios.post(`https://localhost:7006/${OPTICIEN_ID}/AddPrescription`, payload);

      fetchOrdonnances();
    } catch (err) {
      console.error('Erreur lors de la création:', err);
      alert("Erreur lors de la création de l'ordonnance");
    }
  };

  // ─── MISE À JOUR D'UNE ORDONNANCE EXISTANTE ──────────────────────────
  const updateOrdonnanceOnServer = async (ordonnance) => {
    try {
      const payload = {
        ClientName: ordonnance.client,
        CorrectionType: ordonnance.correctionType,
        Date: ordonnance.date,
        EIP: parseInt(ordonnance.mesures.eip),
        Height: parseInt(ordonnance.mesures.h),
        LeftEyeAddition: parseFloat(ordonnance.og.add.replace('+', '')),
        LeftEyeAxe: parseInt(ordonnance.og.axe),
        LeftEyeCylindre: parseFloat(ordonnance.og.cyl),
        LeftEyeSphere: parseFloat(ordonnance.og.sph),
        RightEyeAddition: parseFloat(ordonnance.od.add.replace('+', '')),
        RightEyeAxe: parseInt(ordonnance.od.axe),
        RightEyeCylindre: parseFloat(ordonnance.od.cyl),
        RightEyeSphere: parseFloat(ordonnance.od.sph)
      };
      
      await axios.put(`https://localhost:7006/${OPTICIEN_ID}/UpdatePrescription/${ordonnance.id}`, payload);

      fetchOrdonnances();
    } catch (err) {
      console.error('Erreur lors de la mise à jour:', err);
      alert("Erreur lors de la modification de l'ordonnance");
    }
  };

  // ─── SUPPRESSION D'UNE ORDONNANCE ────────────────────────────────────
  const deleteOrdonnanceOnServer = async (id) => {
    try {
      await axios.delete(`https://localhost:7006/${OPTICIEN_ID}/DeletePrescription/${id}`);

      setOrdonnances(prev => prev.filter(o => o.id !== id));
    } catch (err) {
      console.error('Erreur lors de la suppression:', err);
      alert("Erreur lors de la suppression de l'ordonnance");
    } finally {
      setOrdonnanceToDelete(null);
    }
  };

  // ─── FILTRAGE DES ORDONNANCES POUR LA RECHERCHE ──────────────────────
  const filteredOrdonnances = ordonnances.filter(ordonnance => {
    const searchLower = searchTerm.toLowerCase();
    return (
      ordonnance.client.toLowerCase().includes(searchLower) ||
      ordonnance.date.includes(searchTerm)
    );
  });

  // ─── GESTION DES FORMULAIRES (AJOUT/MODIFICATION) ────────────────────
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewOrdonnance(prev => ({ ...prev, [name]: value }));
  };

  const handleEyeInputChange = (eye, field, value) => {
    setNewOrdonnance(prev => ({
      ...prev,
      [eye]: { ...prev[eye], [field]: value }
    }));
  };

  const handleMesuresInputChange = (field, value) => {
    setNewOrdonnance(prev => ({
      ...prev,
      mesures: { ...prev.mesures, [field]: value }
    }));
  };

  const handleSubmitOrdonnance = (e) => {
    e.preventDefault();
    createOrdonnance({ 
      ...newOrdonnance, 
      client: newOrdonnance.client.toUpperCase() 
    });
    handleCloseModal();
  };

  // ─── GESTION DES MODALES ──────────────────────────────────────────────
  const handleAddOrdonnance = () => setShowAddOrdonnanceModal(true);

  const handleCloseModal = () => {
    setShowAddOrdonnanceModal(false);
    setNewOrdonnance({
      client: '',
      date: '',
      correctionType: false,
      od: { sph: '0.00', cyl: '0.00', axe: '0', add: '+0.75' },
      og: { sph: '0.00', cyl: '0.00', axe: '0', add: '+0.75' },
      mesures: { eip: 30, h: 18 }
    });
  };

  const handleEdit = (id) => {
    const ordonnance = ordonnances.find(o => o.id === id);
    setEditingOrdonnance(ordonnance);
    setShowEditOrdonnanceModal(true);
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditingOrdonnance(prev => ({ ...prev, [name]: value }));
  };

  const handleEditEyeInputChange = (eye, field, value) => {
    setEditingOrdonnance(prev => ({
      ...prev,
      [eye]: { ...prev[eye], [field]: value }
    }));
  };

  const handleUpdateOrdonnance = (e) => {
    e.preventDefault();
    updateOrdonnanceOnServer(editingOrdonnance);
    handleCloseEditModal();
  };

  const handleCloseEditModal = () => {
    setShowEditOrdonnanceModal(false);
    setEditingOrdonnance(null);
  };

  const handleView = (id) => {
    setViewingOrdonnance(ordonnances.find(o => o.id === id));
  };

  const handleCloseView = () => setViewingOrdonnance(null);

  const handleDelete = (id) => setOrdonnanceToDelete(id);

  const confirmDelete = () => deleteOrdonnanceOnServer(ordonnanceToDelete);

  const cancelDelete = () => setOrdonnanceToDelete(null);

  // ─── COMPOSANTS DE RENDU POUR LES FORMULAIRES ────────────────────────
  const renderSelect = (options, value, onChange, name) => (
    <select value={value} onChange={onChange} name={name} className="form-select">
      {options.map(option => (
        <option key={String(option.value ?? option)} value={option.value ?? option}>
          {option.label ?? option}
        </option>
      ))}
    </select>
  );

  const renderEyeCorrectionForm = (prefix, eyeData, handleChange) => (
    <div className="eye-correction-section">
      <h4>{prefix === 'od' ? 'Œil Droit (OD)' : 'Œil Gauche (OG)'}</h4>
      <div className="form-row">
        <div className="form-group">
          <label>Sphère</label>
          {renderSelect(
            sphOptions.map(o => ({ value: o, label: o })),
            eyeData.sph,
            (e) => handleChange(prefix, 'sph', e.target.value),
            `${prefix}-sph`
          )}
        </div>
        <div className="form-group">
          <label>Cylindre</label>
          {renderSelect(
            cylOptions.map(o => ({ value: o, label: o })),
            eyeData.cyl,
            (e) => handleChange(prefix, 'cyl', e.target.value),
            `${prefix}-cyl`
          )}
        </div>
      </div>
      <div className="form-row">
        <div className="form-group">
          <label>Axe</label>
          {renderSelect(
            axeOptions.map(o => ({ value: o, label: `${o}°` })),
            eyeData.axe,
            (e) => handleChange(prefix, 'axe', e.target.value),
            `${prefix}-axe`
          )}
        </div>
        <div className="form-group">
          <label>Addition</label>
          {renderSelect(
            addOptions.map(o => ({ value: o, label: o })),
            eyeData.add,
            (e) => handleChange(prefix, 'add', e.target.value),
            `${prefix}-add`
          )}
        </div>
      </div>
    </div>
  );

  const renderMesuresForm = (mesuresData, handleChange) => (
    <div className="mesures-section">
      <h4>Mesures supplémentaires</h4>
      <div className="form-row">
        <div className="form-group">
          <label>EIP</label>
          {renderSelect(
            eipOptions.map(o => ({ value: o, label: `${o} mm` })),
            mesuresData.eip,
            (e) => handleChange('eip', e.target.value),
            'eip'
          )}
        </div>
        <div className="form-group">
          <label>Hauteur</label>
          {renderSelect(
            hOptions.map(o => ({ value: o, label: `${o} mm` })),
            mesuresData.h,
            (e) => handleChange('h', e.target.value),
            'h'
          )}
        </div>
      </div>
    </div>
  );

  // ─── RENDU PRINCIPAL ──────────────────────────────────────────────────
  return (
    <div className="prescriptions-section">
      {error && <div className="error-message">{error}</div>}
      {loading ? (
        <div className="loading">Chargement…</div>
      ) : (
        <>
          {/* MODALE D'AJOUT */}
          {showAddOrdonnanceModal && (
            <div className="modal-overlay">
              <div className="add-ordonnance-modal">
                <div className="modal-header">
                  <h3>Ajouter une ordonnance</h3>
                  <button className="close-modal" onClick={handleCloseModal}>
                    <FaTimes />
                  </button>
                </div>
                <div className="modal-content">
                  <form onSubmit={handleSubmitOrdonnance}>
                    <div className="form-fields">
                      <div className="form-group">
                        <label>Client :</label>
                        <input
                          type="text"
                          name="client"
                          value={newOrdonnance.client}
                          onChange={handleInputChange}
                          style={{ textTransform: 'uppercase' }}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>Date :</label>
                        <input
                          type="date"
                          name="date"
                          value={newOrdonnance.date}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>Type de correction :</label>
                        {renderSelect(
                          correctionTypeOptions,
                          newOrdonnance.correctionType,
                          (e) => handleInputChange({
                            target: {
                              name: 'correctionType',
                              value: e.target.value === 'true'
                            }
                          }),
                          'correctionType'
                        )}
                      </div>
                      {renderEyeCorrectionForm('od', newOrdonnance.od, handleEyeInputChange)}
                      {renderEyeCorrectionForm('og', newOrdonnance.og, handleEyeInputChange)}
                      {renderMesuresForm(newOrdonnance.mesures, handleMesuresInputChange)}
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

          {/* MODALE DE MODIFICATION */}
          {showEditOrdonnanceModal && editingOrdonnance && (
            <div className="modal-overlay">
              <div className="add-ordonnance-modal">
                <div className="modal-header">
                  <h3>Modifier l'ordonnance</h3>
                  <button className="close-modal" onClick={handleCloseEditModal}>
                    <FaTimes />
                  </button>
                </div>
                <div className="modal-content">
                  <form onSubmit={handleUpdateOrdonnance}>
                    <div className="form-fields">
                      <div className="form-group">
                        <label>Client :</label>
                        <input
                          type="text"
                          name="client"
                          value={editingOrdonnance.client}
                          onChange={handleEditInputChange}
                          style={{ textTransform: 'uppercase' }}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>Date :</label>
                        <input
                          type="date"
                          name="date"
                          value={editingOrdonnance.date}
                          onChange={handleEditInputChange}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>Type de correction :</label>
                        {renderSelect(
                          correctionTypeOptions,
                          editingOrdonnance.correctionType,
                          (e) => handleEditInputChange({
                            target: {
                              name: 'correctionType',
                              value: e.target.value === 'true'
                            }
                          }),
                          'correctionType'
                        )}
                      </div>
                      {renderEyeCorrectionForm('od', editingOrdonnance.od, handleEditEyeInputChange)}
                      {renderEyeCorrectionForm('og', editingOrdonnance.og, handleEditEyeInputChange)}
                      {renderMesuresForm(editingOrdonnance.mesures, (field, value) => 
                        handleEditInputChange({ target: { name: field, value } })
                      )}
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

          {/* MODALE DE CONFIRMATION DE SUPPRESSION */}
          {ordonnanceToDelete && (
            <div className="modal-overlay">
              <div className="delete-confirmation-modal">
                <h3>Confirmer la suppression</h3>
                <p>Êtes-vous sûr de vouloir supprimer cette ordonnance ?</p>
                <div className="modal-actions">
                  <button type="button" className="btn cancel" onClick={cancelDelete}>
                    Annuler
                  </button>
                  <button type="button" className="btn delete" onClick={confirmDelete}>
                    Supprimer
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* MODALE DE VISUALISATION */}
          {viewingOrdonnance && (
            <div className="modal-overlay">
              <div className="view-ordonnance-modal">
                <div className="modal-header">
                  <h3>Détails de l'ordonnance</h3>
                  <button className="close-modal" onClick={handleCloseView}>
                    <FaTimes />
                  </button>
                </div>
                <div className="ordonnance-details">
                  <div className="detail-row">
                    <span className="detail-label">Client :</span>
                    <span className="detail-value">{viewingOrdonnance.client}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Date :</span>
                    <span className="detail-value">{viewingOrdonnance.date}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Type de correction :</span>
                    <span className="detail-value">
                      {viewingOrdonnance.correctionType ? 'Près' : 'Loin'}
                    </span>
                  </div>
                  
                  <div className="eye-correction-details">
                    <h4>Œil Droit (OD)</h4>
                    <div className="detail-grid">
                      <div className="detail-item">
                        <span className="detail-label">Sphère :</span>
                        <span className="detail-value">{viewingOrdonnance.od.sph}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Cylindre :</span>
                        <span className="detail-value">{viewingOrdonnance.od.cyl}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Axe :</span>
                        <span className="detail-value">{viewingOrdonnance.od.axe}°</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Addition :</span>
                        <span className="detail-value">{viewingOrdonnance.od.add}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="eye-correction-details">
                    <h4>Œil Gauche (OG)</h4>
                    <div className="detail-grid">
                      <div className="detail-item">
                        <span className="detail-label">Sphère :</span>
                        <span className="detail-value">{viewingOrdonnance.og.sph}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Cylindre :</span>
                        <span className="detail-value">{viewingOrdonnance.og.cyl}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Axe :</span>
                        <span className="detail-value">{viewingOrdonnance.og.axe}°</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Addition :</span>
                        <span className="detail-value">{viewingOrdonnance.og.add}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mesures-details">
                    <h4>Mesures</h4>
                    <div className="detail-grid">
                      <div className="detail-item">
                        <span className="detail-label">EIP :</span>
                        <span className="detail-value">{viewingOrdonnance.mesures.eip} mm</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Hauteur :</span>
                        <span className="detail-value">{viewingOrdonnance.mesures.h} mm</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="modal-actions">
                  <button type="button" className="btn close" onClick={handleCloseView}>
                    Fermer
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* SECTION PRINCIPALE */}
          <div className="prescriptions-header">
            <h2>Gestion des ordonnances</h2>
            <div className="prescriptions-controls">
              <div className="search-bar">
                <FaSearch className="search-icon" />
                <input
                  type="text"
                  placeholder="Rechercher une ordonnance..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button className="btn add-ordonnance-btn" onClick={handleAddOrdonnance}>
                <FaPlus className="btn-icon" />
                <span>Nouvelle ordonnance</span>
              </button>
            </div>
          </div>

          <div className="prescriptions-table-container">
            {filteredOrdonnances.length > 0 ? (
              <table className="prescriptions-table">
                <thead>
                  <tr>
                    <th>Client</th>
                    <th>Date</th>
                    <th>Type</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrdonnances.map(ordonnance => (
                    <tr key={ordonnance.id}>
                      <td>{ordonnance.client}</td>
                      <td>{ordonnance.date}</td>
                      <td>{ordonnance.correctionType ? 'Près' : 'Loin'}</td>
                      <td>
                        <div className="action-buttons">
                          <button className="btn action-button view" onClick={() => handleView(ordonnance.id)}>
                            <FaEye />
                          </button>
                          <button className="btn action-button edit" onClick={() => handleEdit(ordonnance.id)}>
                            <FaEdit />
                          </button>
                          <button className="btn action-button delete" onClick={() => handleDelete(ordonnance.id)}>
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="no-results">
                <p>Aucune ordonnance trouvée</p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Prescriptions;