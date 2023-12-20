"use client";

import { Button, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { getColumnsOrders } from "./table-header";
import { useEffect, useState } from "react";
import { domain } from "@/constraints/directory";
import { useRouter } from "next/navigation";
import { Add, ViewAgenda } from "@mui/icons-material";
import Swal from "sweetalert2";

export default function MyOrders() {
  const columns = getColumnsOrders({
    handleDelete,
    handleEdit,
    handleChangeStatus,
  });
  const [rows, setRows] = useState([]);

  const router = useRouter();

  useEffect(() => {
    fetch(domain + "/api/order")
      .then((res) => res.json())
      .then((res) => {
        setRows(res);
      });
  }, []);

  async function handleDelete(id) {
    const res = await Swal.fire({
      title: "Are you sure?",
      text: "This action is will delete the item from the list",
      icon: "question",
      showCancelButton: true,
    });

    if (res.isConfirmed) {
      let deleted = await fetch(domain + "/api/order/" + id, {
        method: "DELETE",
      });
      if (deleted.ok) {
        deleted = await deleted.json();
        setRows(rows.filter((row) => row.id != id));
      }
    }
  }

  function handleEdit(id) {
    router.push("/add-order?id=" + id);
  }

  async function handleChangeStatus(order, newState) {
    let localRows = rows.slice();
    let temp = localRows.find((r) => r.id == order.id);
    temp.state = newState;

    await fetch(domain + "/api/order/" + order.id, {
      method: "PATCH",
      body: JSON.stringify({ state: newState }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    setRows(localRows);
  }

  return (
    <>
      <Typography variant="h3" mb={3}>
        My Orders
      </Typography>
      <Button
        variant="contained"
        sx={{ mb: 3 }}
        onClick={() => router.push("/add-order")}
        startIcon={<Add />}
      >
        ADD ORDER
      </Button>
      <Button
        sx={{ mb: 3 }}
        onClick={() => router.push("/products")}
        startIcon={<ViewAgenda />}
      >
        PRODUCTS
      </Button>
      <DataGrid
        columns={columns}
        rows={rows}
        disableColumnFilter
        disableColumnMenu
        disableColumnSelector
        hideFooterPagination
        disableRowSelectionOnClick
      />
    </>
  );
}
