// Stand-in for dashboard sections that haven't been built yet, so the sidebar links don't dead-end
function ComingSoon({ title }) {
  return (
    <div className="dashboard-page">
      <h1 className="dashboard-page__title">{title}</h1>
      <p className="dashboard-page__placeholder">This section is coming soon.</p>
    </div>
  );
}

export default ComingSoon;
