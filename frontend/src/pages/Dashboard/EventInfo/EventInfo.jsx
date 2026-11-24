import PlaceholderTag from "../PlaceholderTag";
import { placeholderHighlight } from "../placeholderStyles";
import { eventInfo } from "../dashboardContent";

function InfoCard({ title, placeholder = false, children }) {
  return (
    <section className={`rounded-2xl p-6 ${placeholder ? placeholderHighlight : "bg-white"}`}>
      <h2 className="m-0 mb-3 flex items-center gap-3 text-xl font-bold">
        <span className="flex-1">{title}</span>
        {placeholder && <PlaceholderTag />}
      </h2>
      <div className="text-lg leading-normal font-medium">{children}</div>
    </section>
  );
}

function EventInfo() {
  return (
    <div className="dashboard-page">
      <h1 className="dashboard-page__title">Event Information</h1>

      <div className="grid gap-6 lg:grid-cols-2">
        <InfoCard title="When">
          <p className="m-0 font-semibold">{eventInfo.date}</p>
          <p className="m-0 text-[#060e22]/70">{eventInfo.format}</p>
        </InfoCard>

        <InfoCard title="Where">
          <p className="m-0 font-semibold">
            {eventInfo.venue}, {eventInfo.campus}
          </p>
          <p className="m-0 text-[#060e22]/70">
            {eventInfo.address.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </p>
          <a
            href={eventInfo.mapLink}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-block font-semibold text-[#060e22] underline"
          >
            Open in Google Maps ↗
          </a>
        </InfoCard>

        <InfoCard title="Questions?">
          <p className="m-0">
            See the <span className="font-bold">Contact</span> page, or email us at{" "}
            <a href={`mailto:${eventInfo.email}`} className="font-bold text-[#060e22]">
              {eventInfo.email}
            </a>
            .
          </p>
        </InfoCard>

        {eventInfo.extra.map((section) => (
          <InfoCard key={section.title} title={section.title} placeholder={section.placeholder}>
            <p className="m-0">{section.body}</p>
          </InfoCard>
        ))}
      </div>
    </div>
  );
}

export default EventInfo;
