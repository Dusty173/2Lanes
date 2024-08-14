import React, { useState, useEffect } from "react";
import TwolaneApi from "../Api";
import LoadIcon from "../common/LoadIcon";
import PostCard from "./PostCard";
import { Link } from "react-router-dom";
import "./Posts.css";

function PostsPage() {
  console.debug("Posts Page");

  const [posts, setPosts] = useState(null);

  useEffect(function getAllPostsOnLoad() {
    console.debug("Get Posts on mount");
    loader();
  }, []);

  async function loader() {
    let posts = await TwolaneApi.getAllPosts();
    setPosts(posts);
  }

  console.log("POST RES", posts);
  if (!posts) return <LoadIcon />;

  return (
    <>
      <Link className="btn" to="/posts/new">
        Add Post
      </Link>
      <div className="post-list">
        {posts.length ? (
          <div>
            {posts.map((p) => (
              <PostCard
                id={p.id}
                title={p.title}
                body={p.body}
                created_at={p.created_at}
                username={p.username}
              />
            ))}
          </div>
        ) : (
          <h2 className="no-res">No results found!</h2>
        )}
      </div>
    </>
  );
}
export default PostsPage;
