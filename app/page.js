// 'use client' is required because we fetch on the client for interactivity
'use client';
import {useEffect, useMemo, useState} from 'react';

const PRESETS = [
  { name: 'Bangkok, TH', lat: 13.7563, lon: 100.5018, tz: 'Asia/Bangkok' },
  { name: 'Chiang Mai, TH', lat: 18.7877, lon: 98.9931, tz: 'Asia/Bangkok' },
  { name: 'Tokyo, JP', lat: 35.6762, lon: 139.6503, tz: 'Asia/Tokyo' },
  { name: 'New York, US', lat: 40.7128, lon: -74.0060, tz: 'America/New_York' },
];

function dirToText(deg) {
  if (deg == null) return '—';
  const dirs = ['N','NNE','NE','ENE','E','ESE','SE','SSE','S','SSW','SW','WSW','W','WNW','NW','NNW'];
  return dirs[Math.round(deg / 22.5) % 16];
}

export default function Page() {
  const [coords, setCoords] = useState(PRESETS[0]);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const params = useMemo(() => new URLSearchParams({lat: String(coords.lat), lon: String(coords.lon), tz: coords.tz}), [coords]);

  useEffect(() => {
    const load = async () => {
      setLoading(true); setError(null);
      try {
        const res = await fetch(`/api/weather?${params.toString()}`, { next: { revalidate: 600 } });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        setData(json);
      } catch (e) {
        setError(String(e));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [params]);

  // Build a table for the next 12 hours
  const hours = useMemo(() => {
    if (!data?.hourly) return [];
    const now = Date.now();
    const pairs = data.hourly.time.map((t, i) => ({
      time: t,
      temp: data.hourly.temperature_2m?.[i],
      precip: data.hourly.precipitation?.[i],
      wind: data.hourly.wind_speed_10m?.[i]
    }));
    // Next 12 values from current hour index
    const idx = pairs.findIndex(p => new Date(p.time).getTime() >= now);
    return pairs.slice(idx >= 0 ? idx : 0, (idx >= 0 ? idx : 0) + 12);
  }, [data]);

  return (
    <div className="row">
      <section className="card">
        <h2 style={{marginTop:0}}>Location</h2>
        <p className="muted" style={{marginTop:-8}}>Pick a preset or enter coordinates (lat, lon).</p>
        <div className="row">
          <div>
            <label className="muted">Presets</label>
            <select value={coords.name} onChange={e => setCoords(PRESETS.find(p => p.name === e.target.value))}>
              {PRESETS.map(p => <option key={p.name} value={p.name}>{p.name}</option>)}
            </select>
          </div>
          <div>
            <label className="muted">Latitude</label>
            <input type="number" step="0.0001" value={coords.lat} onChange={e => setCoords(c => ({...c, lat: parseFloat(e.target.value)}))} />
          </div>
          <div>
            <label className="muted">Longitude</label>
            <input type="number" step="0.0001" value={coords.lon} onChange={e => setCoords(c => ({...c, lon: parseFloat(e.target.value)}))} />
          </div>
          <div>
            <label className="muted">Timezone</label>
            <input value={coords.tz} onChange={e => setCoords(c => ({...c, tz: e.target.value}))} />
          </div>
        </div>
        <div style={{marginTop:12, display:'flex', gap:8}}>
          <button className="btn" onClick={() => setCoords({...coords})}>Refresh</button>
          <a className="btn" href={`https://www.open-meteo.com/en/docs`} target="_blank" rel="noreferrer">API Docs ↗</a>
        </div>
      </section>

      <section className="card">
        <h2 style={{marginTop:0}}>Current Conditions</h2>
        {loading && <div>Loading…</div>}
        {error && <div style={{color:'#ef4444'}}>Error: {error}</div>}
        {data?.current && (
          <div className="row">
            <div>
              <div className="muted">Temperature</div>
              <div style={{fontSize:28, fontWeight:700}}>{data.current.temperature_2m}°C</div>
            </div>
            <div>
              <div className="muted">Humidity</div>
              <div style={{fontSize:28, fontWeight:700}}>{data.current.relative_humidity_2m}%</div>
            </div>
            <div>
              <div className="muted">Precipitation</div>
              <div style={{fontSize:28, fontWeight:700}}>{data.current.precipitation ?? 0} mm</div>
            </div>
            <div>
              <div className="muted">Wind</div>
              <div style={{fontSize:28, fontWeight:700}}>{data.current.wind_speed_10m} km/h <span className="pill">{dirToText(data.current.wind_direction_10m)}</span></div>
            </div>
          </div>
        )}
      </section>

      <section className="card">
        <h2 style={{marginTop:0}}>Next hours (forecast)</h2>
        {!hours.length && <div className="muted">No hourly data.</div>}
        {!!hours.length && (
          <div style={{overflowX:'auto'}}>
            <table>
              <thead>
                <tr><th>Time</th><th>Temp (°C)</th><th>Precip (mm)</th><th>Wind (km/h)</th></tr>
              </thead>
              <tbody>
                {hours.map((h, i) => (
                  <tr key={i}>
                    <td>{new Date(h.time).toLocaleString()}</td>
                    <td>{h.temp ?? '—'}</td>
                    <td>{h.precip ?? 0}</td>
                    <td>{h.wind ?? '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
