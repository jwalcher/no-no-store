
// export const dynamic = “force-dynamic”; // enabling this: data is still cached indefinitely
// export const fetchCache = "force-no-store";   // enabling this: data is still cached indefinately
// export const revalidate = 10 //  enabling this: data is revalidated after ~10 secs

export default async function Home() {
  const res = await fetch(
    "https://www.timeapi.io/api/Time/current/zone?timeZone=Europe/Amsterdam",
    // { cache: "no-store" } // enabling this: data is not cached
  );

  const data = (await res.json()) as { hour: number; minute: number; seconds: number };

  return (
    <h1>
      Time in Amsterdam is {data.hour}:{data.minute}:{data.seconds}
    </h1>
  );
}
