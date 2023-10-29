import Clock from "../../components/Clock";
import NavBar from "../../components/NavBar";
import Table from "../../components/Table";
import "../../styles/homelayout.css";
function HomeLayout() {
  return (
    <main className="main-body">
      <div className="content-wrapper">
        <NavBar />
        <div className="content">
          <div className="contents">
            <Clock />
          </div>
          <Table />
        </div>
      </div>
    </main>
  );
}

export default HomeLayout;
