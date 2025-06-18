import axios from 'axios';

const API_BASE_URL = 'http://localhost:5011/api';

// export const getAuthOptician = (opticianEmail) =>
//   axios.get(`${API_BASE_URL}/Opticiens/${opticianEmail}/Get`);

export const getAuthOptician = async (clientData) => {
  try {
    const payload = {
      email: clientData.email?.trim(),
      password: clientData.password,
    };

    const response = await axios.post(
      `${API_BASE_URL}/Opticiens/getAuthClient`,
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
 