import React, { useState, useRef } from 'react';
import './shop.css';
import { FaEdit, FaTrash, FaPlus, FaSave, FaTimes, FaCamera } from 'react-icons/fa';

const Shop = () => {
  // Sample shop data
  const [shopData, setShopData] = useState({
    shopName: 'Optique Vision Plus',
    address: '12 Rue Habib Bourguiba',
    city: 'Tunis',
    postalCode: '1000',
    governorate: 'Tunis',
    images: [
      'https://via.placeholder.com/300x200?text=Boutique+1',
      'https://via.placeholder.com/300x200?text=Boutique+2'
    ]
  });

  // Edit mode state
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ ...shopData });
  const fileInputRef = useRef(null);

  // Tunisian governorates
  const governorates = [
    'Tunis', 'Ariana', 'Ben Arous', 'Manouba', 'Nabeul', 'Zaghouan',
    'Bizerte', 'Béja', 'Jendouba', 'Le Kef', 'Siliana', 'Kairouan',
    'Kasserine', 'Sidi Bouzid', 'Sousse', 'Monastir', 'Mahdia',
    'Sfax', 'Gafsa', 'Tozeur', 'Kebili', 'Gabès', 'Medenine', 'Tataouine'
  ];

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle image upload
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + editData.images.length > 3) {
      alert('Maximum 3 images autorisées');
      return;
    }

    const newImages = files.map(file => URL.createObjectURL(file));
    setEditData(prev => ({
      ...prev,
      images: [...prev.images, ...newImages]
    }));
  };

  // Remove image
  const removeImage = (index) => {
    const newImages = [...editData.images];
    newImages.splice(index, 1);
    setEditData(prev => ({
      ...prev,
      images: newImages
    }));
  };

  // Replace image
  const replaceImage = (index, e) => {
    const file = e.target.files[0];
    if (!file) return;

    const newImages = [...editData.images];
    newImages[index] = URL.createObjectURL(file);
    setEditData(prev => ({
      ...prev,
      images: newImages
    }));
  };

  // Save changes
  const saveChanges = () => {
    setShopData(editData);
    setIsEditing(false);
  };

  // Cancel editing
  const cancelEditing = () => {
    setEditData({ ...shopData });
    setIsEditing(false);
  };

  return (
    <div className="shop-management">
      <div className="shop-header">
        <h2>Informations de la Boutique</h2>
        {!isEditing ? (
          <button className="edit-button" onClick={() => setIsEditing(true)}>
            <FaEdit /> Modifier
          </button>
        ) : (
          <div className="edit-actions">
            <button className="cancel-button" onClick={cancelEditing}>
              <FaTimes /> Annuler
            </button>
            <button className="save-button" onClick={saveChanges}>
              <FaSave /> Enregistrer
            </button>
          </div>
        )}
      </div>

      {!isEditing ? (
        // View Mode
        <div className="shop-view">
          <div className="shop-info">
            <div className="info-row">
              <span className="info-label">Nom de la boutique:</span>
              <span className="info-value">{shopData.shopName}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Adresse:</span>
              <span className="info-value">{shopData.address}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Ville:</span>
              <span className="info-value">{shopData.city}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Code postal:</span>
              <span className="info-value">{shopData.postalCode}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Gouvernorat:</span>
              <span className="info-value">{shopData.governorate}</span>
            </div>
          </div>

          <div className="shop-images">
            <h3>Images de la boutique :</h3>
            <div className="images-grid">
              {shopData.images.map((image, index) => (
                <div key={index} className="image-container">
                  <img src={image} alt={`Boutique ${index + 1}`} />
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        // Edit Mode
        <div className="shop-edit">
          <div className="form-group">
            <label>Nom de la boutique :</label>
            <input
              type="text"
              name="shopName"
              value={editData.shopName}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-group">
            <label>Adresse :</label>
            <input
              type="text"
              name="address"
              value={editData.address}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Ville :</label>
              <input
                type="text"
                name="city"
                value={editData.city}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label>Code postal :</label>
              <input
                type="text"
                name="postalCode"
                value={editData.postalCode}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Gouvernorat :</label>
            <select
              name="governorate"
              value={editData.governorate}
              onChange={handleInputChange}
            >
              {governorates.map(gov => (
                <option key={gov} value={gov}>{gov}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Images de la boutique (max 3) :</label>
            <div className="images-edit-container">
              {editData.images.map((image, index) => (
                <div key={index} className="image-edit-box">
                  <img src={image} alt={`Boutique ${index + 1}`} />
                  <div className="image-actions">
                    <label className="replace-button">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => replaceImage(index, e)}
                        style={{ display: 'none' }}
                      />
                    </label>
                    <button 
                      className="delete-button"
                      onClick={() => removeImage(index)}
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              ))}

              {editData.images.length < 3 && (
                <div 
                  className="add-image-box"
                  onClick={() => fileInputRef.current.click()}
                >
                  <FaPlus />
                  <span>Ajouter une image</span>
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handleImageUpload}
                    style={{ display: 'none' }}
                    multiple
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Shop;