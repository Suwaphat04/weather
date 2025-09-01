import { NextResponse } from 'next/server';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const lat = parseFloat(searchParams.get('lat') ?? '13.7563'); // Bangkok default
  const lon = parseFloat(searchParams.get('lon') ?? '100.5018');
  const tz = searchParams.get('tz') ?? 'Asia/Bangkok';

  // Build Open-Meteo URL
  const params = new URLSearchParams({
    latitude: String(lat),
    longitude: String(lon),
    timezone: tz,
    hourly: [
      'temperature_2m',
      'precipitation',
      'wind_speed_10m'
    ].join(','),
    current: [
      'temperature_2m',
      'relative_humidity_2m',
      'apparent_temperature',
      'precipitation',
      'weather_code',
      'wind_speed_10m',
      'wind_direction_10m'
    ].join(','),
  });

  const url = `https://api.open-meteo.com/v1/forecast?${params.toString()}`;

  try {
    const res = await fetch(url, { next: { revalidate: 600 } }); // cache for 10 minutes on the edge
    if (!res.ok) {
      const txt = await res.text();
      return NextResponse.json({ error: true, status: res.status, details: txt }, { status: res.status });
    }
    const data = await res.json();
    return NextResponse.json(data, { status: 200, headers: { 'Cache-Control': 's-maxage=600, stale-while-revalidate=60' } });
  } catch (err) {
    return NextResponse.json({ error: true, message: String(err) }, { status: 500 });
  }
}
