'use client';
import { useMemo, useState } from 'react';

/* -------------------- Demo Data (แทนข้อมูลจริงชั่วคราว) -------------------- */
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

/* --------------------------- Small UI primitives --------------------------- */
function Stat({ label, value, unit, hint }) {
  return (
    <div className="flex flex-col rounded-2xl bg-white/60 backdrop-blur p-4 shadow-sm">
      <span className="text-xs font-medium text-gray-500">{label}</span>
      <div className="mt-1 flex items-end gap-1">
        <span className="text-2xl font-bold text-gray-900">{value}</span>
        {unit ? <span className="text-sm text-gray-500">{unit}</span> : null}
      </div>
      {hint ? <span className="mt-1 text-xs text-gray-400">{hint}</span> : null}
    </div>
  );
}

function Badge({ children }) {
  return (
    <span className="inline-flex items-center rounded-full border px-2 py-1 text-xs text-gray-700 bg-white/70">
      {children}
    </span>
  );
}

function Section({ title, action, children }) {
  return (
    <section className="rounded-3xl border bg-white/70 backdrop-blur p-4 sm:p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}

function MiniBar({ value, max = 40, label }) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  return (
    <div className="w-full">
      <div className="h-1.5 w-full rounded-full bg-gray-200">
        <div
          className="h-1.5 rounded-full"
          style={{
            width: `${pct}%`,
            background: 'linear-gradient(90deg, #60a5fa, #34d399)',
          }}
        />
      </div>
      <div className="mt-1 flex justify-between text-[10px] text-gray-500">
        <span>{label}</span>
        <span>{value}</span>
      </div>
    </div>
  );
}

function HourCard({ row }) {
  const time = row.time.split(' ')[1]?.slice(0, 5) ?? row.time;
  return (
    <div className="rounded-2xl border p-3 bg-white/70 backdrop-blur">
      <div className="flex items-center justify-between">
        <div className="font-semibold text-gray-800">{time}</div>
        <Badge>🌧️ {row.precip} mm</Badge>
      </div>
      <div className="mt-2 grid grid-cols-2 gap-3">
        <MiniBar value={row.temp} max={40} label="°C" />
        <MiniBar value={row.wind} max={20} label="km/h" />
      </div>
    </div>
  );
}

function HoursTable({ rows }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-[640px] w-full text-sm">
        <thead>
          <tr className="text-left text-gray-600">
            <th className="py-2 pr-3">Time</th>
            <th className="py-2 pr-3">Temp (°C)</th>
            <th className="py-2 pr-3">Precip (mm)</th>
            <th className="py-2 pr-3">Wind (km/h)</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="border-t">
              <td className="py-2 pr-3 font-medium text-gray-800">{r.time}</td>
              <td className="py-2 pr-3">{r.temp}</td>
              <td className="py-2 pr-3">{r.precip}</td>
              <td className="py-2 pr-3">{r.wind}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Header({ loc }) {
  return (
    <div className="relative overflow-hidden rounded-3xl border bg-gradient-to-tr from-sky-100 via-indigo-100 to-emerald-100 p-6">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(59,130,246,.25),transparent_50%)]" />
      <div className="relative z-10 flex flex-wrap items-center gap-3">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          Weather Now — Public Dashboard
        </h1>
        <div className="ml-auto flex flex-wrap gap-2">
          <Badge>📍 {loc.preset}</Badge>
          <Badge>
            🧭 {loc.latitude.toFixed(4)}, {loc.longitude.toFixed(4)}
          </Badge>
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
    <div className="inline-flex rounded-full border bg-white/70 p-1">
      {options.map((o) => (
        <button
          key={o.id}
          onClick={() => onChange(o.id)}
          className={`px-3 py-1 text-sm rounded-full transition ${
            value === o.id ? 'bg-gray-900 text-white' : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

/* ------------------------------- Main Page ------------------------------- */
function WeatherNowRedesigned({ data = demoData }) {
  const [view, setView] = useState('dashboard');

  const minTemp = useMemo(() => Math.min(...data.hours.map((h) => h.temp)), [data.hours]);
  const maxTemp = useMemo(() => Math.max(...data.hours.map((h) => h.temp)), [data.hours]);

  return (
    <div className="mx-auto max-w-6xl p-4 sm:p-6 space-y-6 bg-gradient-to-b from-slate-50 to-white">
      <Header loc={data.location} />

      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600">
          Same data, brand new layout. Min/Max next hours: <b>{minTemp}–{maxTemp}°C</b>
        </div>
        <LayoutToggle value={view} onChange={setView} />
      </div>

      {view === 'dashboard' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Current */}
          <Section title="Current Conditions" action={<Badge>Updated now</Badge>}>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <Stat label="Temperature" value={data.current.temperature} unit="°C" hint="Air temperature" />
              <Stat label="Humidity" value={data.current.humidity} unit="%" hint="Relative humidity" />
              <Stat label="Precipitation" value={data.current.precipitation} unit="mm" hint="Rain in last hour" />
              <Stat label="Wind" value={data.current.windSpeed} unit="km/h" hint={`Direction ${data.current.windDir}`} />
            </div>
          </Section>

          {/* Highlights */}
          <Section title="Next Hours (Highlights)" action={<Badge>Local time</Badge>}>
            <div className="grid grid-cols-2 gap-3">
              {data.hours.slice(0, 4).map((row, i) => (
                <HourCard key={i} row={row} />
              ))}
            </div>
          </Section>

          {/* Location */}
          <Section title="Location">
            <div className="grid grid-cols-1 gap-3 text-sm">
              <div className="rounded-xl border p-3 bg-white/60">
                <div className="text-gray-500">Preset</div>
                <div className="font-semibold">{data.location.preset}</div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl border p-3 bg-white/60">
                  <div className="text-gray-500">Latitude</div>
                  <div className="font-semibold">{data.location.latitude}</div>
                </div>
                <div className="rounded-xl border p-3 bg-white/60">
                  <div className="text-gray-500">Longitude</div>
                  <div className="font-semibold">{data.location.longitude}</div>
                </div>
              </div>
              <div className="rounded-xl border p-3 bg-white/60">
                <div className="text-gray-500">Timezone</div>
                <div className="font-semibold">{data.location.timezone}</div>
              </div>
              <div className="flex gap-2">
                <button className="rounded-xl bg-gray-900 text-white px-3 py-2 text-sm">Refresh</button>
                <a href="#" className="rounded-xl border px-3 py-2 text-sm">API Docs ↗</a>
              </div>
            </div>
          </Section>
        </div>
      )}

      {view === 'cards' && (
        <Section title="Hourly Cards">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.hours.map((row, i) => (
              <HourCard key={i} row={row} />
            ))}
          </div>
        </Section>
      )}

      {view === 'table' && (
        <Section title="Hourly Table">
          <HoursTable rows={data.hours} />
        </Section>
      )}

      <footer className="pb-6 text-center text-xs text-gray-500">
        © Weather Now — Redesigned layout. Built with React + Tailwind. Data unchanged.
      </footer>
    </div>
  );
}

export default function Page() {
  return <WeatherNowRedesigned />;
}
