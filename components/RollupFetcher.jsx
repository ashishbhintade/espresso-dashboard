"use client";

import { useState, useEffect } from "react";
import RollupList from "@/components/RollupList";
import TransferTable from "@/components/InboxTable";
import BalanceTable from "@/components/BalanceTable";

export default function RollupFetcher(txhash) {
  const [rollupData, setRollupData] = useState(null);
  const [inboxData, setInboxData] = useState(null);
  const [outboxData, setOutboxData] = useState(null);
  const [balanceData, setBalanceData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  //Get information about rollups
  useEffect(() => {
    if (!txhash) return;

    const fetchData = async () => {
      try {
        //Rollup Query
        const RollupQuery = `
        {
            EVM(dataset: combined, network: arbitrum) {
            Events(
                where: {Log: {Signature: {Name: {is: "RollupCreated"}}}, Transaction: {Hash: {is: "${txhash.txhash}"}}}
                orderBy: {descending: Block_Time}
                limit: {count: 10}
            ) {
                Arguments {
                Name
                Value {
                    ... on EVM_ABI_Address_Value_Arg {
                    address
                    }
                }
                }
            }
            }
        }
        `;
        const response = await fetch("/api/graphql", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query: RollupQuery }),
        });
        // console.log(txhash.txhash);

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();
        if (result?.EVM?.Events && Array.isArray(result.EVM.Events)) {
          setRollupData(result.EVM.Events[0]);
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
    // console.log(data, "Fetch console");
  }, [txhash]);

  //Get information about bridge into rollup
  useEffect(() => {
    if (!rollupData) return;

    const inboxAddress = rollupData?.Arguments?.[2]?.Value?.address;
    // console.log(inboxAddress);
    if (!inboxAddress) {
      setError("Address not found in first query response");
      return;
    }

    const fetchInboxData = async () => {
      try {
        const InboxQuery = `
        query MyQuery {
            EVM(network: arbitrum) {
              Transfers(
                where: {Transaction: {To: {is: "${inboxAddress}"}}}
              ) {
                Transfer {
                  Amount
                  Currency {
                    Name
                    Native
                    Symbol
                  }
                  Receiver
                  Sender
                  AmountInUSD
                }
                Transaction {
                  Hash
                }
              }
            }
          }
        `;
        const response = await fetch("/api/graphql", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query: InboxQuery }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();
        if (result?.EVM?.Transfers && Array.isArray(result.EVM.Transfers)) {
          setInboxData(result.EVM.Transfers);
          // console.log(inboxData);
        } else {
          throw new Error("Invalid data structure");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchInboxData();
  }, [rollupData]);

  //Get information about bridge out of rollup
  useEffect(() => {
    if (!rollupData) return;

    const outboxAddress = rollupData?.Arguments?.[2]?.Value?.address;
    // console.log(inboxAddress);
    if (!outboxAddress) {
      setError("Address not found in first query response");
      return;
    }

    const fetchOutboxData = async () => {
      try {
        const OutboxQuery = `
        query MyQuery {
            EVM(network: arbitrum) {
              Transfers(
                where: {Transaction: {To: {is: "${outboxAddress}"}}}
              ) {
                Transfer {
                  Amount
                  Currency {
                    Name
                    Native
                    Symbol
                  }
                  Receiver
                  Sender
                  AmountInUSD
                }
                Transaction {
                  Hash
                }
              }
            }
          }
        `;
        const outboxResponse = await fetch("/api/graphql", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query: OutboxQuery }),
        });

        if (!outboxResponse.ok) {
          throw new Error(`HTTP error! Status: ${outboxResponse.status}`);
        }

        const outboxResult = await outboxResponse.json();
        if (
          outboxResult?.EVM?.Transfers &&
          Array.isArray(outboxResult.EVM.Transfers)
        ) {
          setOutboxData(outboxResult.EVM.Transfers);
          // console.log(inboxData);
        } else {
          throw new Error("Invalid data structure");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOutboxData();
  }, [rollupData]);

  //Get information about balance of the rollup
  useEffect(() => {
    if (!rollupData) return;

    const bridgeAddress = rollupData?.Arguments?.[8]?.Value?.address;
    // console.log(inboxAddress);
    if (!bridgeAddress) {
      setError("Address not found in first query response");
      return;
    }

    const fetchBalanceData = async () => {
      try {
        const BalanceQuery = `
        {
          EVM(network: arbitrum, dataset: combined) {
            BalanceUpdates(
              where: {BalanceUpdate: {Address: {is: "${bridgeAddress}"}}}
            ) {
              Currency {
                Name
              }
              Native_Balance: sum(of: BalanceUpdate_Amount)
            }
          }
        }        
        `;
        const balanceResponse = await fetch("/api/graphql", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query: BalanceQuery }),
        });

        if (!balanceResponse.ok) {
          throw new Error(`HTTP error! Status: ${balanceResponse.status}`);
        }

        const balanceResult = await balanceResponse.json();
        if (
          balanceResult?.EVM?.BalanceUpdates &&
          Array.isArray(balanceResult.EVM.BalanceUpdates)
        ) {
          setBalanceData(balanceResult.EVM.BalanceUpdates);
          console.log(balanceData);
          console.log(bridgeAddress);
        } else {
          throw new Error("Invalid data structure");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBalanceData();
  }, [rollupData]);

  return (
    <div>
      <div>
        {error && <p style={{ color: "red" }}>Error: {error}</p>}
        {rollupData ? (
          <RollupList data={rollupData || []} />
        ) : (
          <p className="text-center">Data is being loaded...</p>
        )}
      </div>
      <div className="pt-12">
        <p className="text-lg text-center">Balance Of The Bridge</p>
        {balanceData ? (
          <BalanceTable balanceData={balanceData || []} />
        ) : (
          <p className="text-center">No Balance Data</p>
        )}
      </div>
      <div className="py-12 grid grid-cols-2">
        <div className="w-full">
          <p className="text-lg text-center">All The Inbox Transactions</p>
          {inboxData ? (
            <TransferTable inboxData={inboxData || {}} />
          ) : (
            <p className="text-center">No inbox data</p>
          )}
        </div>
        <div>
          <p className="text-lg text-center">All the outbox transactions</p>
          {outboxData ? (
            <TransferTable inboxData={inboxData || []} />
          ) : (
            <p className="text-center">No inbox data</p>
          )}
        </div>
      </div>
    </div>
  );
}
