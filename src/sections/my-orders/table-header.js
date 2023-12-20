import { Delete, Edit } from "@mui/icons-material";
import { IconButton, Menu, MenuItem, Select } from "@mui/material";

export function getColumnsOrders({
  handleDelete = () => {},
  handleEdit = () => {},
  handleChangeStatus = () => {},
}) {
  return [
    {
      field: "id",
      headerName: "ID",
    },
    {
      field: "number",
      headerName: "Order #",
      flex: 1,
    },
    {
      field: "date",
      headerName: "Date",
      flex: 1,
      renderCell: (params) => new Date(params.value).toLocaleDateString(),
    },
    {
      field: "items",
      headerName: "# Products",
      flex: 1,
    },
    {
      field: "options",
      headerName: "options",
      flex: 1,
      renderCell: ({ row }) => (
        <>
          <IconButton
            onClick={() => handleEdit(row.id)}
            disabled={row.state == 2}
          >
            <Edit />
          </IconButton>
          <IconButton
            onClick={() => handleDelete(row.id)}
            disabled={row.state == 2}
          >
            <Delete color="error" />
          </IconButton>
        </>
      ),
      sortable: false,
    },

    {
      field: "state",
      headerName: "state",
      flex: 1,
      renderCell: ({ value, row }) => (
        <Select
          disabled={value == 2}
          value={value}
          fullWidth
          onChange={(e) => handleChangeStatus(row, e.target.value)}
        >
          <MenuItem value={0}>Pending</MenuItem>
          <MenuItem value={1}>In progress</MenuItem>
          <MenuItem value={2}>Completed</MenuItem>
        </Select>
      ),
      sortable: false,
    },
  ];
}
