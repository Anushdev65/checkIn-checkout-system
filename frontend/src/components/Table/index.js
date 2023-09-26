import { Button, TextareaAutosize } from "@mui/material";

import { useCallback, useEffect, useMemo, useState } from "react";
import dayjs from "dayjs";

import {
  useAddTimeTrackerMutation,
  useEditTimeTrackerMutation,
  useDeleteTimeTrackerMutation,
  useUserCheckInMutation,
  useUserCheckOutMutation,
  useDurationMutation,
  usePauseTimerMutation,
  useResumeTimerMutation,
  usePausedDurationMutation,
  useSaveCheckInTimeQuery,
} from "../../services/api/timeTracking";

import { useSelector } from "react-redux";
import * as React from "react";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import "../../styles/table.css";
import { getUserInfo } from "../../localStorage/localStorage";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

// Caculates the duration between checkIn and checkOut using day
function calculateDuration(checkIn, checkOut) {
  const checkInTime = dayjs(checkIn);
  const checkOutTime = dayjs(checkOut);
  const durationMinutes = checkOutTime.diff(checkInTime, "minutes");
  return durationMinutes;
}

export default function TimeTrackingTable() {
  const { user } = getUserInfo();
  const userId = user?._id;

  const [addRow, setAddRow] = useState({
    checkIn: "",
    checkOut: "",
    pauseTimer: "",
    resumeTimer: "",
    pausedDuration: "",
    duration: "",
    notes: "",
  });

  const [timerPaused, setTimerPaused] = useState(true);
  const [resumeDisabled, setResumeDisabled] = useState(true);

  // Destructuring the API calls
  const [
    addTimeTracker,
    { data: addTimeTrackerData, error: addTimeTrackerError },
  ] = useAddTimeTrackerMutation();

  const [
    editTimeTracker,
    { data: editTimeTrackerData, error: editTimeTrackerError },
  ] = useEditTimeTrackerMutation();

  const [
    deleteTimeTracker,
    { data: deleteTimeTrackerData, error: deleteTimeTrackerError },
  ] = useDeleteTimeTrackerMutation();

  const [userCheckIn, { data: userCheckInData, error: userCheckInError }] =
    useUserCheckInMutation();

  const { data: checkInTimeData, isLoading: checkInLoading } =
    useSaveCheckInTimeQuery(userId);

  console.log(checkInTimeData);
  const [userCheckOut, { data: userCheckOutData, error: userCheckOutError }] =
    useUserCheckOutMutation();

  const [duration, { data: durationData, erorr: durationError }] =
    useDurationMutation();

  const [pauseTimer, { data: pauseTimerData, error: pauseTimerError }] =
    usePauseTimerMutation();

  const [resumeTimer, { data: resumeTimerData, error: resumeTimerError }] =
    useResumeTimerMutation();

  const [
    pausedDuration,
    { data: PausedDurationData, error: pausedDurationError },
  ] = usePausedDurationMutation();

  const currentTime = dayjs();

  const [checkedIn, setCheckedIn] = useState(false);

  useEffect(() => {
    if (checkInLoading) return;

    if (checkInTimeData?.data?.checkInTime?.checkIn) {
      setCheckedIn(true);
      setTimerPaused(false);
    }
  }, [checkInLoading]);

  useEffect(() => {
    if (checkInTimeData && checkInTimeData.checkIn) {
      // If check-in time data exists, update the state only if it's different
      if (addRow.checkIn !== checkInTimeData.checkIn) {
        setAddRow({ ...addRow, checkIn: checkInTimeData.checkIn });
      }
    }
  }, [checkInTimeData]);

  const handleAddTimeTracker = async () => {
    try {
      const requestBody = {};

      const response = await addTimeTracker({ body: requestBody });

      if (response.error) {
        console.error("Add Time Tracker Error", response.error);
      } else {
        console.log("Add Time Tracker successful", response.data);
        // Handle successful addition here
      }
    } catch (error) {
      console.error("Add Time Tracker Error", error);
    }
  };

  const handleEditTimeTracker = async () => {
    try {
      const requestBody = {};

      const response = await editTimeTracker({ body: requestBody });

      if (response.error) {
        console.error("Edit Time Tracker Error", response.error);
      } else {
        console.log("Edit Time Tracker successful", response.data);
        // Handle successful addition here
      }
    } catch (error) {
      console.error("Edit Time Tracker Error", error);
    }
  };

  const handleDeleteTimeTracker = async () => {
    try {
      const requestBody = {};

      const response = await deleteTimeTracker({ body: requestBody });

      if (response.error) {
        console.error("Edit Time Tracker Error", response.error);
      } else {
        console.log("Edit Time Tracker successful", response.data);
        // Handle successful addition here
      }
    } catch (error) {
      console.error("Edit Time Tracker Error", error);
    }
  };

  // handleCheckIn function to implement logic for checkIn button as well as fetching the api inside it.
  const handleCheckIn = async () => {
    try {
      const requestBody = {
        id: userId,
        checkIn: currentTime.format("hh:mm.ssA"),
      };

      // setAddRow({
      //   ...addRow,
      //   checkIn: currentTime.format("hh:mm.ssA"),
      // });

      const response = await userCheckIn({ body: requestBody });

      setCheckedIn(true);
      setTimerPaused(false); // Enable the "Pause Timer" button
      setResumeDisabled(true); // Disable the "Resume Timer" button

      if (response.error) {
        console.error("Check-In Error", response.error);
      } else {
        console.log("Check-In successful", response.data);
        // Handle successful check-in here
      }
    } catch (error) {
      console.error("Check-In Error", error);
    }
  };

  const handleCheckout = async () => {
    try {
      const requestBody = {
        id: userId,
        checkOut: currentTime.format("hh:mm.ss-A"),
      };

      // setAddRow({
      //   ...addRow,
      //   checkOut: currentTime.format("hh:mm.ss-A"),
      // });

      const response = await userCheckOut({ body: requestBody });

      if (response.error) {
        console.error("Error while checking out", response.error);
      } else {
        console.log("sucessfully checkedOut", response.data);
        // Handle successful check-in here
      }
    } catch (error) {
      console.error("Error while checking out", error);
    }
  };

  const handlePauseTimer = async () => {
    try {
      const requestBody = {
        id: userId,
        pauseTimer: currentTime.format("HH:mm:ss A"),
      };

      if (addRow.checkIn && !addRow.pauseTimer) {
        setAddRow({
          ...addRow,
          pauseTimer: currentTime.format("HH:mm:ss A"),
        });
      }
      const response = await pauseTimer({ body: requestBody });

      setTimerPaused(true);
      setResumeDisabled(false);
      if (response.error) {
        console.error("Error while pausing the timer", response.error);
      } else {
        console.log("Sucessfully paused the time", response.data);
      }
    } catch (error) {
      console.error("Error while pausing time ");
    }
  };

  const handleResumeTimer = async () => {
    try {
      const requestBody = {
        id: userId,
        resumeTimer: currentTime.format("hh:mm.ss-A"),
      };

      const response = await resumeTimer({ body: requestBody });
      setTimerPaused(false);
      if (response.error) {
        console.error("Error while resuming time", response.error);
      } else {
        console.log("Successfully resumed time", response.data);

        setAddRow((prevRow) => ({
          ...prevRow,
          pauseTimer: null,
          pausedDuration: 0,
        }));
      }
    } catch (error) {
      console.error("Error while resuming time", error);
    }
  };

  const handlePausedDuration = async () => {
    try {
      const requestBody = {
        // Include the necessary data for calculating paused duration here
      };

      const response = await pausedDuration(requestBody);

      if (response.error) {
        console.error("Error calculating paused duration", response.error);
      } else {
        console.log(
          "Paused duration updated successfully",
          response.data.calculatePausedDuration
          // Update your frontend state with the new paused duration if needed
        );
      }
    } catch (error) {
      console.error("Error calculating paused duration", error);
    }
  };

  return (
    <TableContainer component={Paper} className="custom-table-container">
      <Table sx={{ minWidth: 700 }} aria-label="custom-table">
        <TableHead>
          <TableRow>
            <StyledTableCell align="center" className="custom-table-cell">
              Check-In
            </StyledTableCell>
            <StyledTableCell align="center" className="custom-table-cell">
              Check-Out
            </StyledTableCell>
            <StyledTableCell align="center" className="custom-table-cell">
              Pause Timer
            </StyledTableCell>
            <StyledTableCell align="center" className="custom-table-cell">
              {" "}
              Resume Timer
            </StyledTableCell>
            {/* <StyledTableCell align="center" className="custom-table-cell">
              Paused Duration
            </StyledTableCell> */}
            <StyledTableCell align="center" className="custom-table-cell">
              Worked Hours
            </StyledTableCell>
            <StyledTableCell align="center" className="custom-table-cell">
              Notes
            </StyledTableCell>
            {/* <StyledTableCell align="center" className="custom-table-cell">
              Actions
            </StyledTableCell> */}
          </TableRow>
        </TableHead>
        <TableBody>
          <StyledTableRow>
            <StyledTableCell>
              {checkInLoading ? (
                <>Loading</>
              ) : checkInTimeData.data.checkInTime ? (
                <div>
                  <p> Checked in at: </p>
                  <span className="check-in-time">
                    {checkInTimeData.data.checkInTime?.checkIn}
                  </span>
                </div>
              ) : (
                <Button variant="outlined" onClick={handleCheckIn}>
                  Check-In
                </Button>
              )}
            </StyledTableCell>

            <StyledTableCell align="center">
              {console.log(checkedIn)}

              {!checkedIn || checkInTimeData?.data?.checkInTime?.checkOut ? (
                // addRow.checkOut ? (
                //   addRow.checkOut
                // ) : (
                //   <Button variant="outlined" onClick={handleCheckout}>
                //     Check-Out
                //   </Button>
                // )

                checkInTimeData?.data?.checkInTime?.checkOut
              ) : (
                <Button variant="outlined" onClick={handleCheckout}>
                  Check-Out
                </Button>
              )}
            </StyledTableCell>

            <StyledTableCell align="center">
              {checkInTimeData?.data?.checkInTime?.pauseTimer ? (
                checkInTimeData?.data?.checkInTime?.pauseTimer
              ) : (
                <Button
                  variant="outlined"
                  onClick={handlePauseTimer}
                  disabled={timerPaused}
                >
                  Pause Timer
                </Button>
              )}
            </StyledTableCell>

            <StyledTableCell align="center">
              <Button
                variant="outlined"
                onClick={handleResumeTimer}
                disabled={resumeDisabled}
              >
                Resume Timer
              </Button>
            </StyledTableCell>

            {/* <StyledTableCell align="center">
              {addRow.pausedDuration}
            </StyledTableCell> */}
            <StyledTableCell align="center">
              {addRow.checkIn && addRow.checkOut && durationData ? (
                <p>Total Duration: {durationData.duration}</p>
              ) : (
                ""
              )}
              {durationError && <p>Error: {durationError.message}</p>}
            </StyledTableCell>
            <StyledTableCell align="center">
              <TextareaAutosize
                rowsMin={3}
                value={addRow.notes}
                onChange={(e) =>
                  setAddRow({ ...addRow, notes: e.target.value })
                }
              />
            </StyledTableCell>
          </StyledTableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
}

// export default CustomizedTables;
