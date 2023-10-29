import * as React from "react";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import "../../styles/logtable.css";
import dayjs from "dayjs";
import { useEffect } from "react";
import { useSaveCheckInTimeQuery } from "../../services/api/timeTracking";
import { useAddTrackingLogMutation } from "../../services/api/trackingLog";
import { useLazyDetailAllTrackingLogQuery } from "../../services/api/trackingLog";
import { getUserInfo } from "../../localStorage/localStorage";
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

export default function LogTable({ checkInTimeData }) {
  const queryClient = useQueryClient();
  //Using the useLazyDetailAllTrackingLogQuery hook to fetch log entries

  const {
    data: logData,
    error: logError,
    isLoading: logIsLoading,
  } = useLazyDetailAllTrackingLogQuery();

  const [addDate, { data, isSucess, error, isLoading }] =
    useAddTrackingLogMutation();

  const { user } = getUserInfo();
  const userId = user?._id;

  // const { data: checkInTimeData, isLoading: checkInLoading } =
  //   useSaveCheckInTimeQuery(userId);

  // A function to create a log entry with the date as the request payLoad
  const createLogEntry = async (date) => {
    try {
      const requestBody = {
        user: userId,
        timeTracker: checkInTimeData.data.checkInTime,
        date: date,
      };
      const response = await addDate(requestBody);
      console.log(requestBody);

      if (response.error) {
        console.error("Error creating log entry", response.error);
      } else {
        console.log("Log entry created successfully:", response.data);
        queryClient.invalidateQueries("detailAllTrackingLog");
      }
    } catch (error) {
      console.error("Error creating log entry", error);
    }
  };

  const checkInDate = checkInTimeData?.data?.checkInTime?.checkIn;
  const formattedDate = dayjs(checkInDate).format("YYYY-MM-DD");

  useEffect(() => {
    if (checkInDate) {
      createLogEntry(formattedDate);
    }
  }, [checkInDate, formattedDate]);

  return (
    <TableContainer component={Paper} className="custom-table-container">
      <Table sx={{ minWidth: 700 }} aria-label="customized table">
        <TableHead>
          <TableRow sx={{ color: "green" }}>
            <StyledTableCell align="center">SN</StyledTableCell>
            <StyledTableCell align="center">Date </StyledTableCell>
            <StyledTableCell align="center">Work Title</StyledTableCell>
            <StyledTableCell align="center">Check-In Time</StyledTableCell>
            <StyledTableCell align="center">Check-Out Time</StyledTableCell>
            <StyledTableCell align="center">Total Pause Count</StyledTableCell>
            <StyledTableCell align="center">Reasons for Pause </StyledTableCell>
            <StyledTableCell align="center">
              Total working duration
            </StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <StyledTableRow>
            <StyledTableCell align="center">1</StyledTableCell>
            <StyledTableCell aligh="center">{formattedDate}</StyledTableCell>
            <StyledTableCell align="center">
              {checkInTimeData?.data?.checkInTime?.title}
            </StyledTableCell>
            <StyledTableCell align="center">
              {dayjs(checkInTimeData?.data?.checkInTime?.checkIn).format(
                "HH:mm:ss A"
              )}
            </StyledTableCell>
            <StyledTableCell align="center">
              {dayjs(checkInTimeData?.data?.checkInTime?.checkOut).format(
                "HH:mm:ss A"
              )}
            </StyledTableCell>
            <StyledTableCell align="center">
              {checkInTimeData?.data?.checkInTime?.pausedCount}
            </StyledTableCell>
            <StyledTableCell align="center">
              {checkInTimeData?.data?.checkInTime?.pauseTimers?.map(
                (item, index) => (
                  <div key={index} className="fetched-text">
                    {item?.reason}
                  </div>
                )
              )}
            </StyledTableCell>
            <StyledTableCell align="right"></StyledTableCell>
          </StyledTableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
}
