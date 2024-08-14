import React, { useContext, useState } from "react";
import UserContext from "../Usercontext";
import TwolaneApi from "../Api";
import "../forms/form.css";
import { useNavigate } from "react-router-dom";

function DriveForm() {
  const { currUser, setCurrUser } = useContext(UserContext);
  const [formData, setFormData] = useState({});

  const [formErr, setFormErr] = useState([]);

  console.debug(
    "PostForm",
    "currentUser:",
    currUser,
    "formData:",
    formData,
    "formErrors:",
    formErr
  );

  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    let driveData = {
      title: formData.title,
      description: formData.description,
      route_link: formData.route_link,
    };

    try {
      await TwolaneApi.createDrive(driveData);
      setFormData({ title: "", description: "", route_link: "" });
      navigate("/drives");
    } catch (err) {
      setFormErr(err);
      return;
    }
  }

  function handleChange(evt) {
    const { name, value } = evt.target;
    setFormData((f) => ({
      ...f,
      [name]: value,
    }));
    setFormErr([]);
  }

  return (
    <div className="form-div">
      <form className="driveform">
        <div>
          <label htmlFor="title">Title</label>
          <input
            name="title"
            value={formData.title}
            placeholder="Title"
            required
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="routelink">Route Link:</label>
          <input
            name="route_link"
            value={formData.route_link}
            placeholder="Your google route link"
            required
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="description">Description</label>
          <textarea
            className="drive-form-description"
            name="description"
            value={formData.description}
            required
            placeholder="Describe the trip, the date and time, and any activities that you have planned!"
            onChange={handleChange}
          />
        </div>
        <button className="submit-btn" onClick={handleSubmit}>
          Submit
        </button>
      </form>
    </div>
  );
}
export default DriveForm;
