import React from "react";
import "../../styles/clock.css";

function Clock() {
  // Using React state to store the current time
  const [time, setTime] = React.useState(new Date());

  // Update the time every second
  React.useEffect(() => {
    const intervalId = setInterval(() => {
      setTime(new Date());
    }, 1000);

    // Clear the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="clock-container">
      <p className="time-style">{time.toLocaleTimeString()}</p>
    </div>
  );
}

export default Clock;
