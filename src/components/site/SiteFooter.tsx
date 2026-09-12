export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-shell footer-inner">
        <div>
          <strong>DECHIVE</strong>
          <p>AI를 이해하고 다루는 모든 지식.</p>
        </div>
        <p>© {new Date().getFullYear()} DECHIVE</p>
      </div>
    </footer>
  );
}
