import React from "react";
import "./Alert.css"
function Alert({ type = "danger", messages = [] }) {
  console.debug("Alert", "type:", type, "messages:", messages);

  return (
    <div className={`alert alert-${type}`} role="alert">
      {messages.map((err) => (
        <p className="user_alert" key={err}>
          {err}
        </p>
      ))}
    </div>
  );
}

export default Alert;
