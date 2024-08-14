import React, { useContext, useEffect, useState } from "react";
import UserContext from "./Usercontext";
import { Link } from "react-router-dom";
import "./profile.css";

function UserProfile() {
  const { currUser, setCurrUser } = useContext(UserContext);

  return (
    <>
      <Link className="btn" to="/users/edit">
        Edit profile
      </Link>
      <div className="Profile">
        <h2 className="username">{currUser.username}</h2>
      </div>
      <div>
        <ul className="userdata">
          <li>{currUser.email}</li>
          <li>
            Administrator status:
            <div className="admin-status">
              {currUser.is_admin ? " You are an admin" : " Not an admin."}
            </div>
          </li>
        </ul>
      </div>
    </>
  );
}

export default UserProfile;
