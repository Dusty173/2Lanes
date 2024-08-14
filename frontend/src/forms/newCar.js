import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import UserContext from "../Usercontext";

import TwolaneApi from "../Api";

function CarForm() {
  const { currUser } = useContext(UserContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    make: "",
    model: "",
    model_year: "",
  });

  async function handleSubmit(evt) {
    evt.preventDefault();
    let result = await TwolaneApi.addCar(currUser.username, formData);
    if (result) {
      navigate("/cars");
    } else {
      console.log("unable to submit");
    }
  }

  function handleChange(evt) {
    const { name, value } = evt.target;
    setFormData((data) => ({ ...data, [name]: value }));
  }

  return (
    <>
      <div className="add-car-page">
        <h2 className="carform-title">Add a car</h2>
        <div className="carform">
          <form onSubmit={handleSubmit}>
            <label htmlFor="make">Make</label>
            <input
              id="make"
              name="make"
              placeholder="Manufacturer"
              value={formData.make}
              onChange={handleChange}
              required
            />
            <label htmlFor="model">Model</label>
            <input
              id="model"
              name="model"
              value={formData.model}
              onChange={handleChange}
              placeholder="Car name"
              required
            />
            <label htmlFor="model_year">Year</label>
            <input
              id="model_year"
              name="model_year"
              value={formData.model_year}
              onChange={handleChange}
              maxLength={4}
              required
              placeholder="YYYY"
            />
            <button onClick={handleSubmit}>Submit</button>
          </form>
        </div>
      </div>
    </>
  );
}

export default CarForm;
