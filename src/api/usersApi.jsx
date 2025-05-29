import axios from 'axios';
import { userMapper } from '../helper/index'

const endpoint = 'api/v1/user'

/**
 * get All Users from api 
 * @param {*} limit 
 * @returns 
 */
export const getAllUsers = async (limit = 20) => {
  try {
    const response = await axios.get(`${process.env.REACT_APP_BFF_URL}/${endpoint}?limit=${limit}`);
    return userMapper(response.data);
  } catch (error) {
    console.error('Error fetching users:', error);
    return [];
  }
};

/**
 * create user
 */
export const createUsers = async (userData) => {

  axios.post(`${process.env.REACT_APP_BFF_URL}/${endpoint}`, userData)
    .then(response => {
      console.log('Utilisateur créé avec succès :', response.data);
    })
    .catch(error => {
      console.error('Erreur lors de la création de l’utilisateur :', error);
    });
}

/**
 * delete user
 */
export const deleteUsers = async (userId) => {
  axios.delete(`${process.env.REACT_APP_BFF_URL}/${endpoint}/${userId}`)
    .then(response => {
      console.log('Utilisateur créé avec succès :', response.data);
    })
    .catch(error => {
      console.error('Erreur lors de la création de l’utilisateur :', error);
    });
}

/**
 * update users
 */
// export const updateUsers = async () => {
//   axios.put(url, test)
//   .then(response => {
//     console.log('Utilisateur mis à jour avec succès:', response.data);
//   })
//   .catch(error => {
//     console.error('Erreur lors de la mise à jour de l’utilisateur:', error);
//   });
// }


// we don't use it for the moment
// export async function getUsers(limit = 100) {
    
//   try {
//     const response = await fetch(`${process.env.REACT_APP_BFF_URL}/${endpoint}?limit=${limit}`);
//     const data = await response.json();    

//     return userMapper(data);
//   } catch (error) {
//     console.error('Error fetching users:', error);
//     return [];
//   }
// }