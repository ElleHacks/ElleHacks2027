import SideBar from "../../../components/SideBar/SideBar";
import "../Home/Home.css";
import "./Contact.css";

const policies = [
  {
    label: "MLH Code of Conduct",
    href: "https://github.com/MLH/mlh-policies/blob/main/code-of-conduct.md",
  },
  { label: "MLH Privacy Policy", href: "https://mlh.io/privacy" },
  {
    label: "MLH Contest Terms",
    href: "https://github.com/MLH/mlh-policies/blob/main/contest-terms.md",
  },
  {
    label: "ElleHacks 2026 – Participant Consent, Photo Release, and Code of Conduct.pdf",
    href: "#",
  },
];

function Contact() {
  return (
    <div className="dashboard">
      <SideBar />
      <main className="dashboardMain contactMain">
        <h1 className="contactTitle">We’re here to support you!</h1>

        <p>
          Throughout the event, we will always have volunteers or organizers available
          to answer any questions you may have, through any challenges that may arise.
        </p>

        <p>
          Prior to the event, the best way to reach us is via email at{" "}
          <a className="contactEmail" href="mailto:questions@ellehacks.com">
            questions@ellehacks.com
          </a>
          .
        </p>

        <p>
          During the event, the best way to reach us is via Discord in the{" "}
          <strong>#general-help channel</strong>, or one of the channels under the HELP
          category. Please tag <strong>@volunteer</strong> or{" "}
          <strong>@organizer</strong> in your message for an urgent response.
        </p>

        <section className="contactPolicies" aria-labelledby="contactPoliciesTitle">
          <h2 id="contactPoliciesTitle">
            Please note: by participating in ElleHacks, you agree to abide by the following:
          </h2>
          <ul className="contactPolicyList">
            {policies.map(({ label, href }) => (
              <li key={label}>
                <a href={href} target="_blank" rel="noreferrer">
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  );
}

export default Contact;
