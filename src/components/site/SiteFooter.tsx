export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-shell footer-inner">
        <p>DECHIVE</p>
        <p>배우고, 확인하고, 나의 언어로 다시 설명합니다.</p>
        <p>© {new Date().getFullYear()}</p>
      </div>
    </footer>
  );
}
