const db = require("../db");
const { BadRequestError, NotFoundError } = require("../expressError");
const { sqlForPartialUpdate } = require("../helpers/updateSql");

class Drive {
  /* Create a Drive, update db, return new Drive data
   *
   *  Drive data {title, description, route_link}
   *  returns {title, description, route_link, created_at}
   *
   *  Throws BadRequestError if route_link is already in db
   */
  static async create({ title, description, route_link }) {
    const duplicateCheck = await db.query(
      "SELECT route_link FROM drives WHERE route_link = $1;",
      [route_link]
    );

    if (duplicateCheck.rows[0]) {
      throw new BadRequestError("This route link already exists");
    }

    const res = await db.query(
      `INSERT INTO drives (title, description, route_link, created_at) 
        VALUES ($1, $2, $3, $4) RETURNING title, description, route_link, created_at;`,
      [title, description, route_link, new Date()]
    );
    const drive = res.rows[0];
    return drive;
  }

  /*
   * Return all drives, has optional search filters(title, created_at)
   * will search for titles case-insensitive and partial matches.
   *
   *
   *
   */

  static async getDrives() {
    let query = `SELECT id, title, description, route_link, created_at FROM drives;`;
    const res = await db.query(query);
    return res.rows;
  }

  /*If given title of drive, returns data about said drive.*/

  static async getDrive(title) {
    const res = await db.query(
      `SELECT id, title, description, route_link, created_at FROM drives WHERE title = $1`,
      [title]
    );
    const drive = res.rows[0];

    if (!drive) throw new NotFoundError(`No Drive exists with name: ${title}`);

    return drive;
  }

  /* Updates existing drive, not all fields are required, and only changes provided fields.*/

  static async update(title, data) {
    const { setCols, values } = sqlForPartialUpdate(data, {
      title: "title",
      description: "description",
      route_link: "route_link",
    });
    const handleIdx = "$" + (values.length + 1);

    const querySql = `UPDATE drives SET ${setCols} WHERE title = ${handleIdx} RETURNING id, title, description, route_link, created_at`;
    const res = await db.query(querySql, [...values, title]);
    const drive = res.rows[0];

    if (!drive)
      throw new BadRequestError(`Drive with title ${title} does not exist`);

    return drive;
  }

  // remove a drive

  static async remove(title) {
    const res = await db.query(
      `DELETE FROM drives WHERE title = $1 RETURNING title`,
      [title]
    );
    const remDrive = res.rows[0];

    if (!remDrive)
      throw new NotFoundError(`Drive with title ${title} does not exist.`);
  }

  // Get all data associated with said drive

  static async getParty(title) {
    const res1 = await db.query(`SELECT id FROM drives WHERE title = $1`, [
      title,
    ]);
    const drive_id = res1.rows[0].id;

    // const res2 = db.query(`SELECT id FROM users_drives WHERE drive_id = $1`, [
    //   drive_id,
    // ]);

    // const partyIds = res2.rows;

    const res3 = await db.query(
      `SELECT j.id, j.user_id, j.drive_id, j.car_id, u.username, c.make, c.model, c.model_year 
      FROM users_drives AS j INNER JOIN drives AS d ON d.id = j.drive_id INNER JOIN cars AS c ON c.id = car_id 
      INNER JOIN users AS u ON u.id = user_id WHERE drive_id = $1`,
      [drive_id]
    );

    if (!res3)
      throw new NotFoundError("Unable to find drive with matching parameters");

    const party = res3.rows;

    return party;
  }

  // Logic for users to join a drive

  static async joinDrive(data) {
    const { driveName, user_id, car_id } = data;

    const driveCheck = await db.query(
      `SELECT id FROM drives WHERE title = $1`,
      [driveName]
    );

    const drive_id = driveCheck.rows[0].id;

    await db.query(
      `INSERT INTO users_drives (user_id, drive_id, car_Id) VALUES ($1, $2, $3)`,
      [user_id, drive_id, car_id]
    );
  }

  // Logic for users to leave a drive

  static async leaveDrive(title, data) {
    const { user_id } = data;
    console.log(user_id);
    const precheck = await db.query(`SELECT id FROM drives WHERE title = $1`, [
      title,
    ]);
    const drive = precheck.rows[0].id;

    if (!drive) throw new NotFoundError("Drive does not exist");

    const precheck2 = await db.query(`SELECT id from users WHERE id = $1`, [
      user_id,
    ]);

    const userId = precheck2.rows[0].id;

    if (!userId) throw new NotFoundError("User does not exist");

    await db.query(
      `DELETE FROM users_drives WHERE user_id = $1 AND drive_id = $2`,
      [userId, drive]
    );
  }
}

module.exports = Drive;
