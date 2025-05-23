"use client";

import { useState, useEffect } from "react";
import GraphQLDataTable from "@/components/EventsTable";

export default function GraphQLFetcher() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const query = `
    query {
      EVM(dataset: combined, network: arbitrum) {
        Events(
          where: {
            Log: {
              Signature: {
                Name: { in: ["RollupInitialized", "RollupCreated"] }
              }
            }
          }
          orderBy: { descending: Block_Time }
        ) {
          Block {
            Time
            Number
          }
          Arguments {
            Name
            Value {
              ... on EVM_ABI_Address_Value_Arg {
                address
              }
              ... on EVM_ABI_BigInt_Value_Arg {
                bigInteger
              }
            }
          }
          Transaction {
            Hash
          }
        }
      }
    }
  `;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/graphql", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();
        if (result?.EVM?.Events && Array.isArray(result.EVM.Events)) {
          setData(result.EVM.Events);
        } else {
          throw new Error("Invalid data structure");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // console.log(data, "All data log");

  return (
    <div>
      {error && <p style={{ color: "red" }}>Error: {error}</p>}
      {/* {data ? (
        <GraphQLDataTable data={data || []} loading={loading} />
      ) : (
        <p className="flex place-content-center text-lg mt-28">
          Query may take some time
        </p>
      )} */}
      <GraphQLDataTable data={data || []} loading={loading} />
    </div>
  );
}
