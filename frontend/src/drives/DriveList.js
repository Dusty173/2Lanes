import React, { useState, useEffect, useContext } from "react";
import TwolaneApi from "../Api";
import LoadIcon from "../common/LoadIcon";
import { Link } from "react-router-dom";
import DriveCard from "./DriveCard";
import UserContext from "../Usercontext";
import "./drives.css";

function DrivesList() {
  console.debug("Drive Page");
  const { currUser, setCurrUser } = useContext(UserContext);
  const [drives, setDrives] = useState(null);

  useEffect(function getAllDrivesOnLoad() {
    console.debug("Get Drives on mount");
    loader();
  }, []);

  async function loader() {
    let drives = await TwolaneApi.getDrives();
    setDrives(drives);
  }

  if (!drives) return <LoadIcon />;

  return (
    <>
      {currUser.is_admin ? (
        <Link className="btn" to="/drives/new">
          Create Drive
        </Link>
      ) : (
        <span></span>
      )}

      <div className="drive-list">
        {drives.length ? (
          <div>
            {drives.map((d) => (
              <DriveCard
                title={d.title}
                description={d.description}
                created_at={d.created_at}
                route_link={d.route_link}
              />
            ))}
          </div>
        ) : (
          <p>No results found!</p>
        )}
      </div>
    </>
  );
}
export default DrivesList;
