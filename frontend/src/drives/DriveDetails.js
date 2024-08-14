import React, { useContext, useEffect, useState } from "react";
import UserContext from "../Usercontext";
import "./DriveDetail.css";
import TwolaneApi from "../Api";
import { useParams, useNavigate, json } from "react-router-dom";
import LoadIcon from "../common/LoadIcon";

function DriveDetail() {
  const navigate = useNavigate();
  const [drive, setDrive] = useState(null);
  const { currUser, setCurrUser } = useContext(UserContext);
  const { title } = useParams();
  const [formErr, setFormErr] = useState(null);
  const [formData, setFormData] = useState({
    user_id: currUser.id,
    driveName: title,
    car_id: null,
  });

  useEffect(
    function getDriveByTitle() {
      async function getDriveData() {
        const driveRes = await TwolaneApi.getDrive(title);
        const carsRes = await TwolaneApi.getCars(currUser.username);
        const partyRes = await TwolaneApi.getParticipants(title);
        return Promise.all([driveRes, carsRes, partyRes]);
      }

      getDriveData().then((data) => {
        setDrive(data);
      });
    },
    [title, currUser.username]
  );

  function handleChange(evt) {
    const { name, value } = evt.target;
    setFormData((f) => ({
      ...f,
      [name]: value,
    }));
  }

  async function handleLeave(evt) {
    try {
      await TwolaneApi.leaveDrive(title, { user_id: currUser.id });
      navigate(`/drives/${title}`);
    } catch (err) {
      console.log(err);
    }
  }

  async function handleSubmit(evt) {
    evt.preventDefault();

    const driveData = {
      user_id: currUser.id,
      driveName: title,
      car_id: formData.car_id,
    };
    try {
      await TwolaneApi.joinDrive(title, driveData);
      navigate(`/drives/${title}`);
    } catch (err) {
      setFormErr(err);
      return;
    }
  }

  if (!drive) return <LoadIcon />;

  async function handleDelete() {
    await TwolaneApi.deleteDrive(title);
    navigate("/drives");
  }

  let time = drive[0].created_at;
  let newTime = new Date(time);
  let formattedTime = newTime.toDateString();

  console.log("DRIVE-STATE:", drive);
  console.log("FORM", formData);

  const onDrive = () => {
    const user = currUser.username;
    const data = drive[2].find((p) => p.username === user);
    return data ? true : false;
  };

  return (
    <>
      <div>
        <h2 className="drive-title">{drive[0].title}</h2>
        <small className="time">Posted: {formattedTime}</small>
        <div>
          <p className="drive-description">{drive[0].description}</p>
          <p className="route-link">
            <a target="blank" className="btn" href={drive[0].route_link}>
              Get Route
            </a>
          </p>
        </div>
        <div>
          <div className="people-list">
            <h3 className="people-title">People on this Drive:</h3>
            <ul>
              {drive[2].map((u) => (
                <li className="person" key={u.username}>
                  {u.username} is going with their {u.model_year} {u.make}{" "}
                  {u.model}!
                </li>
              ))}
            </ul>
          </div>
          {onDrive() ? (
            <button className="leave-btn" onClick={handleLeave}>
              Leave Drive
            </button>
          ) : (
            <form onSubmit={handleSubmit} className="join-form">
              <p className="join-form-title">
                Join this drive! (as {currUser.username})
              </p>
              <select
                name="car_id"
                className="car-select"
                onChange={handleChange}
              >
                <option
                  onChange={handleChange}
                  value=""
                  defaultValue
                  disable="true"
                  hidden
                >
                  Select your Car
                </option>
                {drive[1].map((car) => (
                  <option key={car.id} value={car.id} className="car-opts">
                    {car.model_year} {car.make} {car.model}
                  </option>
                ))}
              </select>
              <button className="submit-btn">Join!</button>
            </form>
          )}
        </div>
        {currUser.is_admin ? (
          <>
            <button className="delete-drive-btn" onClick={handleDelete}>
              Delete this drive
            </button>
            <small className="warn">Cannot be undone!!</small>
          </>
        ) : (
          <></>
        )}
      </div>
    </>
  );
}

export default DriveDetail;
