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
  useNotesMutation,
  useSaveCheckInTimeQuery,
} from "../../services/api/timeTracking";

import * as React from "react";
import { styled } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

import Paper from "@mui/material/Paper";
import "../../styles/table.css";
import { getUserInfo } from "../../localStorage/localStorage";
import PauseTimerDialog from "../Dialog";
import CheckInPop from "../PopupModal";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useQueryClient } from "react-query";

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

  const [addNotes, { data, isSucess, error, isLoading }] = useNotesMutation();

  const [
    pausedDuration,
    { data: PausedDurationData, error: pausedDurationError },
  ] = usePausedDurationMutation();

  const currentTime = dayjs();

  const [checkedIn, setCheckedIn] = useState(false);

  const [isPauseDialogOpen, setIsPauseDialogOpen] = useState(false);

  const [pauseReason, setPauseReason] = useState("");

  const [noteText, setNoteText] = useState("");

  const [isPauseButtonVisible, setIsPauseButtonVisible] = useState(true);

  const [workedHours, setWorkedHours] = useState("");

  // State variable to manage the modal's visibility
  const [checkInModalOpen, setCheckInModalOpen] = useState(false);

  //function to handle openning the Check-In modal
  const openCheckInModal = () => {
    setCheckInModalOpen(true);
  };

  // Function to handle closing the Check-In modal
  const closeCheckInModal = () => {
    setCheckInModalOpen(false);
  };

  useEffect(() => {
    if (
      checkInTimeData?.data?.checkInTime?.checkIn &&
      checkInTimeData?.data?.checkInTime?.checkOut
    ) {
      // Calculating the duration between checkIn and checkOut
      const durationMinutes = calculateDuration(
        checkInTimeData?.data?.checkInTime?.checkIn,
        checkInTimeData?.data?.checkInTime?.checkOut
      );

      const formattedHours = Math.floor(durationMinutes / 60)
        .toString()
        .padStart(2, "0");
      const formattedMinutes = (durationMinutes % 60)
        .toString()
        .padStart(2, "0");

      setWorkedHours(`${formattedHours} : ${formattedMinutes} minutes`);
    }
  }, [checkInTimeData, checkInTimeData?.data?.checkInTime?.checkOut]);

  const openPauseDialog = () => {
    setIsPauseDialogOpen(true);
  };

  const closePauseDialog = () => {
    setIsPauseDialogOpen(false);
    setPauseReason("");
  };

  useEffect(() => {
    // if (checkInLoading) return;

    if (checkInTimeData?.data?.checkInTime?.checkIn) {
      setCheckedIn(true);
    }
    if (checkInTimeData?.data?.checkInTime?.pauseTimers?.length > 0) {
      setTimerPaused(true);
    } else {
      setTimerPaused(false);
    }
  }, [checkInTimeData]);

  // function to enable and disable the checkOut button according to plannedWorkingHours
  const disableByPlannedHours = () => {
    if (!checkInTimeData?.data?.checkInTime?.checkIn) {
      // Disable the button if there is no check-in
      return true;
    }

    if (checkInTimeData?.data?.checkInTime?.plannedWorkingHours) {
      const plannedHours = checkInTimeData.data.checkInTime.plannedWorkingHours;
      const checkInTime = checkInTimeData.data.checkInTime.checkIn;
      const currentTime = new Date();

      // Calculate the time difference between check-in and the current time
      const timeDifference = currentTime - new Date(checkInTime);

      // Convert time difference from milliseconds to minutes
      const timeDifferenceInMinutes = timeDifference / (1000 * 60);

      // Disable the button if the time difference is less than planned hours
      return timeDifferenceInMinutes < plannedHours * 60;
    }

    // Enable the button by default if the conditions are not met
    return false;
  };

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

  // handleCheckIn function to implement logic after user checks in
  const handleCheckIn = async () => {
    try {
      //  calculating the timeStamp when the planned working hours will end

      const plannedWorkingHours =
        checkInTimeData?.data?.checkInTime?.plannedWorkingHours || 0;
      const plannedWorkingMilliseconds = plannedWorkingHours * 60 * 60 * 1000;
      const plannedWorkingEndTime =
        new Date().getTime() + plannedWorkingMilliseconds;

      // Setting up a timer to check remaining time

      const checkRemainingTime = () => {
        const currentTime = new Date().getTime();
        const remainingTime = plannedWorkingEndTime - currentTime;

        if (remainingTime < 5 * 60 * 1000) {
          // Displaying an alert when there are 5 minutes or less left
          toast.warning("You have 5 miutes left of your planned working hours");
        }
      };
      const timer = setInterval(checkRemainingTime, 1000);

      setCheckedIn(true);

      openCheckInModal();

      // clears the timer when the component unmounts
      return () => clearInterval(timer);
    } catch (error) {
      console.error("Check-in Error", error);
    }
  };

  const handleCheckout = async () => {
    try {
      const requestBody = {
        id: userId,
        checkOut: currentTime.format("hh:mm.ss-A"),
      };

      const response = await userCheckOut({ body: requestBody });

      if (response.error) {
        console.error("Error while checking out", response.error);
      } else {
        console.log("sucessfully checkedOut", response.data);
      }
      // CreateLogEntry(new Date());
    } catch (error) {
      console.error("Error while checking out", error);
    }
  };

  const handlePauseTimer = async () => {
    openPauseDialog();
  };

  const handleReasonSubmit = async () => {
    try {
      const requestBody = {
        timeTrackingId: checkInTimeData?.data?.checkInTime?._id,
        reason: pauseReason,
      };
      // console.log("Reason submitted: ", reason);

      const response = await pauseTimer({ body: requestBody });

      if (response.error) {
        console.log("Error with the reason ", response.error);
      } else {
        console.log("Sucessfull added the reason", response.data);
        setTimerPaused(true);
      }

      setIsPauseButtonVisible(true);

      // setResumeDisabled(false);
      closePauseDialog();
    } catch (error) {
      console.error("Error while pausing time", error);
    }
  };

  const handleResumeTimer = async () => {
    try {
      const requestBody = {
        timeTrackingId: checkInTimeData?.data?.checkInTime?._id,
        resumeTimer: currentTime.format("hh:mm.ss-A"),
      };

      const response = await resumeTimer({ body: requestBody });
      // setTimerPaused(false);
      if (response.error) {
        console.error("Error while resuming time", response.error);
      } else {
        console.log("Successfully resumed time", response.data);
      }
    } catch (error) {
      console.error("Error while resuming time", error);
    }
  };

  const handleAddNotes = async () => {
    try {
      const requestBody = {
        timeTrackingId: checkInTimeData?.data?.checkInTime?._id,
        notes: noteText,
      };
      //
      const response = await addNotes({ body: requestBody });

      if (response.error) {
        console.error("Add Notes Error", response.error);
      } else {
        console.log("Notes added sucessfully", response.data);
        setNoteText("");
      }
    } catch (error) {
      console.error("Error while adding notes", error);

      // setAddRow({ ...addRow, notes: "" });
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

  // useEffect(() => {
  //   startRefreshInterval();
  // }, []);

  // Time threshold for resetting the table
  const resetTimeThreshold = 10000;
  // State variable to store the elapsed time
  const [elapsedTime, setElapsedTime] = useState(0);

  // Function to calculate the elapsed time based on check-out time
  const calculateElapsedTime = (checkOutTime) => {
    if (checkOutTime) {
      const lastCheckOutTime = new Date(checkOutTime);
      const currentTime = new Date();
      const elapsedTime = currentTime - lastCheckOutTime;
      console.log("Elapsed time:", elapsedTime);
      return elapsedTime;
    }
    return 0;
  };

  useEffect(() => {
    // Calculate elapsed time and update the state based on check-out time in checkInTimeData
    const checkOutTime = checkInTimeData?.data?.checkInTime?.checkOut;
    const elapsed = calculateElapsedTime(checkOutTime);
    console.log("Elapsed time (useEffect):", elapsed);
    setElapsedTime(elapsed);
  }, [checkInTimeData]);

  // Function to check if the row should show buttons
  const shouldShowButtons = () => {
    return elapsedTime >= resetTimeThreshold;
  };

  // Function to reset the data
  const resetRowData = () => {
    console.log("Resetting row data");

    setElapsedTime(0);
  };

  return (
    <div>
      <TableContainer component={Paper} className="custom-table-container">
        <Table sx={{ minWidth: 700 }} aria-label="custom-table">
          <TableHead>
            <TableRow>
              <StyledTableCell align="center" className="custom-table-cell">
                Check-In
              </StyledTableCell>
              <StyledTableCell align="center" className="custom-table-cell">
                Work Title
              </StyledTableCell>
              <StyledTableCell align="center" className="custom-table-cell">
                Check-Out
              </StyledTableCell>
              <StyledTableCell align="center" className="custom-table-cell">
                Pause Timer
              </StyledTableCell>
              <StyledTableCell align="center" className="custom-table-cell">
                Paused reasons
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
                      {dayjs(checkInTimeData.data.checkInTime?.checkIn).format(
                        "YYYY-MM-DD HH:mm:ssA"
                      )}
                    </span>
                    {checkInTimeData?.data?.checkInTime?.plannedWorkingHours ? (
                      <p>
                        You have decided to work:{" "}
                        {
                          checkInTimeData?.data?.checkInTime
                            ?.plannedWorkingHours
                        }{" "}
                        hours
                      </p>
                    ) : null}
                  </div>
                ) : (
                  <Button
                    variant="outlined"
                    onClick={() => {
                      handleCheckIn();
                      resetRowData();
                    }}
                    className="button-changes"
                    style={{
                      padding: "2px 4px",
                      fontSize: "12px",
                    }}
                  >
                    Check-In
                  </Button>
                )}
              </StyledTableCell>

              <StyledTableCell align="center">
                {checkInTimeData?.data?.checkInTime?.title ? (
                  <p>{checkInTimeData?.data?.checkInTime?.title}</p>
                ) : null}
              </StyledTableCell>

              <StyledTableCell align="center">
                {console.log(checkedIn)}
                {checkInTimeData?.data?.checkInTime?.checkOut ? (
                  <span>
                    {dayjs(checkInTimeData?.data?.checkInTime?.checkOut).format(
                      "YYYY-MM-DD HH:mm:ss"
                    )}
                  </span>
                ) : (
                  <Button
                    variant="outlined"
                    onClick={() => {
                      handleCheckout();
                      resetRowData();
                    }}
                    className="button-changes"
                    disabled={disableByPlannedHours()}
                    style={{
                      padding: "2px 4px",
                      fontSize: "12px",
                    }}
                  >
                    Check-Out
                  </Button>
                )}
              </StyledTableCell>

              <StyledTableCell align="center">
                <Button
                  variant="outlined"
                  onClick={handlePauseTimer}
                  disabled={
                    checkInTimeData?.data?.checkInTime?.checkOut
                      ? true
                      : true && !checkInTimeData?.data?.checkInTime?.pauseStatus
                      ? checkInTimeData?.data?.checkInTime?.checkIn
                        ? false
                        : true
                      : true
                  }
                  className="button-changes"
                  style={{
                    padding: "2px 4px",
                    fontSize: "12px",
                  }}
                >
                  Pause Timer
                </Button>
              </StyledTableCell>
              {console.log(
                !checkInTimeData?.data?.checkInTime?.pauseStatus
                  ? checkInTimeData?.data?.checkInTime?.checkIn
                    ? false
                    : true
                  : false
              )}
              <StyledTableCell align="center">
                <div className="reason-container">
                  {checkInTimeData?.data?.checkInTime?.pauseTimers?.map(
                    (item, index) => (
                      <div key={index} className="fetched-text">
                        {item?.reason}
                      </div>
                    )
                  )}
                </div>
              </StyledTableCell>

              <StyledTableCell align="center">
                <Button
                  variant="outlined"
                  onClick={handleResumeTimer}
                  disabled={
                    !checkInTimeData?.data?.checkInTime?.pauseStatus ||
                    checkInTimeData?.data?.checkInTime?.checkOut // Disable when paused or checked out
                      ? true
                      : false
                  }
                  className="button-changes"
                  style={{
                    padding: "2px 4px",
                    fontSize: "12px",
                  }}
                >
                  Resume Timer
                </Button>
              </StyledTableCell>

              {/* <StyledTableCell align="center">
              {addRow.pausedDuration}
            </StyledTableCell> */}

              {/* Displaying calculated worked hours */}
              <StyledTableCell align="center">
                {checkInTimeData?.data?.checkInTime?.plannedWorkingHours ? (
                  `Planned Working : ${checkInTimeData.data.checkInTime.plannedWorkingHours} hours`
                ) : (
                  <>
                    {workedHours}
                    {durationError && <p>Error: {durationError.message}</p>}
                  </>
                )}
              </StyledTableCell>

              <StyledTableCell align="center">
                <TextareaAutosize
                  rowsMin={3}
                  style={{
                    width: "100%",
                    minHeight: "40px",
                    fontSize: "16px",
                    marginTop: "10px",
                  }}
                  value={noteText} // Bind the value to 'noteText state'
                  onChange={(e) => setNoteText(e.target.value)}
                />
                <IconButton
                  color="primary"
                  aria-label="add Note"
                  onClick={() => {
                    handleAddNotes();
                    resetRowData();
                  }}
                  disabled={
                    !checkInTimeData?.data?.checkInTime?.checkIn ||
                    checkInTimeData?.data?.checkInTime?.checkOut // Disable when paused or checked out
                      ? true
                      : false
                  }
                >
                  Add notes
                  <AddCircleIcon />
                </IconButton>
                {checkInTimeData?.data?.checkInTime?.notes && (
                  <div>
                    {checkInTimeData?.data?.checkInTime?.notes.map(
                      (item, index) => (
                        <div key={index} className="Notes-cell">
                          {item}
                        </div>
                      )
                    )}
                  </div>
                )}
              </StyledTableCell>
            </StyledTableRow>
          </TableBody>
        </Table>
      </TableContainer>
      <PauseTimerDialog
        open={isPauseDialogOpen}
        onClose={closePauseDialog}
        onReasonSubmit={handleReasonSubmit}
        reason={pauseReason}
        setReason={setPauseReason}
      />
      <CheckInPop open={checkInModalOpen} handleClose={closeCheckInModal} />
    </div>
  );
}

// export default CustomizedTables;
