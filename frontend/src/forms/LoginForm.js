import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./form.css";

function LoginForm({ login }) {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    let result = await login(formData);
    if (result.success) {
      navigate("/");
    } else {
      navigate("/");
      console.error("Error while logging in, Login aborted.");
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
        <button onClick={handleSubmit}>Log in</button>
      </form>
    </>
  );
}

export default LoginForm;
