import { Delete, Edit } from "@mui/icons-material";
import { Button, IconButton } from "@mui/material";

export function getColumnOrderList({ handleDelete, handleEdit }) {
  return [
    {
      field: "num",
      headerName: "#",
      flex: 1,
    },
    {
      field: "name",
      headerName: "Name",
      flex: 1,
    },
    {
      field: "price",
      headerName: "Unit Price",
      flex: 1,
    },
    {
      field: "quantity",
      headerName: "Quantity",
      flex: 1,
    },
    {
      field: "total",
      headerName: "Total",
      flex: 1,
    },
    {
      field: "options",
      headerName: "Option",
      flex: 1,
      sortable: false,
      renderCell: ({ row }) => (
        <>
          {handleEdit && (
            <IconButton onClick={() => handleEdit(row)}>
              <Edit />
            </IconButton>
          )}
          <IconButton onClick={() => handleDelete(row.id)}>
            <Delete color="error" />
          </IconButton>
        </>
      ),
    },
  ];
}
