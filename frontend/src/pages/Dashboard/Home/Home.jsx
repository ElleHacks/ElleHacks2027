import { useAuth } from "../../../context/AuthContext";
import SideBar from "../../../components/SideBar/SideBar";
import "./Home.css";

const Home = () => {
  const { user } = useAuth();
  const firstName = user?.firstName || "there";

  return (
    <div className="dashboard">
      <SideBar />
      <main className="dashboardMain">
        <h1 className="dashboardGreeting">Hi, {firstName}!</h1>
        <p className="dashboardWelcome">Welcome to ElleHacks27</p>

        <section className="checkInCard" aria-labelledby="checkInTitle">
          <div className="qrPlaceholder" role="img" aria-label="QR code placeholder">
            <span>QR<br />CODE</span>
          </div>
          <div className="checkInDetails">
            <h2 id="checkInTitle">Check-In QR CODE</h2>
            <p className="userId">USER ID: XXXXXXXXXXXX</p>
            <p className="checkInDescription">
              some description about the qr code here....
            </p>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Home;
