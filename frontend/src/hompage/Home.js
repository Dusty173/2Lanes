import React, { useContext } from "react";
import UserContext from "../Usercontext";
import "./Home.css";

function Homepage() {
  const { currUser } = useContext(UserContext);
  return (
    <>
      <div className="Home">
        <h1>Two Lanes</h1>
        <p className="app-description">
          <i>A place to organize road trips down two lane back roads!</i>
        </p>
        {currUser ? (
          <h3>
            <i>Welcome back, {currUser.username}!</i>
          </h3>
        ) : (
          <p className="msg">Log in to see more!</p>
        )}
      </div>
    </>
  );
}

export default Homepage;
