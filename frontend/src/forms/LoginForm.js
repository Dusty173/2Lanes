import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./form.css";
import Alert from "../common/Alert";

function LoginForm({ login }) {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const navigate = useNavigate();
  const [formErrors, setFormErrors] = useState([]);

  async function handleSubmit(e) {
    e.preventDefault();
    let result = await login(formData);
    if (result.success) {
      navigate("/");
    } else {
      setFormErrors(result.err);
      console.log("ERRORS", result.err);
    }
  }
  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((f) => ({ ...f, [name]: value }));
  }

  console.debug("LoginForm", "login=", typeof login, "formData=", formData);

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Username</label>
          <input
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Username"
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            required
          />
        </div>
        
        {formErrors.length ? (
          <Alert type="danger" messages={formErrors} />
        ) : null}

        <button onClick={handleSubmit}>Log in</button>
      </form>
    </>
  );
}

export default LoginForm;
