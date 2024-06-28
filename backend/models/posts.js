const db = require("../db");
const { NotFoundError } = require("../expressError");
const { sqlForPartialUpdate } = require("../helpers/updateSql");

class Post {
  static async getAll() {
    let res = await db.query(
      `SELECT id, title, body, user_id, created_at FROM posts6`
    );

    if (!res) throw new NotFoundError("Unable to retrieve Posts");

    return res.rows;
  }

  static async create(data) {
    const res = await db.query(
      `INSERT INTO posts (title, body, user_id) 
        VALUES ($1, $2, $3) RETURNING title, body, user_id, created_at`,
      [data.title, data.body, data.user_id]
    );

    let post = res.rows[0];

    return post;
  }

  static async remove(data) {
    const res = await db.query(
      `DELETE FROM posts WHERE id = $1 AND user_id = $2 RETURNING title`,
      [data.id, data.userId]
    );

    let deleted = res.rows[0];
    if (!deleted) throw new NotFoundError("Unable to find post to remove");

    return deleted;
  }

  static async update(title, data) {
    const { setCols, values } = sqlForPartialUpdate(data, {
      title: "title",
      body: "body",
    });
    const handleIdx = "$" + (values.length + 1);

    const querySql = `UPDATE posts SET ${setCols} WHERE title = ${handleIdx} RETURNING title, body, created_at`;

    const res = await db.query(querySql, [...values, title]);
    const post = res.rows[0];

    if (!post) throw new NotFoundError(`Post ${title} does not exist.`);

    return post;
  }
}
