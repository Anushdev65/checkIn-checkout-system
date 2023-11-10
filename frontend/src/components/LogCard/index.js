import * as React from "react";
import AspectRatio from "@mui/joy/AspectRatio";
import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import Card from "@mui/joy/Card";
import CardContent from "@mui/joy/CardContent";
import Typography from "@mui/joy/Typography";
import { useEffect } from "react";
import Sheet from "@mui/joy/Sheet";
import { useSaveCheckInTimeQuery } from "../../services/api/timeTracking";
import dayjs from "dayjs";
import {
  useDetailAllTrackingLogQuery,
  useAddTrackingLogMutation,
} from "../../services/api/trackingLog";
import { getUserInfo } from "../../localStorage/localStorage";

export default function LogCard({ selectedDate, logs }) {
  // const { user } = getUserInfo();
  // const userId = user?._id;
  const formattedDate = dayjs(selectedDate).format("YYYY-MM-DD");

  // const { data: checkInTimeData, isLoading: checkInLoading } =
  //   useSaveCheckInTimeQuery(userId);
  // console.log(checkInTimeData);

  const { data: log, isLoading: logLoading } = useDetailAllTrackingLogQuery({
    date: formattedDate,
  });
  console.log(log);
  console.log(formattedDate);

  const logForSelectedDate = log.data.results.find((entry) => {
    return dayjs(entry.date).format("YYYY-MM-DD") === selectedDate;
  });
  console.log(logForSelectedDate);

  if (!logForSelectedDate) {
    return <p>No log entries available for this date.</p>;
  }

  return (
    <Box
      sx={{
        width: "100%",
        position: "relative",
        overflow: { xs: "auto", sm: "initial" },
      }}
    >
      <Box
        sx={{
          position: "absolute",
          display: "block",
          width: "1px",
          bgcolor: "warning.300",
          left: "500px",
          top: "-24px",
          bottom: "-24px",
          "&::before": {
            top: "4px",
            content: '"vertical"',
            display: "block",
            position: "absolute",
            right: "0.5rem",
            color: "text.tertiary",
            fontSize: "sm",
            fontWeight: "lg",
          },
          "&::after": {
            top: "4px",
            content: '"horizontal"',
            display: "block",
            position: "absolute",
            left: "0.5rem",
            color: "text.tertiary",
            fontSize: "sm",
            fontWeight: "lg",
          },
        }}
      />
      {logForSelectedDate ? (
        <Card
          key={logForSelectedDate._id}
          orientation="horizontal"
          sx={{
            width: "100%",
            flexWrap: "wrap",
            [`& > *`]: {
              "--stack-point": "500px",
              minWidth:
                "clamp(0px, (calc(var(--stack-point) - 2 * var(--Card-padding) - 2 * var(--variant-borderWidth, 0px)) + 1px - 100%) * 999, 100%)",
            },
            // make the card resizable for demo
            overflow: "auto",
            resize: "horizontal",
          }}
        >
          {/* <AspectRatio flex ratio="1" maxHeight={182} sx={{ minWidth: 182 }}>
          
        </AspectRatio> */}
          <CardContent>
            <Typography fontSize="xl" fontWeight="lg">
              Title :{logForSelectedDate?.timeTracker.title}
            </Typography>
            <Typography
              level="body-sm"
              fontWeight="lg"
              textColor="text.tertiary"
            >
              {/* {dayjs(checkInTimeData?.data?.checkInTime?.checkIn).format(
              "YYYY-MM-DD"
            )} */}
            </Typography>
            <Sheet
              sx={{
                bgcolor: "background.level1",
                borderRadius: "sm",
                p: 1.5,
                my: 1.5,
                display: "flex",
                gap: 5,
                //   '& > div': { flex: 1 },
              }}
            >
              <div>
                <Typography level="body-xs" fontWeight="lg">
                  check-In Time
                </Typography>
                <Typography fontWeight="lg">
                  {dayjs(logForSelectedDate.timeTracker.checkIn).format(
                    "HH:mm:ss A"
                  )}
                </Typography>
              </div>
              <div>
                <Typography level="body-xs" fontWeight="lg">
                  Check-Out Time
                </Typography>
                <Typography fontWeight="lg">
                  {dayjs(logForSelectedDate.timeTracker.checkOut).format(
                    "HH:mm:ss A"
                  )}
                </Typography>
              </div>

              <div>
                <Typography level="body-xs" fontWeight="lg">
                  Total Pause Count
                </Typography>
                <Typography fontWeight="lg">
                  {logForSelectedDate.timeTracker.pausedCount}
                </Typography>
              </div>
              <div>
                <Typography level="body-xs" fontWeight="lg">
                  Reasons for Pause
                </Typography>
                <Typography fontWeight="lg">
                  {logForSelectedDate.timeTracker.pauseTimers?.map(
                    (item, index) => (
                      <div key={index} className="fetched-text">
                        {item?.reason}
                      </div>
                    )
                  )}
                </Typography>
              </div>
              <div>
                <Typography level="body-xs" fontWeight="lg">
                  Total working duration
                </Typography>
                <Typography fontWeight="lg"> {logForSelectedDate.timeTracker.duration}</Typography>
              </div>
              <div>
                <Typography level="body-xs" fontWeight="lg">
                  Added Notes
                </Typography>
                <Typography fontWeight="lg">
                  {logForSelectedDate.timeTracker.notes.map((item, index) => (
                    <div key={index} className="Notes-cell">
                      {item}
                    </div>
                  ))}
                </Typography>
              </div>
            </Sheet>
            {/* <Box sx={{ display: "flex", gap: 1.5, "& > button": { flex: 1 } }}>
            <Button variant="outlined" color="neutral">
              Chat
            </Button>
            <Button variant="solid" color="primary">
              Follow
            </Button>
          </Box> */}
          </CardContent>
        </Card>
      ) : (
        <p> No log entries available for this date.</p>
      )}
    </Box>
  );
}
