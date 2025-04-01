import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Box } from "@mui/material";

const formatAddress = (address) => {
  return `${address.slice(0, 5)}...${address.slice(-5)}`;
};

const formatAmount = (amount) => {
  return parseFloat(amount).toFixed(5);
};

const TransferTable = ({ inboxData }) => {
  const rows = inboxData.map((item, index) => ({
    id: index + 1,
    sender: formatAddress(item.Transfer.Sender),
    receiver: formatAddress(item.Transfer.Receiver),
    amount: formatAmount(item.Transfer.Amount),
  }));

  // Columns configuration for the DataGrid
  const columns = [
    { field: "sender", headerName: "Sender", width: 150 },
    { field: "receiver", headerName: "Receiver", width: 150 },
    { field: "amount", headerName: "Amount", width: 150 },
  ];

  return (
    <div className="p-5">
      <Box
        sx={{
          height: "500",
          width: { sm: "50%", md: "75%", lg: "100%", xl: "100%" },
        }}
      >
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
          }}
          // slotProps={{
          //   loadingOverlay: {
          //     variant: "linear-progress",
          //     noRowsVariant: "skeleton",
          //   },
          // }}
          components={{
            LoadingOverlay: () => (
              <Box
                sx={{
                  height: "100%",
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Skeleton variant="rectangular" width="100%" height={50} />
              </Box>
            ),
          }}
        />
      </Box>
    </div>
  );
};

export default TransferTable;
