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
const getUserWithEmail = function(email) {
  return pool.query('SELECT id, name, email, password FROM users WHERE email = $1;', [email])
    .then((res) => {
      if (res.rows[0]) {
        return res.rows[0];
      }
      return null;
    })
    .catch(err => {
      console.log('SQL error', err.message);
      return Promise.reject(err);
    });
};

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithId = function(id) {
  return pool.query('SELECT id, name, email, password FROM users WHERE id = $1;', [id])
    .then((res) => {
      if (res.rows[0]) {
        return res.rows[0];
      }
      return null;
    })
    .catch(err => {
      console.log('SQL error', err.message);
      return Promise.reject(err);
    });
};

/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
const addUser = function(user) {
  return pool.query('INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *;', [user.name, user.email, user.password])
    .then((res) => {
      return res.rows[0];
    })
    .catch((err) => {
      console.log('SQL error', err.message);
      return Promise.reject(err);
    });
};

/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = function(guest_id, limit = 10) {
  return pool.query('SELECT reservations.*, properties.title, properties.cover_photo_url, properties.number_of_bedrooms, number_of_bathrooms, properties.parking_spaces, properties.cost_per_night, AVG(property_reviews.rating) as average_rating FROM reservations JOIN properties ON properties.id = property_id LEFT JOIN property_reviews ON properties.id = property_reviews.property_id WHERE reservations.guest_id = $1 GROUP BY reservations.id, properties.title, properties.cost_per_night, reservations.start_date, properties.number_of_bedrooms, number_of_bathrooms, properties.parking_spaces, properties.cover_photo_url ORDER BY reservations.start_date DESC LIMIT $2;', [guest_id, limit])
    .then((res) => {
      return res.rows;
    })
    .catch((err) => {
      console.log('SQL error', err.message);
      return Promise.reject(err);
    });
};

/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */
const getAllProperties = function(options, limit = 10) {
  const queryParams = [];
  let queryString = `SELECT properties.*, avg(property_reviews.rating) as average_rating FROM properties JOIN property_reviews ON properties.id = property_id `;
  
  /**
   * Helper function to control the addition of strings to the SQL query
   * @param {a string} condition A string to be added to the SQL query
   */
  const addCondition = (condition) => {
    queryString += (queryParams.length > 0 ? 'AND ' : 'WHERE ') + condition + ' ';
  };

  // If City Is Added In Search Condition
  if (options.city) {
    queryParams.push(`%${options.city}%`);
    addCondition(`city LIKE $${queryParams.length}`);
  }

  // If Owner ID Exists For My Listing
  if (options.owner_id) {
    queryParams.push(options.owner_id);
    addCondition(`owner_id = $${queryParams.length}`);
  }

  // The Minimum Price Per Night In Search Condition
  if (options.minimum_price_per_night) {
    queryParams.push(options.minimum_price_per_night);
    addCondition(`cost_per_night >= $${queryParams.length}`);
  }

  // The Maximum Price Per Night In Search Condition
  if (options.maximum_price_per_night) {
    queryParams.push(options.maximum_price_per_night);
    addCondition(`cost_per_night <= $${queryParams.length}`);
  }

  queryString += `GROUP BY properties.id `;

  // Minimum rating condition
  if (options.minimum_rating) {
    queryParams.push(options.minimum_rating);
    queryString += `HAVING avg(property_reviews.rating) >= $${queryParams.length} `;
  }

  // Tying The SQL Query Together & Placing So Having
  queryParams.push(limit);
  queryString += `ORDER BY cost_per_night LIMIT $${queryParams.length};`;
  
  return pool.query(queryString, queryParams)
    .then((res) => res.rows)
    .catch(err => {
      console.log('SQL error', err.message);
      return Promise.reject(err);
    });
};

/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function(property) {
  const queryString = `INSERT INTO properties (
    title, description, owner_id, cover_photo_url, thumbnail_photo_url, cost_per_night, parking_spaces, number_of_bathrooms, number_of_bedrooms, province, city, country, street, post_code) 
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) RETURNING *;`;

  const queryParams = [property.title, property.description, property.owner_id, property.cover_photo_url, property.thumbnail_photo_url, property.cost_per_night, property.parking_spaces, property.number_of_bathrooms, property.number_of_bedrooms, property.province, property.city, property.country, property.street, property.post_code];

  return pool.query(queryString, queryParams)
    .then((res) => res.rows[0])
    .catch(err => {
      console.log('SQL error', err.message);
      return Promise.reject(err);
    });
};

module.exports = {
  getUserWithEmail,
  getUserWithId,
  addUser,
  getAllReservations,
  getAllProperties,
  addProperty,
};
