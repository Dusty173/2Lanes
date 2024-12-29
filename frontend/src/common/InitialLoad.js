import React from "react";
import "./LoadIcon.css";

/** Loading message used by components that fetch API data. */

function InitLoad() {
  return (
    <>
      <div className="LoadIcon"></div>;
      <div className="LoadText">Please wait as initial load times may take longer than usual!</div>
    </>
  );
}

export default InitLoad;
