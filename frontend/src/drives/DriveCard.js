import React from "react";
import "./DriveCard.css";
import { Link } from "react-router-dom";

function DriveCard({ title, description, created_at, route_link }) {
  let time = created_at;
  let newTime = new Date(time);
  let formattedTime = newTime.toDateString();

  return (
    <>
      <div className="card-body">
        <Link className="drive-card-link" to={`/drives/${title}`}>
          <div>
            <h3 className="drive-card-title">{title}</h3>

            <small className="posted-date">
              Posted: <i>{formattedTime}</i>
            </small>
            <p>{description}</p>
          </div>
        </Link>
      </div>
    </>
  );
}

export default DriveCard;
