import { DataGrid } from "@mui/x-data-grid";
import { Box } from "@mui/material";

const GraphQLDataTable = ({ data }) => {
  const columns = [
    { field: "id", headerName: "ID", width: 90 },
    { field: "rollupAddress", headerName: "Rollup Address", width: 400 },
    { field: "blockTime", headerName: "Block Time", width: 200 },
    { field: "chainId", headerName: "Chain ID", width: 150 },
  ];

  const extractData = (data) => {
    // if (!data.EVM || !Array.isArray(data.EVM.Events)) {
    //     console.error("Invalid data structure: Missing EVM or Events array");
    //     return [];
    // }

    const events = data;
    const transactionsMap = new Map();
    let idCounter = 1;

    events.forEach((event) => {
      if (
        !event.Transaction ||
        !event.Transaction.Hash ||
        !event.Block ||
        !event.Block.Time
      ) {
        console.warn(
          "Skipping event due to missing Transaction or Block data:",
          event
        );
        return;
      }

      const txHash = event.Transaction.Hash;
      const blockTime = event.Block.Time;
      let rollupAddress = null;
      let chainId = null;

      if (Array.isArray(event.Arguments)) {
        event.Arguments.forEach((arg) => {
          if (arg.Name === "rollupAddress" && arg.Value && arg.Value.address) {
            rollupAddress = arg.Value.address;
          } else if (
            arg.Name === "chainId" &&
            arg.Value &&
            arg.Value.bigInteger
          ) {
            chainId = arg.Value.bigInteger;
          }
        });
      }

      // if (!rollupAddress || !chainId) {
      //     return; // Skip if either rollupAddress or chainId is missing
      // }

      if (!transactionsMap.has(txHash)) {
        transactionsMap.set(txHash, {
          id: idCounter++,
          blockTime,
          rollupAddress,
          chainId,
        });
      } else {
        const existing = transactionsMap.get(txHash);
        transactionsMap.set(txHash, {
          id: existing.id,
          blockTime: existing.blockTime || blockTime,
          rollupAddress: existing.rollupAddress || rollupAddress,
          chainId: existing.chainId || chainId,
        });
      }
    });

    return Array.from(transactionsMap.values());
  };

  const rows = [...extractData(data)];
  rows.pop();
  //   for (let i = 0; i < data.length; i += 2) {
  //     const rollupEvent = data[i];
  //     const chainEvent = data[i + 1] || {};
  //     rows.push({
  //       id: i / 2 + 1,
  //       rollupAddress:
  //         rollupEvent.Arguments.find((arg) => arg.Name === "rollupAddress")?.Value
  //           ?.address || "N/A",
  //       blockTime: rollupEvent.Block.Time || "N/A",
  //       chainId:
  //         chainEvent.Arguments?.find((arg) => arg.Name === "chainId")?.Value
  //           ?.bigInteger || "N/A",
  //     });
  //   }

  //   console.log(rows);

  return (
    <div className="flex place-content-center">
      <Box sx={{ height: "100%", width: { lg: "100%", xl: "70%" } }}>
        <DataGrid
          rows={rows}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 10,
              },
            },
          }}
          pageSizeOptions={[10]}
          disableSelectionOnClick
          pagination
          sx={{
            color: "white",
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: "#333",
              color: "black",
            },
            "& .MuiDataGrid-cell": {
              color: "white",
            },
            "& .MuiDataGrid-row": {
              backgroundColor: "#0a0a0a",
            },
            "& .MuiDataGrid-overlay": {
              backgroundColor: "rgba(0, 0, 0, 0.3)",
            },
            "& .MuiSkeleton-root": {
              backgroundColor: "#545454",
            },
            "& .MuiTablePagination-root, & .MuiTablePagination-caption, & .MuiTablePagination-selectIcon, & .MuiSvgIcon-root":
              {
                color: "white",
              },
          }}
          slotProps={{
            loadingOverlay: {
              variant: "linear-progress",
              noRowsVariant: "skeleton",
            },
          }}
        />
      </Box>
    </div>
  );
};

export default GraphQLDataTable;
