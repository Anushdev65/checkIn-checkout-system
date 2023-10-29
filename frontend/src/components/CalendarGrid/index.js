import React from "react";
import { useState } from "react";
import Fullcalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import LogTable from "../LogTable";
import Modal from "../Modal";

function Calendar() {
  const [selectedDate, setSelectedDate] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleDateClick = (props) => {
    console.log("here", props);
    setSelectedDate(props.dateStr);
    openModal();
  };

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
      />
      {/* <button onClick={openModal}> Modal</button> */}
      <Modal open={isModalOpen} onClose={closeModal}>
        <LogTable selectedDate={selectedDate} />
      </Modal>
    </div>
  );
}

export default Calendar;
