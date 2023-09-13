import NavBar from "../../components/NavBar";
import "../../styles/homelayout.css";
import Table from "../../components/Table";
import Clock from "../../components/Clock";
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
