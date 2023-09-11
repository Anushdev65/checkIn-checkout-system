import NavBar from "../../components/NavBar";
import "../../styles/homelayout.css";

function HomeLayout() {
  return (
    <main className="main-body">
      <NavBar />
      <div className="content">
        <h1> Okay here will our content reside </h1>
      </div>
    </main>
  );
}

export default HomeLayout;
