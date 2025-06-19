import axios from 'axios';

const API_BASE_URL = 'http://localhost:5011/api';

// export const getAuthOptician = (opticianEmail) =>
//   axios.get(`${API_BASE_URL}/Opticiens/${opticianEmail}/Get`);

export const getAuthOptician = async (email) => {
  console.log('*************email: ', email)
  try {
    const response = await axios.post(
      '/api/Opticiens/getByEmail',
      { email },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
    console.log('*************response.data: ', response.data)
    return response.data;
  } catch (error) {
    console.error('Error fetching opticien by email:', error);
    throw error;
  }
};
 