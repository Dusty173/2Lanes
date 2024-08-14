import React, { useState, useContext } from "react";
import UserContext from "../Usercontext";
import TwolaneApi from "../Api";
import "./profileform.css";

function ProfileForm() {
  const { currUser, setCurrUser } = useContext(UserContext);
  console.log("ProfileForm USER:", currUser);
  const [formData, setFormData] = useState({
    email: currUser.email,
    username: currUser.username,
  });

  async function handleSubmit(e) {
    e.preventDefault();

    let profileData = {
      username: formData.username,
      email: formData.email,
    };

    let username = formData.username;
    let updatedUser;

    try {
      updatedUser = await TwolaneApi.saveProfile(username, profileData);
    } catch (err) {
      return;
    }

    setFormData((f) => ({ ...f, password: "" }));

    setCurrUser(updatedUser);
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((f) => ({ ...f, [name]: value }));
  }

  return (
    <>
      <div>
        <h3>{formData.username}</h3>
      </div>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Username</label>
          <input
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>
        <button onClick={handleSubmit}>Save Changes</button>
      </form>
    </>
  );
}

export default ProfileForm;
