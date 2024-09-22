import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./form.css";
import Alert from "../common/Alert";

function SignupForm({ signup }) {
  const navigate = useNavigate();
  const [formErrors, setFormErrors] = useState([]);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
  });

  async function handleSubmit(evt) {
    evt.preventDefault();
    let result = await signup(formData);
    if (result.success) {
      navigate("/drives");
    } else {
      setFormErrors(result.err);
    }
  }

  function handleChange(evt) {
    const { name, value } = evt.target;
    setFormData((data) => ({ ...data, [name]: value }));
  }

  return (
    <>
      <div className="signup-page">
        <h2 className="sign-up-title">Sign Up!</h2>
        <div className="signupform">
          <form onSubmit={handleSubmit}>
            <label htmlFor="username">Username</label>
            <input
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
            />
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
            />

            {formErrors.length ? (
              <Alert type="danger" messages={formErrors} />
            ) : null}

            <button onClick={handleSubmit}>Sign Up!</button>
          </form>
        </div>
      </div>
    </>
  );
}

export default SignupForm;
