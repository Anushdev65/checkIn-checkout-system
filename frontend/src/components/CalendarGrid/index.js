import React from "react";
import { useState } from "react";
import Fullcalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import LogTable from "../LogTable";
import Modal from "../Modal";
import { useNavigate } from "react-router-dom";
import LogCard from "../LogCard";
function Calendar() {
  const [selectedDate, setSelectedDate] = useState(null);
  // const [isLogCardVisible, setIsLogCardVisible] = useState(false);

  const navigate = useNavigate();
  // const [isModalOpen, setIsModalOpen] = useState(false);

  // const openModal = () => {
  //   setIsModalOpen(true);
  // };

  // const closeModal = () => {
  //   setIsModalOpen(false);
  // };

  const handleDateClick = (props) => {
    const formattedDate = props.dateStr;
    navigate(`/log/${formattedDate}`);
    // setIsLogCardVisible(true);
    // openModal();
    // return <LogEntryCreator date={formattedDate} />;
  };

  const today = new Date().toISOString().slice(0, 10);
  //today's date in the format "YYYY-MM-DD"

  const eventSources = [
    {
      events: [
        {
          title: "Today's Log",
          start: today,
          backgroundColor: "red",
          textColor: "white",
        },
      ],
    },
  ];

  return (
    <div>
      <Fullcalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView={"dayGridMonth"}
        headerToolbar={{
          start: "today prev,next",
          center: "title",
          end: "dayGridMonth, timeGridWeek, timeGridDay",
        }}
        height={"90vh"}
        dateClick={handleDateClick}
        eventSources={eventSources} // Add the event source to display the event on today's date
      />
      {/* {isLogCardVisible && <LogCard selectedDate={selectedDate} />} */}
    </div>
  );
}

export default Calendar;
