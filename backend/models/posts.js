const db = require("../db");
const { NotFoundError } = require("../expressError");
const { sqlForPartialUpdate } = require("../helpers/updateSql");

class Post {
  static async getPosts() {
    let res =
      await db.query(`SELECT id, title, body, user_id, created_at FROM posts \
        ORDER BY created_at DESC`);

    if (!res) throw new NotFoundError("Unable to retrieve Posts");

    return res.rows;
  }

  static async createPost(data) {
    const res = await db.query(
      `INSERT INTO posts (title, body, user_id) 
        VALUES ($1, $2, $3) RETURNING title, body, user_id, created_at`,
      [data.title, data.body, data.user_id]
    );

    let post = res.rows[0];

    return post;
  }

  static async removePost(id, userId) {
    const res = await db.query(
      `DELETE FROM posts WHERE id = $1 AND user_id = $2 RETURNING title`,
      [id, userId]
    );

    let deleted = res.rows[0];
    if (!deleted) throw new NotFoundError("Unable to find post to remove");

    return deleted;
  }
}
