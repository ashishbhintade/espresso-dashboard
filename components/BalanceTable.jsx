import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Box } from "@mui/material";

const formatBalance = (balance) => {
  return parseFloat(balance).toFixed(4);
};

const BalanceTable = ({ balanceData }) => {
  const rows = balanceData.map((item, index) => ({
    id: index + 1,
    currencyName: item.Currency.Name,
    nativeBalance: formatBalance(item.Native_Balance),
  }));

  const columns = [
    { field: "currencyName", headerName: "Currency Name", width: 250 },
    { field: "nativeBalance", headerName: "Native Balance", width: 150 },
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
                pageSize: 5,
              },
            },
          }}
          disableSelectionOnClick
          pageSizeOptions={[5]}
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

export default BalanceTable;
