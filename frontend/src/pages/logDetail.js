import React from "react";
import NavBar from "../components/NavBar";
import { useNavigate, useParams } from "react-router-dom";
import LogCard from "../components/LogCard";
import "../styles/logdetailpage.css";
import dayjs from "dayjs";
import { useDetailAllTrackingLogQuery } from "../services/api/trackingLog";

function LogDetailPage() {
  const { date } = useParams();
  const navigate = useNavigate();

  const { data: log, isLoading: logLoading } = useDetailAllTrackingLogQuery({
    date,
  });

  return (
    <div className="content-wrapper">
      <div className="log-detail-container">
        <NavBar />
      </div>
      <div className="log-details">
        <h2>Log Details for Date: {date}</h2>
        {logLoading ? (
          <p>Loading...</p>
        ) : (
          <>
            {log ? (
              <LogCard selectedDate={date} log={log} />
            ) : (
              <p>No log entries available for this date.</p>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default LogDetailPage;
