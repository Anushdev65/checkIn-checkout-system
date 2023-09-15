import { Button, TextareaAutosize } from "@mui/material";
import {
  createTable,
  getCoreRowModel,
  getExpandedRowModel,
  useTableInstance,
} from "@tanstack/react-table";
import dayjs from "dayjs";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  useAddTimeTrackerMutation,
  useEditTimeTrackerMutation,
  useDeleteTimeTrackerMutation,
  useUserCheckInMutation,
  useUserCheckOutMutation,
  useDurationMutation,
  useResumeTimerMutation,
  usePauseTimerMutation,
} from "../../services/api/timeTracking";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
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

export default function CustomizedTables() {
  const [addRow, setAddRow] = useState({
    checkIn: "",
    checkOut: "",
    pauseTimer: "",
    resumeTimer: "",
    pausedDuration: "",
    duration: "",
    notes: "",
  });

  const [checkInMutation, { data, isSuccess, error, isLoading }] =
    useUserCheckInMutation();

  const [isCheckInSuccess, setIsCheckInSuccess] = useState(false);
  // handleCheckIn function to implement logic for checkIn button as well as fetching the api inside it.
  const handleCheckIn = async () => {
    try {
      const currentTime = dayjs();
      const requestBody = {};
      setAddRow({
        ...addRow,
        checkIn: currentTime.format(" HH:mm:ss A"),
      });

      const response = await checkInMutation({ body: requestBody });

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

  const handleAction = (action) => {
    const currentTime = dayjs();
    switch (action) {
      case "checkOut":
        if (addRow.checkIn) {
          const checkInTime = dayjs(addRow.checkIn);
          const checkOutTime = currentTime;
          const durationMinutes = checkOutTime.diff(checkInTime, "minute");

          setAddRow({
            ...addRow,
            checkOut: currentTime.format("HH:mm:ss A"),
            duration: durationMinutes,
          });
        }
        break;
      case "pauseTimer":
        if (addRow.checkIn && !addRow.pauseTimer) {
          setAddRow({
            ...addRow,
            pauseTimer: currentTime.format("HH:mm:ss A"),
          });
        }
        break;
      case "resumeTimer":
        if (addRow.checkIn && addRow.pauseTimer) {
          const pauseTime = dayjs(addRow.pauseTimer);
          const resumeTime = currentTime;
          const pauseDurationMinutes = resumeTime.diff(pauseTime, "minutes");

          setAddRow((prevRow) => ({
            ...prevRow,
            pausedDuration: prevRow.pausedDuration
              ? prevRow.pausedDuration + pauseDurationMinutes
              : pauseDurationMinutes,
            pauseTimer: null,
          }));
        }
        break;
      default:
        break;
    }
  };

  return (
    <TableContainer component={Paper} className="custom-table-container">
      <Table sx={{ minWidth: 700 }} aria-label="custom-table">
        <TableHead>
          <TableRow>
            <StyledTableCell
              align="center"
              className={`custom-table-cell ${
                isCheckInSuccess ? "green-background" : ""
              }`}
            >
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
            <StyledTableCell align="center" className="custom-table-cell">
              Paused Duration
            </StyledTableCell>
            <StyledTableCell align="center" className="custom-table-cell">
              Worked Hours
            </StyledTableCell>
            <StyledTableCell align="center" className="custom-table-cell">
              Notes
            </StyledTableCell>
            <StyledTableCell align="center" className="custom-table-cell">
              Actions
            </StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <StyledTableRow>
            <StyledTableCell>
              {addRow.checkIn ? (
                addRow.checkIn
              ) : (
                <Button variant="outlined" onClick={handleCheckIn}>
                  Check-In
                </Button>
              )}
              {isLoading && <p> Loading...</p>}
              {isSuccess && <p> Check-In Successful</p>}
              {error && <p>Error: {error.message}</p>}
              {data && <p> Data: {JSON.stringify(data)}</p>}
            </StyledTableCell>
            <StyledTableCell align="center">
              {addRow.checkOut ? (
                addRow.checkOut
              ) : (
                <Button
                  variant="outlined"
                  onClick={() => handleAction("checkOut")}
                >
                  Check-Out
                </Button>
              )}
            </StyledTableCell>
            <StyledTableCell align="center">
              {addRow.pauseTimer ? (
                addRow.pauseTimer
              ) : (
                <Button
                  variant="outlined"
                  onClick={() => handleAction("pauseTimer")}
                >
                  Pause Timer
                </Button>
              )}
            </StyledTableCell>
            <StyledTableCell align="center">
              <Button
                variant="outlined"
                onClick={() => handleAction("resumeTimer")}
              >
                Resume Timer
              </Button>
            </StyledTableCell>
            <StyledTableCell align="center">
              {addRow.pausedDuration}
            </StyledTableCell>
            <StyledTableCell align="center">
              {addRow.checkIn && addRow.checkOut
                ? calculateDuration(addRow.checkIn, addRow.checkOut)
                : ""}
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
            <StyledTableCell align="center">
              <Button
                variant="outlined"
                // onClick={() => handleAction("resumeTimer")}
              >
                Save
              </Button>
            </StyledTableCell>
          </StyledTableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
}

// export default CustomizedTables;
