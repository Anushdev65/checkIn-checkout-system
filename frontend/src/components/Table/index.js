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
  useUserCheckinMutation,
  useUserCheckoutMutation,
  useDurationMutation,
  useResumeTimerMutation,
  usePauseTimerMutation,
} from "../../services/api/timeTracking/timeTracking";
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

export default function CustomizedTables() {
  const [addRow, setAddRow] = useState({
    checkIn: "",
    checkOut: "",
    pauseTimer: "",
    resumeTimer: "",
    duration: "",
    notes: "",
  });

  const handleAction = (action) => {
    const currentTime = dayjs();
    switch (action) {
      case "checkIn":
        setAddRow({
          ...addRow,
          checkIn: currentTime.format(" HH:mm:ss"),
        });
        break;
      case "checkOut":
        if (addRow.checkIn) {
          setAddRow({
            ...addRow,
            checkOut: currentTime.format("YYYY-MM-DD HH:mm:ss"),
          });
          const checkInTime = dayjs(addRow.checkIn);
          const checkOutTime = dayjs(addRow.checkOut);
          const durationMinutes = checkOutTime.diff(checkInTime, "minutes");
          setAddRow({ ...addRow, duration: durationMinutes });
        }
        break;
      case "pauseTimer":
        if (addRow.checkIn && !addRow.pauseTimer) {
          setAddRow({
            ...addRow,
            pauseTimer: currentTime.format("YYYY-MM-DD HH:mm:ss"),
          });
        }
        break;
      case "resumeTimer":
        if (addRow.checkIn && addRow.pauseTimer) {
          const pauseTime = dayjs(addRow.pauseTimer);
          const resumeTime = currentTime;
          const pauseDurationMinutes = resumeTime.diff(pauseTime, "minutes");
          setAddRow({
            ...addRow,
            pauseDuration: addRow.pauseDuration
              ? addRow.pauseDuration + pauseDurationMinutes
              : pauseDurationMinutes,
            pauseTimer: null,
          });
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
            <StyledTableCell align="center" className="custom-table-cell">
              Duration
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
                <Button
                  variant="outlined"
                  onClick={() => handleAction("checkIn")}
                >
                  Check-In
                </Button>
              )}
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
              <Button
                variant="outlined"
                onClick={() => handleAction("pauseTimer")}
              >
                Pause Timer
              </Button>
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
              value={addRow.duration}
              onChange=
              {(e) => setAddRow({ ...addRow, duration: e.target.value })}
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
            <StyledTableCell align="center"></StyledTableCell>
          </StyledTableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
}

// export default CustomizedTables;
