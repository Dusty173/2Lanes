const db = require("../db");
const bcrypt = require("bcrypt");
const { sqlForPartialUpdate } = require("../helpers/updateSql.js");
const {
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
  ExpressError,
} = require("../expressError");

const { BCRYPT_WORK_FACTOR } = require("../config.js");

class User {
  static async authenticate(username, password) {
    const res = await db.query(
      `SELECT username, hashed_pw, created_at, is_admin FROM users WHERE username = $1`,
      [username]
    );
    const user = res.rows[0];

    if (user) {
      const isValid = await bcrypt.compare(password, user.hashed_pw);
      if (isValid === true) {
        delete user.hashed_pw;
        return user;
      }
    }
    throw new UnauthorizedError("Invalid username or password");
  }

  static async register({ username, password, email, is_admin }) {
    const duplicateCheck = await db.query(
      `SELECT username FROM users WHERE username = $1`,
      [username]
    );
    if (duplicateCheck.rows[0])
      throw new BadRequestError(`Username ${username} already exists.`);

    const hashedPassword = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);

    const res = await db.query(
      `INSERT INTO users (username, hashed_pw, email, is_admin) 
        VALUES ($1, $2, $3) RETURNING username, email, created_at, is_admin`[
        (username, hashedPassword, email, is_admin)
      ]
    );

    const user = res.rows[0];

    return user;
  }

  static async getPosts(username) {
    const userRes = await db.query(
      `SELECT id, username
          FROM users WHERE username = $1`,
      [username]
    );

    const user = userRes.rows[0];
    if (!user) throw new NotFoundError(`No user ${username} exists.`);

    const postRes =
      await db.query(`SELECT p.user_id p.title, p.body, p.created_at FROM posts AS p 
        JOIN users AS u WHERE p.user_id = u.id`);
    
    user.posts = postRes.rows.map(p => p.user_id);
    return user;
  }

  static async getCars(username) {
    const userRes = await db.query(
      `SELECT id, username, email, is_admin 
        FROM users WHERE username = $1`,
      [username]
    );

    const user = userRes.rows[0];

    if (!user) throw new NotFoundError(`No user ${username} exists.`);

    const carsRes = await db.query(
      `SELECT c.owner_id FROM cars AS c JOIN users AS u WHERE c.owner_id = u.id`
    );

    user.cars = carsRes.rows.map((c) => c.id);
    return user;
  }

  static async joinDrive(username, driveId) {
    const precheck = await db.query(`SELECT id FROM drives WHERE id = $1`, [
      driveId,
    ]);
    const drive = precheck.rows[0];

    if (!drive) throw new NotFoundError("Drive does not exist");

    const precheck2 = await db.query(
      "SELECT id FROM users WHERE username = $1",
      [username]
    );
    const user = precheck2.rows[0];

    if (!user) throw new NotFoundError("User not found");

    await db.query(
      `INSERT INTO users_drives (user_id, drive_id) VALUES ($1, $2)`,
      [user, drive]
    );
  }

  static async leaveDrive(username, driveId) {
    const precheck = await db.query(`SELECT id FROM drives WHERE id = $1`, [
      driveId,
    ]);
    const drive = precheck.rows[0];

    if (!drive) throw new NotFoundError("Drive does not exist");

    const precheck2 = await db.query(
      "SELECT id FROM users WHERE username = $1",
      [username]
    );
    const user = precheck2.rows[0];

    if (!user) throw new NotFoundError("User not found");

    await db.query(
      `DELETE FROM users_drives (user_id, drive_id) VALUES ($1, $2)`,
      [user, drive]
    );
  }

  static async updateUser(username, data) {
    if (data.password) {
      data.password = await bcrypt.hash(data.password, BCRYPT_WORK_FACTOR);
    }
    const { setCols, values } = sqlForPartialUpdate(data, {
      username: "username",
      email: "email",
      is_admin: "is_admin",
    });
    const usernameIdx = "$" + (values.length + 1);

    const querySql = `UPDATE users SET ${setCols} WHERE username = ${usernameIdx}
    RETURNING username, email, is_admin`;

    const res = await db.query(querySql, [...values, username]);

    const user = res.rows[0];

    if (!user)
      throw new NotFoundError(`Unable to update profile ${username} 
        because it does not exist`);

    delete user.password;

    return user;
  }

  static async removeUser(username) {
    let res = await db.query(
      `DELETE FROM users WHERE username = $1 RETURNING username`,
      [username]
    );
    const user = res.rows[0];

    if (!user) throw new NotFoundError(`Username ${username} does not exist`);
  }
}

module.exports = User;
