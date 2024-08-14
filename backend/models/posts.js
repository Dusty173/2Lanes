const db = require("../db");
const { NotFoundError } = require("../expressError");
const { sqlForPartialUpdate } = require("../helpers/updateSql");

class Post {

  // Get a list of posts ordered by the latest date.

  static async getAll() {
    let res = await db.query(
      `SELECT p.id, p.title, p.body, p.user_id, p.created_at, u.username 
      FROM posts AS p LEFT JOIN users AS u ON p.user_id = u.id 
      ORDER BY p.created_at DESC `
    );
    if (!res) throw new NotFoundError("Unable to retrieve Posts");

    return res.rows;
  }

  // Get a certain post by id

  static async get(id) {
    let res = await db.query(
      `SELECT p.id, p.title, p.body, p.user_id, p.created_at, u.username FROM posts AS p 
      INNER JOIN users AS u ON p.user_id = u.id WHERE p.id = $1`,
      [id]
    );

    if (!res) throw new NotFoundError("Unable to retrieve Posts");

    return res.rows;
  }

  // Create a post and save to db

  static async create(data) {
    const { title, body, username } = data;

    const userRes = await db.query(`SELECT id FROM users WHERE username = $1`, [
      username,
    ]);

    const user_id = userRes.rows[0].id;

    const res = await db.query(
      `INSERT INTO posts (title, body, user_id, created_at) 
        VALUES ($1, $2, $3, $4) RETURNING title, body, user_id, created_at`,
      [title, body, user_id, new Date()]
    );

    let post = res.rows[0];

    return post;
  }

  // Remove this post from the database

  static async remove(id) {
    const res = await db.query(
      `DELETE FROM posts WHERE id = $1 RETURNING title`,
      [id]
    );

    let deleted = res.rows[0];
    if (!deleted) throw new NotFoundError("Unable to find post to remove");

    return deleted;
  }

  // Update a post

  static async update(id, data) {
    const { setCols, values } = sqlForPartialUpdate(data, {
      title: "title",
      body: "body",
    });
    const handleIdx = "$" + (values.length + 1);

    const querySql = `UPDATE posts SET ${setCols} WHERE id = ${handleIdx} RETURNING title, body, created_at`;

    const res = await db.query(querySql, [...values, id]);
    const post = res.rows[0];

    if (!post) throw new NotFoundError(`Post ${id} does not exist.`);

    return post;
  }
}
module.exports = Post;
