import axios from 'axios';

const API_BASE_URL = 'http://localhost:5011/api';

export const getClientsByOptician = (opticianId) =>
  axios.get(`${API_BASE_URL}/Opticiens/${opticianId}/GetClients`);
export const updateClient = (opticianId, clientId, clientData) => {
  return axios.put(
    `${API_BASE_URL}/Opticiens/${opticianId}/UpdateClient/${clientId}`,
    {
      firstName: clientData.firstName,
      lastName: clientData.lastName,
      phoneNumber: clientData.phone,
      address: clientData.adresse || "string",
      email: clientData.email || "string",
      isMobileClient: clientData.type === 'mobile',
      isActive: true
    }
  );
};

export const deleteClientFromOptician = async (opticianId, clientId) => {
  try {
    const response = await axios.delete(
      `${API_BASE_URL}/Opticiens/${opticianId}/DeleteClient/${clientId}`
    );
    return response.data;
  } catch (error) {
    console.error('Error deleting client:', error);
    throw error;
  }
};
export const addClientToOptician = async (opticianId, clientData) => {
  try {
    const payload = {
      firstName: clientData.firstName?.trim() || '',
      lastName: clientData.lastName?.trim() || '',
      phoneNumber: clientData.phoneNumber?.trim() || '',
      lastVisit: clientData.lastVisit || new Date().toISOString(),
      address: clientData.address?.trim() || 'Non spécifié',
      email: clientData.email?.trim() || 'Non spécifié',
      isMobileClient: clientData.isMobileClient ?? true,
      isActive: clientData.isActive ?? true
    };

    const response = await axios.post(
      `${API_BASE_URL}/Opticiens/${opticianId}/AddClient`,
      payload,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    return response;
  } catch (error) {
    console.error('Error in addClientToOptician:', error);
    throw error;
  }
  
};
 