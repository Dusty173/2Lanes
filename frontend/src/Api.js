import axios from "axios";

const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:3001";

/** API Class.
 *
 * Static class tying together methods used to get/send to to the API.
 */

class TwolaneApi {
  static token;

  static async request(endpoint, data = {}, method = "get") {
    console.debug("API call:", endpoint, data, method);

    const url = `${BASE_URL}/${endpoint}`;
    const headers = { Authorization: `Bearer ${TwolaneApi.token}` };
    const params = method === "get" ? data : {};

    try {
      return (await axios({ url, method, data, params, headers })).data;
    } catch (err) {
      console.error("Api Error:", err.response);
      let message = err.response.data.error.message;
      throw Array.isArray(message) ? message : [message];
    }
  }

  // User related requests

  static async getCurrentUser(username) {
    let res = await this.request(`users/${username}`);
    return res.user;
  }

  static async login(data) {
    let res = await this.request(`auth/token`, data, "post");
    return res.token;
  }

  static async signup(data) {
    let res = await this.request(`auth/register`, data, "post");
    return res.token;
  }

  static async removeUser(username) {
    let res = await this.request(`users/${username}`, "", "delete");
    return res.deleted;
  }

  static async saveProfile(username, data) {
    let res = await this.request(`users/${username}`, data, "patch");
    return res.user;
  }

  // User-Cars Requests

  static async getCars(username) {
    let res = await this.request(`cars/${username}`);
    return res.cars;
  }

  static async getSingleCar(username, carId) {
    let res = await this.request(`cars/${username}/${carId}`);
    return res.car;
  }

  static async addCar(username, data) {
    let res = await this.request(`cars/${username}/new`, data, "post");
    return res.car;
  }

  static async removeCar(username, carId) {
    let res = await this.request(
      `cars/${username}/${carId}`,
      { username, carId },
      "delete"
    );

    return res.deleted;
  }

  // User-Posts requests

  static async getAllPosts() {
    let res = await this.request(`posts`);
    return res.posts;
  }

  static async getPost(id) {
    let res = await this.request(`posts/${id}`);
    return res.post;
  }

  static async createPost(data) {
    let res = await this.request(`posts/new`, data, "post");
    return res.post;
  }

  static async removePost(id) {
    let res = await this.request(`posts/${id}`, "", "delete");
    return res.deleted;
  }

  static async editPost(id) {
    let res = await this.request(`posts/${id}`, "", "patch");
    return res.post;
  }

  // Drive requests

  static async getDrives(data) {
    let res = await this.request(`drives`);
    return res.drives;
  }

  static async getParticipants(title) {
    let res = await this.request(`drives/${title}/party`);
    return res.party;
  }

  static async getDrive(title) {
    let res = await this.request(`drives/${title}`);
    return res.drive;
  }

  static async createDrive(data) {
    let res = await this.request("drives", data, "post");
    return res.drive;
  }

  static async updateDrive(title) {
    let res = await this.request(`drives/${title}`, "", "patch");
    return res.drive;
  }

  static async deleteDrive(title) {
    let res = await this.request(`drives/${title}`, "", "delete");
    return res.deleted;
  }

  static async joinDrive(title, data) {
    let res = await this.request(`drives/${title}/join`, data, "post");
    return res.joined;
  }

  static async leaveDrive(title, data) {
    let res = await this.request(`drives/${title}/leave`, data, "delete");
    return res.deleted;
  }
}
export default TwolaneApi;
