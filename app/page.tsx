// export const dynamic = “force-dynamic”; // enabling this: data is still cached indefinitely
// export const fetchCache = "force-no-store";   // enabling this: data is still cached indefinately
// export const revalidate = 0; //  enabling this: data is revalidated after ~10 secs

import { ApolloClient, InMemoryCache, HttpLink, from, ApolloLink, gql } from "@apollo/client";
import { onError } from "@apollo/client/link/error";
import moment from "moment";

const client = new ApolloClient({
  uri: "http://localhost:1337/graphql",
  cache: new InMemoryCache(),
  ssrMode: typeof window === "undefined",
  name: "react-web-client",
  connectToDevTools: true,
  // caching be done by Next
  defaultOptions: {
    watchQuery: {
      fetchPolicy: "no-cache",
      errorPolicy: "ignore",
    },
    query: {
      fetchPolicy: "no-cache",
      errorPolicy: "all",
    },
  },
});

async function getData() {
  const { data, error } = await client.query({
    query: gql`
      {
        front {
          data {
            id
            attributes {
              updatedAt
            }
          }
        }
      }
    `,
  });
  return data;
}

export default async function Home() {
  const res = await fetch(
    "https://www.timeapi.io/api/Time/current/zone?timeZone=Europe/Amsterdam"
    // { cache: "no-store" } // enabling this: data is not cached
  );

  const data = (await res.json()) as { hour: number; minute: number; seconds: number };

  const strapidata = await getData();

  return (
    <>
      <h1>
        Time in Amsterdam is {data.hour}:{data.minute}:{data.seconds}
      </h1>
      {/* <p>{JSON.stringify(strapidata)}</p> */}
      <h1>
        Strapi updatedAt:&nbsp;
        {moment(strapidata.front.data.attributes.updatedAt as string).format("HH:mm:ss")}
      </h1>
    </>
  );
}
