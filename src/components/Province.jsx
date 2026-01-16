import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function Province() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loggedUser = JSON.parse(localStorage.getItem("loggedInUser"));
    if (!loggedUser) {
      navigate("/login");
      return;
    }
    setUser(loggedUser);
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Province {id}</h1>
      <p>Welcome, {user?.name}</p>
      <button onClick={() => navigate("/dashboard")}>Back to Dashboard</button>
    </div>
  );
}

export default Province;
