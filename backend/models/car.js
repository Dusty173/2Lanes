const db = require("../db");
const { BadRequestError, NotFoundError } = require("../expressError");
const { sqlForPartialUpdate } = require("../helpers/updateSql");

class Car {
  // Get all cars for this user

  static async getAll(username) {
    const userRes = await db.query(`SELECT id FROM users WHERE username = $1`, [
      username,
    ]);
    const userId = userRes.rows[0].id;

    const res = await db.query(
      `SELECT id, make, model, model_year FROM cars WHERE owner_id = $1 ORDER BY model_year DESC`,
      [userId]
    );

    const cars = res.rows;
    if (!cars)
      throw new NotFoundError(`No cars in Garage for ${username} found.`);

    return cars;
  }

  // Get specific car for this user by car Id

  static async getCar(username, carId) {
    const userRes = await db.query(`SELECT id FROM users WHERE username = $1`, [
      username,
    ]);
    const userId = userRes.rows[0].id;

    const carRes = await db.query(
      `SELECT id, owner_id, make, model, model_year FROM cars WHERE 
      owner_id = $1 AND id = $2`,
      [userId, carId]
    );

    const car = carRes.rows[0];
    if (!car) throw new NotFoundError(`Car not found.`);

    return car;
  }

  // Add a car for this user

  static async add({ username, data }) {
    console.log("addfunc:", username, data);
    const ownerRes = await db.query(
      `SELECT id FROM users WHERE username = $1`,
      [username]
    );

    const owner_id = ownerRes.rows[0].id;

    const { make, model, model_year } = data;

    const res = await db.query(
      `INSERT INTO cars (owner_id, make, model, model_year) VALUES ($1, $2, $3, $4) RETURNING make, model, model_year`,
      [owner_id, make, model, model_year]
    );
    let car = res.rows[0];

    return car;
  }

  static async update({ username, carId, data }) {
    // const owner_id = await db.query(
    //   `SELECT id FROM users WHERE username = $1`,
    //   [username]
    // );

    const { setCols, values } = sqlForPartialUpdate(data, {
      make: "make",
      model: "model",
      model_year: "model_year",
    });

    const querySql = `UPDATE cars SET ${setCols} WHERE id = ${carId} 
        RETURNING id, owner_id, make, model, model_year`;

    const res = await db.query(querySql, [...values, carId]);
    const car = res.rows[0];

    if (!car) throw new NotFoundError(`Car does not exist.`);

    return car;
  }

  // remove a car for this user

  static async remove({ username, carId }) {
    const ownerRes = await db.query(
      `SELECT id FROM users WHERE username = $1`,
      [username]
    );

    const owner_id = ownerRes.rows[0].id;

    console.log("owner id:", owner_id);
    console.log("carID:", carId);
    const res = await db.query(
      `DELETE FROM cars WHERE owner_id = $1 AND id = $2 RETURNING *`,
      [owner_id, carId]
    );
    let deleted = res.rows;

    return deleted;
  }
}

module.exports = Car;
