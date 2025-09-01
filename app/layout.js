export const metadata = {
  title: "🌤️ Weather Now — Public Dashboard",
  description: "Simple weather dashboard powered by Open‑Meteo (no API key).",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🌤️</text></svg>" />
        <style>{`
          :root { color-scheme: light dark; }
          * { box-sizing: border-box; }
          body { margin: 0; font-family: system-ui, -apple-system, Segoe UI, Roboto, Noto Sans, Ubuntu, Cantarell, 'Helvetica Neue', Arial, 'Apple Color Emoji','Segoe UI Emoji'; background: radial-gradient(1200px 800px at 10% 10%, rgba(255, 255, 255, .8), rgba(255,255,255,0)) , linear-gradient(135deg, #c9eaff, #e9d5ff); min-height: 100dvh; }
          header { position: sticky; top: 0; backdrop-filter: blur(8px); background: rgba(255,255,255,.6); border-bottom: 1px solid rgba(0,0,0,.06); }
          main { max-width: 960px; margin: 0 auto; padding: 20px; }
          .card { background: rgba(255,255,255,.7); border: 1px solid rgba(0,0,0,.06); border-radius: 16px; padding: 16px; box-shadow: 0 10px 30px rgba(0,0,0,.06); }
          .row { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 16px; }
          .muted { opacity: .7; }
          .btn { display: inline-flex; gap: 8px; align-items: center; padding: 10px 14px; border-radius: 12px; border: 1px solid rgba(0,0,0,.08); background: white; cursor: pointer; }
          input, select { width: 100%; padding: 10px 12px; border-radius: 12px; border: 1px solid rgba(0,0,0,.15); background: white; }
          table { width: 100%; border-collapse: collapse; }
          th, td { padding: 8px 10px; border-bottom: 1px dashed rgba(0,0,0,.08); text-align: left; }
          .pill { padding: 4px 8px; border-radius: 999px; border: 1px solid rgba(0,0,0,.08); background: rgba(255,255,255,.8); }
          footer { color: #334155; font-size: 12px; }
          @media (prefers-color-scheme: dark) {
            body { background: radial-gradient(1000px 600px at 0% 0%, rgba(255,255,255,.04), rgba(0,0,0,0)) , linear-gradient(135deg, #0f172a, #1f2937); color: #e5e7eb; }
            header { background: rgba(15,23,42,.5); border-color: rgba(255,255,255,.08); }
            .card { background: rgba(2,6,23,.6); border-color: rgba(255,255,255,.06); }
            .btn { background: #0b1220; color: #e5e7eb; }
            input, select { background: #0b1220; color: #e5e7eb; border-color: rgba(255,255,255,.12); }
            th, td { border-bottom-color: rgba(255,255,255,.08); }
          }
        `}</style>
      </head>
      <body>
        <header>
          <main style={{display:'flex', alignItems:'center', gap:12}}>
            <div style={{fontSize:20, fontWeight:700}}>🌤️ Weather Now</div>
            <div className="muted" style={{fontSize:14}}>Open‑Meteo • Next.js on Vercel</div>
          </main>
        </header>
        <main>{children}</main>
        <footer style={{maxWidth:960, margin:'24px auto', padding:'0 20px'}}>
          <div className="muted">Data: Open‑Meteo (free, no API key). UI is minimal for clarity.</div>
        </footer>
      </body>
    </html>
  );
}
