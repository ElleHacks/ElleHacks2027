import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import API from "../../../utils/api";
import "./Home.css";

const Home = () => {
  const { user } = useAuth();
  const firstName = user?.firstName || "there";
  const [status, setStatus] = useState("loading");

  // Runs once when the page opens - ask the backend for this hacker's application status
  useEffect(() => {
    let active = true;
    API.get("/applications/me")
      .then((res) => active && setStatus(res.data.application?.status || "incomplete"))
      .catch(() => active && setStatus("unknown"));
    return () => {
      active = false;
    };
  }, []);

  return (
    <div>
      <h1 className="dashboardGreeting">Hi, {firstName}!</h1>
      <p className="dashboardWelcome">Welcome to ElleHacks27</p>

      {/* QR code - only once the application is accepted */}
      {status === "accepted" && (
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
      )}

      {/* Not accepted yet - QR code will show up once accepted */}
      {(status === "incomplete" || status === "submitted" || status === "waitlisted") && (
        <section className="checkInCard">
          <div className="checkInDetails">
            <h2>Your check-in QR code will appear here once you’re accepted!</h2>
            <Link className="checkInButton" to="/dashboard/application">
              See your application status
            </Link>
          </div>
        </section>
      )}
    </div>
  );
};

export default Home;