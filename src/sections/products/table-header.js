import { Delete, Edit } from "@mui/icons-material";
import { IconButton } from "@mui/material";

export function getColumnsOrders({
  handleDelete = () => {},
  handleEdit = () => {},
}) {
  return [
    {
      field: "id",
      headerName: "ID",
    },
    {
      field: "name",
      headerName: "Product",
      flex: 1,
    },
    {
      field: "price",
      headerName: "Unit price",
      flex: 1,
    },
    {
      field: "options",
      headerName: "options",
      flex: 1,
      renderCell: ({ row }) => (
        <>
          <IconButton onClick={() => handleEdit(row)}>
            <Edit />
          </IconButton>
          <IconButton onClick={() => handleDelete(row.id)}>
            <Delete color="error" />
          </IconButton>
        </>
      ),
      sortable: false,
    },
  ];
}
