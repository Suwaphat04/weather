'use client';
import { useMemo, useState } from 'react';

/* ===================== Demo Data (ทดสอบได้ทันที) ===================== */
const demoData = {
  location: {
    preset: 'Bangkok, TH',
    latitude: 13.7563,
    longitude: 100.5018,
    timezone: 'Asia/Bangkok',
  },
  current: {
    temperature: 29.8,
    humidity: 70,
    precipitation: 0,
    windSpeed: 7.8,
    windDir: 'SSW',
  },
  hours: [
    { time: '2/9/2568 19:00:00', temp: 28.8, precip: 0, wind: 6.5 },
    { time: '2/9/2568 20:00:00', temp: 28.2, precip: 0, wind: 5.1 },
    { time: '2/9/2568 21:00:00', temp: 28.0, precip: 0, wind: 4.2 },
    { time: '2/9/2568 22:00:00', temp: 27.9, precip: 0, wind: 3.7 },
    { time: '2/9/2568 23:00:00', temp: 27.8, precip: 0, wind: 4.4 },
    { time: '3/9/2568 00:00:00', temp: 27.7, precip: 0, wind: 5.5 },
    { time: '3/9/2568 01:00:00', temp: 27.4, precip: 0, wind: 5.0 },
    { time: '3/9/2568 02:00:00', temp: 27.0, precip: 0, wind: 3.2 },
  ],
};

/* =========================== Weather Icons ============================ */
function SunIcon({ className = 'w-5 h-5' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor">
      <circle cx="12" cy="12" r="4" strokeWidth="1.75" />
      <path strokeWidth="1.75" d="M12 2v2m0 16v2M4 12H2m20 0h-2M5 5l1.4 1.4M17.6 17.6L19 19M19 5l-1.4 1.4M5 19l1.4-1.4"/>
    </svg>
  );
}
function CloudIcon({ className = 'w-5 h-5' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor">
      <path strokeWidth="1.75" d="M7 18h9a4 4 0 0 0 0-8 6 6 0 0 0-11.6 2" />
    </svg>
  );
}
function RainIcon({ className = 'w-5 h-5' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor">
      <path strokeWidth="1.75" d="M7 16h9a4 4 0 0 0 0-8 6 6 0 0 0-11.6 2" />
      <path strokeWidth="1.75" d="M8 19l-1 2M12 19l-1 2M16 19l-1 2" />
    </svg>
  );
}

/* เดาง่าย ๆ: มีฝน => rain, ไม่ฝน กลางวัน(07–18) => sun, นอกนั้น => cloud */
function getWeatherKind(row) {
  if (row.precip && row.precip > 0) return 'rain';
  const hh = parseInt((row.time.split(' ')[1] || '00:00').slice(0, 2), 10);
  return hh >= 7 && hh <= 18 ? 'sun' : 'cloud';
}
function WeatherGlyph({ kind, className = 'w-5 h-5' }) {
  const base = `text-sky-600 ${className}`;
  if (kind === 'rain') return <RainIcon className={base} />;
  if (kind === 'cloud') return <CloudIcon className={base} />;
  return <SunIcon className={base} />;
}

/* ========================== UI Primitives ============================= */
function Badge({ children }) {
  return (
    <span className="inline-flex items-center rounded-full border border-sky-200 bg-white px-2 py-1 text-xs text-sky-700">
      {children}
    </span>
  );
}
function Section({ title, action, children }) {
  return (
    <section className="rounded-2xl border-2 border-sky-200 bg-white shadow-md">
      <div className="flex items-center justify-between px-4 sm:px-6 py-3 bg-sky-50 border-b border-sky-200">
        <h2 className="text-lg sm:text-xl font-semibold text-sky-900">{title}</h2>
        {action}
      </div>
      <div className="p-4 sm:p-6">{children}</div>
    </section>
  );
}
function Stat({ label, value, unit, hint, icon }) {
  return (
    <div className="rounded-xl border-2 border-sky-200 bg-white p-4 shadow-sm">
      <div className="flex items-center gap-2 text-sky-700">
        {icon ? <span className="text-sky-600">{icon}</span> : null}
        <span className="text-xs font-medium">{label}</span>
      </div>
      <div className="mt-1 flex items-end gap-1">
        <span className="text-2xl font-bold text-sky-900">{value}</span>
        {unit ? <span className="text-sm text-sky-600">{unit}</span> : null}
      </div>
      {hint ? <span className="mt-2 block text-xs text-sky-500">{hint}</span> : null}
    </div>
  );
}
function MiniBar({ value, max = 40, label }) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  return (
    <div className="w-full">
      <div className="h-1.5 w-full rounded-full bg-sky-100">
        <div
          className="h-1.5 rounded-full"
          style={{ width: `${pct}%`, background: 'linear-gradient(90deg,#38bdf8,#34d399)' }}
        />
      </div>
      <div className="mt-1 flex justify-between text-[10px] text-sky-600">
        <span>{label}</span>
        <span>{value}</span>
      </div>
    </div>
  );
}

/* ========================= Complex Components ========================== */
function HourCard({ row }) {
  const time = row.time.split(' ')[1]?.slice(0, 5) ?? row.time;
  const kind = getWeatherKind(row);
  return (
    <div className="rounded-xl border-2 border-sky-200 bg-white shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 bg-sky-50 border-b border-sky-200">
        <div className="flex items-center gap-2 font-semibold text-sky-900">
          <WeatherGlyph kind={kind} className="w-5 h-5" />
          <span>{time}</span>
        </div>
        <span className="inline-flex items-center gap-1 text-xs text-sky-800">
          🌧️ <b>{row.precip}</b> mm
        </span>
      </div>
      <div className="p-4 grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <div className="text-xs text-sky-600">Temp</div>
          <div className="text-lg font-semibold text-sky-900">{row.temp}°C</div>
          <MiniBar value={row.temp} max={40} label="°C" />
        </div>
        <div className="space-y-1">
          <div className="text-xs text-sky-600">Wind</div>
          <div className="text-lg font-semibold text-sky-900">{row.wind} km/h</div>
          <MiniBar value={row.wind} max={20} label="km/h" />
        </div>
      </div>
    </div>
  );
}
function HoursTable({ rows }) {
  return (
    <div className="rounded-2xl border-2 border-sky-200 bg-white shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-[640px] w-full text-sm">
          <thead className="bg-sky-50 border-b border-sky-200">
            <tr className="text-left text-sky-900">
              <th className="py-2 px-4">Time</th>
              <th className="py-2 px-4">Temp (°C)</th>
              <th className="py-2 px-4">Precip (mm)</th>
              <th className="py-2 px-4">Wind (km/h)</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i} className="border-b last:border-0">
                <td className="py-2 px-4 font-medium text-gray-800">{r.time}</td>
                <td className="py-2 px-4">{r.temp}</td>
                <td className="py-2 px-4">{r.precip}</td>
                <td className="py-2 px-4">{r.wind}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ---------------- Brand (โลโก้ขนาดเล็กใน Header) ---------------- */
function Brand() {
  return (
    <div className="flex items-center gap-2">
      {/* ⬇️ กำหนดขนาดโลโก้ที่นี่ */}
      <CloudIcon className="w-8 h-8 text-sky-700" />
      <span className="text-2xl sm:text-3xl font-bold text-sky-900">
        Weather Now — Public Dashboard
      </span>
    </div>
  );
}

function Header({ loc }) {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-sky-200 bg-gradient-to-tr from-sky-50 via-sky-100 to-sky-200 p-6">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(56,189,248,.25),transparent_50%)]" />
      <div className="relative z-10 flex flex-wrap items-center gap-3">
        <Brand />
        <div className="ml-auto flex flex-wrap gap-2">
          <Badge>📍 {loc.preset}</Badge>
          <Badge>🧭 {loc.latitude.toFixed(4)}, {loc.longitude.toFixed(4)}</Badge>
          <Badge>🕒 {loc.timezone}</Badge>
        </div>
      </div>
    </div>
  );
}

function LayoutToggle({ value, onChange }) {
  const options = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'cards', label: 'Cards' },
    { id: 'table', label: 'Table' },
  ];
  return (
    <div className="inline-flex rounded-full border border-sky-200 bg-white p-1">
      {options.map((o) => (
        <button
          key={o.id}
          onClick={() => onChange(o.id)}
          className={`px-3 py-1 text-sm rounded-full transition ${
            value === o.id ? 'bg-sky-700 text-white' : 'text-sky-800 hover:bg-sky-100'
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

/* =============================== Main Page ============================== */
function WeatherNowRedesigned({ data = demoData }) {
  const [view, setView] = useState('dashboard');
  const minTemp = useMemo(() => Math.min(...data.hours.map((h) => h.temp)), [data.hours]);
  const maxTemp = useMemo(() => Math.max(...data.hours.map((h) => h.temp)), [data.hours]);

  return (
    <div className="mx-auto max-w-6xl p-4 sm:p-6 space-y-6 bg-gradient-to-b from-sky-50 to-sky-100">
      <Header loc={data.location} />

      <div className="flex items-center justify-between">
        <div className="text-sm text-sky-700">
          Same data, brand new layout. Min/Max next hours: <b>{minTemp}–{maxTemp}°C</b>
        </div>
        <LayoutToggle value={view} onChange={setView} />
      </div>

      {view === 'dashboard' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Section title="Current Conditions" action={<Badge>Updated now</Badge>}>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <Stat label="Temperature"   value={data.current.temperature} unit="°C" hint="Air temperature"     icon={<SunIcon />} />
              <Stat label="Humidity"      value={data.current.humidity}    unit="%"  hint="Relative humidity"    icon={<CloudIcon />} />
              <Stat label="Precipitation" value={data.current.precipitation} unit="mm" hint="Rain in last hour" icon={<RainIcon />} />
              <Stat label="Wind"          value={data.current.windSpeed}   unit="km/h" hint={`Direction ${data.current.windDir}`} icon={<CloudIcon />} />
            </div>
          </Section>

          <Section title="Next Hours (Highlights)" action={<Badge>Local time</Badge>}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {data.hours.slice(0, 4).map((row, i) => <HourCard key={i} row={row} />)}
            </div>
          </Section>

          <Section title="Location">
            <div className="grid grid-cols-1 gap-3">
              <div className="rounded-xl border-2 border-sky-200 bg-white p-3">
                <div className="text-xs text-sky-600">Preset</div>
                <div className="font-semibold">{data.location.preset}</div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl border-2 border-sky-200 bg-white p-3">
                  <div className="text-xs text-sky-600">Latitude</div>
                  <div className="font-semibold">{data.location.latitude}</div>
                </div>
                <div className="rounded-xl border-2 border-sky-200 bg-white p-3">
                  <div className="text-xs text-sky-600">Longitude</div>
                  <div className="font-semibold">{data.location.longitude}</div>
                </div>
              </div>
              <div className="rounded-xl border-2 border-sky-200 bg-white p-3">
                <div className="text-xs text-sky-600">Timezone</div>
                <div className="font-semibold">{data.location.timezone}</div>
              </div>
              <div className="flex gap-2">
                <button className="rounded-xl bg-sky-700 text-white px-3 py-2 text-sm">Refresh</button>
                <a href="#" className="rounded-xl border border-sky-200 px-3 py-2 text-sm text-sky-800">API Docs ↗</a>
              </div>
            </div>
          </Section>
        </div>
      )}

      {view === 'cards' && (
        <Section title="Hourly Cards">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.hours.map((row, i) => <HourCard key={i} row={row} />)}
          </div>
        </Section>
      )}

      {view === 'table' && (
        <Section title="Hourly Table">
          <HoursTable rows={data.hours} />
        </Section>
      )}

      <footer className="pb-6 text-center text-xs text-sky-700">
        © Weather Now — Redesigned layout (Sky theme). Built with React + Tailwind. Data unchanged.
      </footer>
    </div>
  );
}

export default function Page() {
  return <WeatherNowRedesigned />;
}
