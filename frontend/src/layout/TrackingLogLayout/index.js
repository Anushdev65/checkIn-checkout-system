import NavBar from "../../components/NavBar";
import Clock from "../../components/Clock";
import LogTable from "../../components/LogTable";
import Calender from "../../components/CalendarGrid";

function TrackingLogLayout() {
  return (
    <main className="main-body">
      <div className="content-wrapper">
        <NavBar />
        <div className="content">
          <div className="contents">
            <Clock />
          </div>
          <div>
            <Calender />
          </div>
          <LogTable />
        </div>
      </div>
    </main>
  );
}

export default TrackingLogLayout;
