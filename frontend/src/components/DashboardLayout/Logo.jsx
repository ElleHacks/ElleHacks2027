import mascot from "../../assets/new-logo.png";

function Logo() {
  return (
    <div className="dash-logo">
      <img src={mascot} alt="" className="dash-logo-mascot" />
      <span className="dash-logo-text">
        ELLE
        <br />
        HACKS
      </span>
    </div>
  );
}

export default Logo;