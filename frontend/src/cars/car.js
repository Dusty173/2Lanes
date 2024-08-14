import React, { useContext } from "react";
import TwolaneApi from "../Api";
import UserContext from "../Usercontext";
import { useNavigate } from "react-router-dom";
import "./cars.css";

function Car({ id, make, model, model_year }) {
  const navigate = useNavigate();
  const { currUser, setCurrUser } = useContext(UserContext);

  async function handleRemove() {
    await TwolaneApi.removeCar(currUser.username, id);
    navigate("/cars");
  }

  return (
    <div  className="car-card">
      <ul  className="car">
        <li className="year">{model_year}</li>
        <li className="make">{make}</li>
        <li className="model">{model}</li>
      </ul>
      <button className="remove-btn" onClick={handleRemove}>Remove</button>
    </div>
  );
}

export default Car;
