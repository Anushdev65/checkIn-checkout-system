import NavBar from "../../components/NavBar";
import Clock from "../../components/Clock";
import LogTable from "../../components/LogTable";
import Calender from "../../components/CalendarGrid";
import { useSaveCheckInTimeQuery } from "../../services/api/timeTracking";
import { getUserInfo } from "../../localStorage/localStorage";
import LogCard from "../../components/LogCard";
function TrackingLogLayout() {
  const { user } = getUserInfo();
  const userId = user?._id;

  const { data: checkInTimeData, isLoading: checkInLoading } =
    useSaveCheckInTimeQuery(userId);

  return (
    <main className="main-body">
      <div className="content-wrapper">
        <NavBar />
        <div className="content">
          <div className="contents">
            <Clock />
          </div>
          <div>
            <Calender checkInTimeData={checkInTimeData} />
          </div>
          {/* <LogTable checkInTimeData={checkInTimeData} /> */}
          {/* <LogCard /> */}
        </div>
      </div>
    </main>
  );
}

export default TrackingLogLayout;
