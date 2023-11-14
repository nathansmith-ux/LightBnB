const properties = require("./json/properties.json");
const users = require("./json/users.json");
const { Pool } = require('pg');

const pool = new Pool({
  user: 'vagrant',
  password: '123',
  host: 'localhost',
  database: 'lightbnb'
});

/// Users

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithEmail = function (email) {
  return pool.query('SELECT id, name, email, password FROM users WHERE email = $1;', [email])
  .then((res) => {
    if (res.rows[0]){
      return res.rows[0];
    }
    return null;
  })
  .catch(err => {
    console.log('SQL error', err.message) 
    return Promise.reject(err) 
  })
};

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithId = function (id) {
  return pool.query('SELECT id, name, email, password FROM users WHERE id = $1;', [id])
  .then((res) => {
    if (res.rows[0]){
      return res.rows[0]
    }
    return null;
  })
  .catch(err => {
    console.log('SQL error', err.message)
    return Promise.reject(err);
  })
};

/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
const addUser = function (user) {
  return pool.query('INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *;', [user.name, user.email, user.password])
  .then((res) => {
    return res.rows[0]
  })
  .catch((err) => {
    console.log('SQL error', err.message)
    return Promise.reject(err);
  })
};

/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = function (guest_id, limit = 10) {
  return pool.query('SELECT reservations.*, properties.title, properties.cover_photo_url, properties.number_of_bedrooms, number_of_bathrooms, properties.parking_spaces, properties.cost_per_night, AVG(property_reviews.rating) as average_rating FROM reservations JOIN properties ON properties.id = property_id LEFT JOIN property_reviews ON properties.id = property_reviews.property_id WHERE reservations.guest_id = $1 GROUP BY reservations.id, properties.title, properties.cost_per_night, reservations.start_date, properties.number_of_bedrooms, number_of_bathrooms, properties.parking_spaces, properties.cover_photo_url ORDER BY reservations.start_date DESC LIMIT $2;', [guest_id, limit])
  .then((res) => {
    return res.rows;
  })
  .catch((err) => {
    console.log('SQL error', err.message)
    return Promise.reject(err);
  })
};

/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */
const getAllProperties = function (options, limit = 10) {
  return pool.query('SELECT * FROM properties LIMIT $1;', [limit])
  .then((res) => {
    return res.rows;
  })
  .catch(err => {
    console.log('SQL error', err.message)
    return Promise.reject(err);
  })
};

/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function (property) {
  const propertyId = Object.keys(properties).length + 1;
  property.id = propertyId;
  properties[propertyId] = property;
  return Promise.resolve(property);
};

module.exports = {
  getUserWithEmail,
  getUserWithId,
  addUser,
  getAllReservations,
  getAllProperties,
  addProperty,
};
