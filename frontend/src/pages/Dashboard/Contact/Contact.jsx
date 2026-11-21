const policies = [
  { label: "MLH Code of Conduct", href: "https://static.mlh.io/docs/mlh-code-of-conduct.pdf" },
  { label: "MLH Privacy Policy", href: "https://mlh.io/privacy" },
  {
    label: "MLH Contest Terms",
    href: "https://github.com/MLH/mlh-policies/tree/master/prize-terms-and-conditions",
  },
];

function Contact() {
  return (
    <div className="dashboard-page">
      <h1 className="dashboard-page__title">We’re here to support you!</h1>

      <div className="dashboard-page__body">
        <div className="contact-info">
          <p>
            Throughout the event, we will always have volunteers or organizers available to answer any questions you
            may have, through any challenges that may arise.
          </p>
          <p>
            Prior to the event, the best way to reach us is via email at{" "}
            <a className="contact-email" href="mailto:questions@ellehacks.com">
              questions@ellehacks.com
            </a>
            <strong>.</strong>
          </p>
          <p className="contact-info__discord">
            During the event, the best way to reach us is via Discord in the <strong>#general-help channel</strong>, or
            one of the channels under the HELP category. Please tag <strong>@volunteer</strong> or{" "}
            <strong>@organizer</strong> in your message for an urgent response.
          </p>
        </div>

        <div className="contact-policies">
          <p>Please note: by participating in Ellehacks, you agree to abide by the following:</p>
          <ul>
            {policies.map(({ label, href }) => (
              <li key={href}>
                <a href={href} target="_blank" rel="noopener noreferrer">
                  {label}
                </a>
              </li>
            ))}
            {/* TODO: link this once the consent form PDF is hosted */}
            <li>ElleHacks 2026 - Participant Consent, Photo Release, and Code of Conduct.pdf</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Contact;
