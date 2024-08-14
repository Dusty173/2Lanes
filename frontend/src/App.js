import React, { useState, useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import useLocalStorage from "./hooks/useLocalStorage";
import Navigation from "./navbar/Navbar";
import Routes from "./Routes";
import LoadIcon from "./common/LoadIcon";
import TwolaneApi from "./Api";
import UserContext from "./Usercontext";
import jwt from "jsonwebtoken";

export const TOKEN_STORAGE_ID = "twolane-token";

function App() {
  const [loaded, setLoaded] = useState(false);
  const [currUser, setCurrUser] = useState(null);
  const [token, setToken] = useLocalStorage(TOKEN_STORAGE_ID);

  console.debug("App:", "loaded:", loaded, "User:", currUser, "token:", token);

  useEffect(
    function loadUser() {
      console.debug("App useEffect loadUser", "token=", token);

      async function getCurrentUser() {
        if (token) {
          try {
            let { username } = jwt.decode(token);

            TwolaneApi.token = token;

            console.log("APi token:", TwolaneApi.token);

            let currentUser = await TwolaneApi.getCurrentUser(username);
            setCurrUser(currentUser);
            console.log("CURRENT USER:", currentUser);
          } catch (err) {
            console.error("App: loadUser: Problem loading", err);
            setCurrUser(null);
          }
        }
        setLoaded(true);
      }
      setLoaded(false);
      getCurrentUser();
    },
    [token]
  );

  function logout() {
    setCurrUser(null);
    setToken(null);
  }

  async function signup(signupData) {
    try {
      let token = await TwolaneApi.signup(signupData);
      setToken(token);
      return { success: true };
    } catch (err) {
      console.error("Signup failed", err);
      return { success: false, err };
    }
  }

  async function login(loginData) {
    try {
      let token = await TwolaneApi.login(loginData);
      setToken(token);
      return { success: true };
    } catch (err) {
      console.error("Login failed", err);
      return { success: false, err };
    }
  }

  if (!loaded) return <LoadIcon />;

  return (
    <BrowserRouter>
      <UserContext.Provider value={{ currUser, setCurrUser }}>
        <div className="App">
          <Navigation logout={logout} />
          <Routes login={login} signup={signup} />
        </div>
      </UserContext.Provider>
    </BrowserRouter>
  );
}

export default App;
