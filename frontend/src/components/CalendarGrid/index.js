import React from "react";
import { useState, useEffect } from "react";
import Fullcalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import LogTable from "../LogTable";
import Modal from "../Modal";
import { useNavigate } from "react-router-dom";
import LogCard from "../LogCard";
import "../../styles/calendar.css";
import { useDetailAllTrackingLogQuery } from "../../services/api/trackingLog";
import dayjs from "dayjs";

// function Calendar() {
//   const [selectedDate, setSelectedDate] = useState(null);

//   const navigate = useNavigate();
//   const { data: log, isLoading: logsLoading } = useDetailAllTrackingLogQuery({
//     date: selectedDate,
//   });
//   console.log(log);

//   const handleDateClick = (props) => {
//     const formattedDate = dayjs(props.dateStr).format("YYYY-MM-DD");
//     setSelectedDate(formattedDate);
//     navigate(`/log/${formattedDate}`);
//   };

//   // const { data: log, isLoading: logsLoading } = useDetailAllTrackingLogQuery({
//   //   date: selectedDate,
//   // });
//   // console.log(log);
//   // const eventSources = [
//   //   {
//   //     events: [
//   //       {
//   //         title: log?.data?.results[0].timeTracker.title,
//   //         start: log?.data?.results[0].date,
//   //         backgroundColor: "red",
//   //         textColor: "white",
//   //       },
//   //     ],
//   //   },
//   // ];

//   const eventSources = log?.data.results.map((entry) => ({
//     title: entry.timeTracker.title,
//     start: entry.date, // Use the date from each log entry
//     backgroundColor: "red",
//     textColor: "white",
//   }));

//   const eventContent = function (arg) {
//     const title = `Title: ${arg.event.title}`;
//     const date = arg.event.start.toISOString().slice(0, 10); // Format the date

//     return (
//       <div
//         className="event-container"
//         style={{
//           backgroundColor: arg.event.backgroundColor,
//           color: arg.event.textColor,
//         }}
//       >
//         <div className="event-title">{title}</div>
//         <div className="event-date">{date}</div>
//       </div>
//     );
//   };

//   return (
//     <div>
//       <Fullcalendar
//         plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
//         initialView={"dayGridMonth"}
//         headerToolbar={{
//           start: "today prev,next",
//           center: "title",
//           end: "dayGridMonth, timeGridWeek, timeGridDay",
//         }}
//         height={"90vh"}
//         dateClick={handleDateClick}
//         eventSources={eventSources}
//         eventContent={eventContent} // Add the event source to display the event on today's date
//       />
//     </div>
//   );
// }

function Calendar() {
  const [selectedDate, setSelectedDate] = useState(null);
  const navigate = useNavigate();
  const { data: log, isLoading: logsLoading } = useDetailAllTrackingLogQuery({
    date: selectedDate,
  });

  useEffect(() => {
    if (log && log.data.results.length > 0) {
      // Create an array of events from your log data
      const events = log.data.results.map((entry) => ({
        title: entry.timeTracker.title,
        start: entry.date,
        backgroundColor: "red",
        textColor: "white",
      }));
      // Set the events for the calendar
      setCalendarEvents(events);
    }
  }, [log]);

  const [calendarEvents, setCalendarEvents] = useState([]);

  const handleDateClick = (props) => {
    const formattedDate = dayjs(props.dateStr).format("YYYY-MM-DD");
    setSelectedDate(formattedDate);
    navigate(`/log/${formattedDate}`);
  };

  const eventContent = function (arg) {
    const title = `Title: ${arg.event.title}`;
    const date = arg.event.start.toISOString().slice(0, 10);

    return (
      <div
        className="event-container"
        style={{
          backgroundColor: arg.event.backgroundColor,
          color: arg.event.textColor,
        }}
      >
        <div className="event-title">{title}</div>
        <div className="event-date">{date}</div>
      </div>
    );
  };
  const calendarOptions = {
    themeSystem: "bootstrap", // Change the theme to Bootstrap
    eventBorderColor: "green", // Set the border color of events
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
        events={calendarEvents} // Use events property to specify the events
        eventContent={eventContent}
        {...calendarOptions}
      />
    </div>
  );
}

export default Calendar;
