import VoteBtn from "@/components/VoteBtn/VoteBtn";
import axios from "axios";
import { useEffect } from "react";
import "./App.module.css";

function App() {
  useEffect(() => {
    const getCsrfToken = async () => {
      const { data } = await axios.get("http://localhost:8080/api/v1/csrf-token", { withCredentials: true });
      axios.defaults.headers.post["X-CSRF-Token"] = data.csrfToken;
    };

    getCsrfToken();
  }, []);

  return (
    <div>
      <VoteBtn userVote={null} contentType="posts" contentId="1jh7n4k" contentScore={435} />
    </div>
  );
}

export default App;
