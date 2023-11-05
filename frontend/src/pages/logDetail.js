import React from "react";
import NavBar from "../components/NavBar";
import { useParams } from "react-router-dom";
import LogCard from "../components/LogCard";
import "../styles/logdetailpage.css";
function LogDetailPage() {
  const { date } = useParams();

  return (
    <div className="content-wrapper">
      <div className="log-detail-container">
        <NavBar />
      </div>
      <div className="log-details">
        <h2>Log Details for Date: {date}</h2>
        <LogCard />
      </div>
    </div>
  );
}

export default LogDetailPage;
