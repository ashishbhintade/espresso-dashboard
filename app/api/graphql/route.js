import { ApolloClient, InMemoryCache, HttpLink, gql } from "@apollo/client";
import { NextResponse } from "next/server";

function stripTypename(obj) {
  if (Array.isArray(obj)) {
    return obj.map(stripTypename);
  } else if (obj !== null && typeof obj === "object") {
    const newObj = {};
    for (const key in obj) {
      if (key !== "__typename") {
        newObj[key] = stripTypename(obj[key]);
      }
    }
    return newObj;
  }
  return obj;
}

export async function POST(request) {
  try {
    const { query, variables } = await request.json();

    const client = new ApolloClient({
      link: new HttpLink({
        uri: "https://streaming.bitquery.io/graphql",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.BEARER_TOKEN}`,
        },
      }),
      cache: new InMemoryCache(),
    });

    const { data } = await client.query({
      query: gql`
        ${query}
      `,
      variables,
    });

    const cleanedData = stripTypename(data);

    return NextResponse.json(cleanedData);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
