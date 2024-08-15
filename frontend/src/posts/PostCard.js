import React from "react";
import { Link } from "react-router-dom";

import "./PostCard.css";

function PostCard({ id, title, body, created_at, username }) {
  console.debug("PostCard", username, id, title, created_at);

  let time = created_at;
  let newTime = new Date(time);
  let formattedTime = newTime.toLocaleString();

  return (
    <Link className="post-card-link" to={`/posts/${id}`}>
      <div className="post-card-body">
        <h4 className="post-card-title">{title}</h4>
        <small className="post-card-date">
          Posted: <i>{formattedTime}</i>
        </small>
        <small className="post-author">Author: {username}</small>
        <p className="post-content">{body}</p>
      </div>
    </Link>
  );
}

export default PostCard;
