import axios from "axios";
import "./App.css";

function App() {
  const handleVote = async (id: string, voteDirection: "1" | "-1" | "0") => {
    const url = `http://localhost:8080/api/v1/reddit/posts/${id}/vote`;

    const response = await axios.post(
      url,
      {
        voteDirection: voteDirection,
      },
      { withCredentials: true }
    );

    console.log(response);
  };

  return (
    <div>
      <button onClick={() => handleVote("1iof06l", "1")}>Vote</button>
    </div>
  );
}

export default App;
