import React from "react";
import { Routes, Route, useNavigate, Outlet } from "react-router-dom";
import Homepage from "./hompage/Home";
import PostsPage from "./posts/PostsPage";
import LoginForm from "./forms/LoginForm";
import SignupForm from "./forms/Signupform";
import ProfileForm from "./forms/ProfileForm";
import PostForm from "./posts/AddPost";
import DrivesList from "./drives/DriveList";
import DriveForm from "./drives/AddDriveForm";
import UserProfile from "./Profile";
import MyGarage from "./cars/mygarage";
import CarForm from "./forms/newCar";
import PostDetail from "./posts/PostDetail";
import DriveDetail from "./drives/DriveDetails";

function Routing({ login, signup }) {
  const Navigate = useNavigate();

  const PrivateRoutes = () => {
    let auth = { token: true };
    return auth.token ? <Outlet /> : <Navigate to="/login" />;
  };

  console.debug(
    "Routes",
    `login: ${typeof login}`,
    `register: ${typeof signup}`
  );

  return (
    <>
      <Routes>
        <Route path="/" element={<Homepage />}></Route>

        <Route path="/login" element={<LoginForm login={login} />}></Route>

        <Route path="/signup" element={<SignupForm signup={signup} />}></Route>

        <Route element={<PrivateRoutes />}>
          <Route path="/posts" element={<PostsPage />} />
          <Route path="/posts/:id" element={<PostDetail />} />
          <Route path="/posts/new" element={<PostForm />} />
          <Route path="/users" element={<UserProfile />} />
          <Route path="/users/edit" element={<ProfileForm />} />
          <Route path="/drives" element={<DrivesList />} />
          <Route path="/drives/new" element={<DriveForm />} />
          <Route path="/drives/:title" element={<DriveDetail />} />
          <Route path="/cars" element={<MyGarage />} />
          <Route path="/cars/new" element={<CarForm />} />
          <Route path="/drives/:title/join" element={<DriveDetail />} />
          <Route path="/drives/:title/leave" element={<DriveDetail />} />
        </Route>
      </Routes>
    </>
  );
}

export default Routing;
