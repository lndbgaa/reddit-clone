import axios from "axios";
import "./App.css";

function App() {
  const createPost = async () => {
    const url = "http://localhost:8080/api/v1/reddit/posts";

    const response = await axios.post(
      url,
      {
        subreddit: "lyhaprivate",
        title: "test",
        kind: "self",
        text: "test test test",
      },
      { withCredentials: true }
    );

    console.log(response);
  };

  const deleteComment = async () => {
    const url = "http://localhost:8080/api/v1/reddit/comments/me67s9c";

    const response = await axios.delete(url, { withCredentials: true });

    console.log(response);
  };

  const deletePost = async () => {
    const url = "http://localhost:8080/api/v1/reddit/posts/1ivkgfh";

    const response = await axios.delete(url, { withCredentials: true });

    console.log(response);
  };

  const commentPost = async () => {
    const url = "http://localhost:8080/api/v1/reddit/comments";

    const response = await axios.post(
      url,
      {
        parent_id: "1ivkgfh",
        parent_type: "post",
        text: "test?",
      },
      { withCredentials: true }
    );

    console.log(response);
  };

  const commentComment = async () => {
    const url = "http://localhost:8080/api/v1/reddit/comments";

    const response = await axios.post(
      url,
      {
        parent_id: "me5wymz",
        parent_type: "comment",
        text: "a comment test of a comment",
      },
      { withCredentials: true }
    );

    console.log(response);
  };

  const updateComment = async () => {
    const url = "http://localhost:8080/api/v1/reddit/comments/me67s9c";

    const response = await axios.patch(
      url,
      {
        text: "test test?",
      },
      { withCredentials: true }
    );

    console.log(response);
  };

  const updatePost = async () => {
    const url = "http://localhost:8080/api/v1/reddit/posts/1ivkgfh";

    const response = await axios.patch(
      url,
      {
        text: "test test test test x4",
      },
      { withCredentials: true }
    );

    console.log(response);
  };

  const savePost = async () => {
    const url = "http://localhost:8080/api/v1/reddit/posts/1ivinzp/save";

    const response = await axios.post(url, {}, { withCredentials: true });

    console.log(response);
  };

  const unsavePost = async () => {
    const url = "http://localhost:8080/api/v1/reddit/posts/1ivinzp/unsave";

    const response = await axios.post(url, {}, { withCredentials: true });

    console.log(response);
  };

  const saveComment = async () => {
    const url = "http://localhost:8080/api/v1/reddit/comments/me66ewy/save";

    const response = await axios.post(url, {}, { withCredentials: true });

    console.log(response);
  };

  const unsaveComment = async () => {
    const url = "http://localhost:8080/api/v1/reddit/comments/me66ewy/unsave";

    const response = await axios.post(url, {}, { withCredentials: true });

    console.log(response);
  };

  return (
    <div>
      <button onClick={createPost}>Create Post</button>
      <button onClick={deleteComment}>Delete Comment</button>
      <button onClick={deletePost}>Delete Post</button>
      <button onClick={commentPost}>Comment On Post</button>
      <button onClick={commentComment}>Comment On Comment</button>
      <button onClick={updateComment}>Edit Comment</button>
      <button onClick={updatePost}>Edit Post</button>
      <button onClick={savePost}>Save Post</button>
      <button onClick={unsavePost}>Unsave Post</button>
      <button onClick={saveComment}>Save Comment</button>
      <button onClick={unsaveComment}>Unsave Comment</button>
    </div>
  );
}

export default App;
