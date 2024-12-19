
import axios from "axios";

const API_BASE_URL = "http://localhost:3010";

/** 
* GET data from the API
*
* @param {string} url - The URL to fetch data from
* @returns {Promise<any>} - A promise that resolves with the fetched data
* @throws {Error} - Throws an error if the fetch operation fails
*/
export const fetchData = async (url) => {
  try {
    const res = await axios.get(`${API_BASE_URL}${url}`);
    return res.data;
  } catch (err) {
    console.error(`Failed to fetch from ${url}:`, err);
    throw err;
  }
};

/**
 * POST data to the API
 * 
 * @param {string} url - The URL to post data to
 * @param {any} data - The JSON data to post
 * @returns {Promise<any>} - A promise that resolves with the api response data
 * @throws {Error} - Throws an error if the post operation fails
 */
export const addData = async (url, data) => {
  try {
    const res = await axios.post(`${API_BASE_URL}${url}`, data);
    return res.data;
  } catch (err) {
    console.error(`Failed to add data to ${url}:`, err);
    throw err;
  }
};

/**
 * DELETE data from the API
 * 
 * @param {string} url - The URL to delete data from
 * @returns {Promise<void>} - A promise that resolves with the api response data
 * @throws {Error} - Throws an error if the delete operation fails 
 */
export const deleteData = async (url) => {
  try {
    console.log("deleting data at", url);
    await axios.delete(`${API_BASE_URL}${url}`);
  } catch (err) {
    console.error(`Failed to delete data at ${url}:`, err);
    throw err;
  }
};

/**
 * PUT data to the API
 * 
 * @param {string} url - The URL to put data to
 * @param {any} data - The JSON data to put
 * @returns {Promise<any>} - A promise that resolves with the api response data
 * @throws {Error} - Throws an error if the put operation fails
 */
export const editData = async (url, data) => {
  try {
    const res = await axios.put(`${API_BASE_URL}${url}`, data);
    console.log("updated data with PUT:", res.data);
    return res.data;
  } catch (err) {
    console.error(`Failed to update data at ${url}:`, err);
    throw err;
  }
};
