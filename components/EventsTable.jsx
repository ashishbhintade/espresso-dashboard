import { DataGrid } from "@mui/x-data-grid";
import { Box } from "@mui/material";
import { useRouter } from "next/navigation";

const GraphQLDataTable = ({ data, loading }) => {
  const columns = [
    { field: "id", headerName: "ID", width: 90 },
    { field: "rollupAddress", headerName: "Rollup Address", width: 450 },
    { field: "blockTime", headerName: "Block Time", width: 250 },
    { field: "chainId", headerName: "Chain ID", width: 150 },
  ];

  const extractData = (data) => {
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

      if (!transactionsMap.has(txHash)) {
        transactionsMap.set(txHash, {
          id: idCounter++,
          blockTime,
          rollupAddress,
          chainId,
          txHash,
        });
      } else {
        const existing = transactionsMap.get(txHash);
        transactionsMap.set(txHash, {
          id: existing.id,
          blockTime: existing.blockTime || blockTime,
          rollupAddress: existing.rollupAddress || rollupAddress,
          chainId: existing.chainId || chainId,
          txhash: txHash,
        });
      }
    });

    return Array.from(transactionsMap.values());
  };

  const router = useRouter();

  const handleRowClick = (params) => {
    if (params.row.txhash) {
      router.push(`/txhash/${params.row.txhash}`);
    }
  };

  const rows = [...extractData(data)];
  rows.pop();

  // console.log(rows);

  return (
    <div className="flex place-content-center">
      <Box sx={{ height: "500", width: { lg: "100%", xl: "70%" } }}>
        <DataGrid
          rows={rows}
          columns={columns}
          onRowClick={handleRowClick}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 10,
              },
            },
          }}
          disableSelectionOnClick
          pageSizeOptions={[10]}
          pagination
          sx={{
            cursor: "pointer",
            color: "white",
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: "#333",
              color: "black",
            },
            "& .MuiDataGrid-cell": {
              color: "black",
            },
            "& .MuiDataGrid-row": {
              backgroundColor: "white",
              "&:hover": {
                backgroundColor: "#f5f5f5", // Light gray on hover
              },
            },
            "& .MuiDataGrid-overlay": {
              backgroundColor: "rgba(0, 0, 0, 0.3)",
            },
            "& .MuiSkeleton-root": {
              backgroundColor: "#545454",
            },
            "& .MuiTablePagination-root, & .MuiTablePagination-caption, & .MuiTablePagination-selectIcon, & .MuiSvgIcon-root":
              {
                color: "black",
              },
            "&:hover": {
              backgroundColor: "rgba(0, 0, 0, 0.3)",
            },
            "& .MuiDataGrid-footerContainer": {
              backgroundColor: "white", // Ensures footer remains white
              "&:hover": {
                backgroundColor: "white", // Prevents hover color change
              },
            },
          }}
          loading={loading}
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
