import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import UserContext from "../Usercontext";
import TwolaneApi from "../Api";
import "../forms/form.css";

function PostForm() {
  const { currUser, setCurrUser } = useContext(UserContext);
  const [formData, setFormData] = useState({
    title: "",
    body: "",
    username: currUser.username,
  });
  const navigate = useNavigate();
  const [formErr, setFormErr] = useState([]);

  console.debug(
    "PostForm",
    "currentUser:",
    currUser,
    "formData:",
    formData,
    "formErrors:",
    formErr
  );

  async function handleSubmit(e) {
    e.preventDefault();

    let postData = {
      title: formData.title,
      body: formData.body,
      username: currUser.username,
    };

    try {
      await TwolaneApi.createPost(postData);
      navigate("/posts");
    } catch (err) {
      setFormErr(err);
      return;
    }
  }

  function handleChange(evt) {
    const { name, value } = evt.target;
    setFormData((f) => ({
      ...f,
      [name]: value,
    }));
    setFormErr([]);
  }

  return (
    <div className="form-div">
      <form className="postform">
        <div>
          <label htmlFor="title">Title</label>
          <input
            name="title"
            value={formData.title}
            placeholder="Title"
            required
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="body">Body</label>
          <textarea
            className="body"
            type="text"
            name="body"
            value={formData.body}
            required
            placeholder="Write something!"
            onChange={handleChange}
          />
        </div>
        <button className="submit-btn" onClick={handleSubmit}>
          Post!
        </button>
      </form>
    </div>
  );
}
export default PostForm;
