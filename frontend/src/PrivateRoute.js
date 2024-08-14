import React, { useContext } from "react";
import { Route, useNavigate } from "react-router-dom";
import UserContext from "./Usercontext";

function PrivateRoute({ exact, path, children }) {
  const { currentUser } = useContext(UserContext);
  const Navigate = useNavigate();
  console.debug(
    "PrivateRoute",
    "exact=",
    exact,
    "path=",
    path,
    "currentUser=",
    currentUser
  );

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  return (
    <Route exact={exact} path={path}>
      {children}
    </Route>
  );
}

export default PrivateRoute;
