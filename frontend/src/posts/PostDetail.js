import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import TwolaneApi from "../Api";
import LoadIcon from "../common/LoadIcon";
import UserContext from "../Usercontext";
import "./Postdetail.css";

function PostDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { currUser } = useContext(UserContext);
  console.debug("PostDetail", "id:", id);

  const [post, setPost] = useState(null);

  async function handleDelete() {
    await TwolaneApi.removePost(post.id);
    navigate("/posts");
  }

  useEffect(
    function getPostById() {
      async function getPost() {
        let res = await TwolaneApi.getPost(id);
        console.log("RES", res);
        setPost(res[0]);
      }

      getPost();
    },
    [id]
  );

  if (!post) return <LoadIcon />;
  console.log("CurrUser", currUser);
  console.log("PostState", post);

  return (
    <div className="PostDetails">
      <h2 className="post-title">{post.title} </h2>
      <small className="post-by">By: {post.username}</small>
      <p className="post-body">{post.body}</p>
      <br />
      <small className="comment">Cannot comment on posts yet.</small>
      <br />
      {currUser.id === post.user_id || currUser.is_admin ? (
        <button className="delete-btn" onClick={handleDelete}>
          Delete This Post
        </button>
      ) : (
        <span></span>
      )}
    </div>
  );
}

export default PostDetail;
