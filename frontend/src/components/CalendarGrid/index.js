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

  const handleDateClick = (arg) => {
    setSelectedDate(arg.date);
    openModal();
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
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
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        {selectedDate && <LogTable date={selectedDate} />}
      </Modal>
    </div>
  );
}

export default Calendar;
