"use client";

import { Button, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { getColumnsOrders } from "./table-header";
import { useEffect, useState } from "react";
import { domain } from "@/constraints/directory";
import { useRouter } from "next/navigation";
import { Add, ArrowLeft } from "@mui/icons-material";
import Swal from "sweetalert2";
import AddProduct from "./add-form";

export default function Products() {
  const columns = getColumnsOrders({ handleDelete, handleEdit });
  const [rows, setRows] = useState([]);
  const [open, setOpen] = useState(false);
  const [toEdit, setToEdit] = useState(null);

  const router = useRouter();

  useEffect(() => {
    fetch(domain + "/api/product")
      .then((res) => res.json())
      .then((res) => {
        setRows(res.filter((r) => r.visible));
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
      let deleted = await fetch(domain + "/api/product/" + id, {
        method: "DELETE",
      });
      if (deleted.ok) {
        deleted = await deleted.json();
        setRows(rows.filter((row) => row.id != id));
      }
    }
  }

  function handleEdit(product) {
    setToEdit(product);
    setOpen(true);
  }

  function handleNewProduct(product) {
    setRows([...rows, product]);
  }
  function handleChangeProduct(product) {
    const localRows = rows.slice();
    const temp = localRows.find((r) => r.id == product.id);
    Object.assign(temp, product);

    setRows(localRows);
  }

  return (
    <>
      <Typography variant="h3" mb={3}>
        Products
      </Typography>
      <Button
        variant="contained"
        sx={{ mb: 3 }}
        onClick={() => setOpen(true)}
        startIcon={<Add />}
      >
        ADD PRODUCT
      </Button>
      <Button
        onClick={() => router.push("/my-orders")}
        sx={{ mb: 3 }}
        startIcon={<ArrowLeft />}
      >
        Go back
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
      <AddProduct
        {...{
          open,
          handleClose: () => {
            setOpen(false);
            setTimeout(() => setToEdit(null), 500);
          },
          handleNewProduct,
          handleChangeProduct,
          toEdit,
        }}
      />
    </>
  );
}
