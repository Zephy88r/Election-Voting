import React from "react";
import { useNavigate } from "react-router-dom";

function ProvinceCard({ name, img, path, isLoggedIn }) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (!isLoggedIn) {
      alert("Sign in to access this province");
      return;
    }
    navigate(path);
  };

  return (
    <div className={`province-card ${!isLoggedIn ? "disabled" : ""}`} onClick={handleClick}>
      <img src={img} alt={name} />
      <div className="province-overlay">
        <h2>{name}</h2>
      </div>
    </div>
  );
}

export default ProvinceCard;
