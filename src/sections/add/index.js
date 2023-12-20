"use client";

import { domain } from "@/constraints/directory";
import { Button, Grid, TextField, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { getColumnOrderList } from "./table-header";
import { isNumber } from "@mui/x-data-grid/internals";
import { useRouter } from "next/navigation";
import { Add, ArrowLeft, Save } from "@mui/icons-material";
import Swal from "sweetalert2";
import ProductItemForm from "./product-item-form";

export default function AddOrder() {
  const [isEdit, setIsEdit] = useState(false);

  const [orderId, setOrderId] = useState(null);
  const [open, setOpen] = useState(false);
  const [products, setProducts] = useState([]);

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [itemList2Edit, setItemList2Edit] = useState(null);

  const [total, setTotal] = useState(0);
  const [number, setNumber] = useState("");
  const [date, setDate] = useState(new Date().toISOString());
  const [itemList, setItemList] = useState([]);

  const [quantity, setQuantity] = useState(0);

  const [message, setMessage] = useState("");
  const [messageModal, setMessageModal] = useState("");

  useEffect(() => {
    fetch(domain + "/api/product")
      .then((res) => res.json())
      .then((res) => setProducts(res));
  }, []);

  useEffect(() => {
    setTotal(itemList.reduce((a, b) => (a += Number(b.total)), 0));
  }, [itemList]);

  useEffect(() => {
    const [domain, id] = window.location.href.split("/add-order/");
    if (isNumber(Number(id))) setIsEdit(true);
  }, []);

  useEffect(() => {
    if (!isEdit && products.length < 1) return;

    const [, id] = window.location.href.split("/add-order/");
    setOrderId(id);

    fetch(domain + "/api/order/" + id)
      .then((res) => res.json())
      .then((res) => {
        setNumber(res.number);
        setDate(res.date);
        setItemList(
          res.itemList.map((item, num) => {
            return {
              ...products.filter((product) => product.id == item.ProductId)[0],
              ...item,
              num: num + 1,
            };
          })
        );
      });
  }, [isEdit, products]);
  console.log(itemList);
  function handleAddToList() {
    if (!selectedProduct || quantity <= 0) {
      setMessageModal("Select a product and input a quantity");
      return;
    }
    if (itemList.filter((i) => i.name == selectedProduct.name).length > 0) {
      setMessageModal("This product is alreay in the list");
      return;
    }

    setMessageModal("");
    setMessage("");
    setItemList([
      ...itemList.slice(),
      {
        num: itemList.length + 1,
        ...(isEdit ? {} : { id: itemList.length + 1 }),
        product: selectedProduct.id,
        name: selectedProduct.name,
        price: selectedProduct.price,
        quantity,
        total: selectedProduct.price * quantity,
      },
    ]);
    setOpen(false);
  }

  async function handleDeleteItemList(id) {
    setMessage("");
    const res = await Swal.fire({
      title: "Are you sure?",
      text: "This action is will delete the item from the list",
      icon: "question",
      showCancelButton: true,
    });
    if (res.isConfirmed) setItemList(itemList.filter((item) => item.id != id));
  }

  function handleEditItemList(row) {
    setOpen(true);
    setQuantity(row.quantity);
    setSelectedProduct(products.find((product) => product.id == row.ProductId));
    setItemList2Edit(row);
  }

  function handleChangeItemList(id) {
    const localItems = itemList.slice();
    const item = localItems.find((item) => item.id == id);
    item.quantity = quantity;
    item.total = item.price * item.quantity;

    setItemList(localItems);
  }

  function handleAddOrder() {
    if (!number) {
      setMessage("# Order is required");
      return;
    }
    if (itemList.length == 0) {
      setMessage("Products in list are required");
      return;
    }

    setMessage("");
    fetch(domain + "/api/order" + (isEdit ? "/" + orderId : ""), {
      method: isEdit ? "PUT" : "POST",
      body: JSON.stringify({
        number,
        date,
        items: itemList.length,
        itemList,
      }),
      headers: {
        "Content-type": "application/json",
      },
    }).then((res) => {
      if (res.ok) router.push("/my-orders");
    });
  }

  const columns = getColumnOrderList({
    handleDelete: handleDeleteItemList,
    ...(isEdit ? { handleEdit: handleEditItemList } : {}),
  });
  const router = useRouter();

  return (
    <>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h3">
            {isEdit ? "Edit Order" : "Add Order"}
          </Typography>
          <Button
            onClick={() => router.push("/my-orders")}
            startIcon={<ArrowLeft />}
          >
            Go back
          </Button>
        </Grid>
        <Grid item xs={6}>
          <TextField
            disabled
            label="Date"
            value={new Date(date).toLocaleDateString()}
            fullWidth
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            fullWidth
            value={number}
            label="# Order"
            onChange={(e) => setNumber(e.target.value)}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            disabled
            label="# products"
            fullWidth
            value={itemList.length}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField disabled label="Final Price" fullWidth value={total} />
        </Grid>

        {!isEdit && (
          <Grid item xs={12}>
            <Button
              variant="contained"
              onClick={() => setOpen(true)}
              startIcon={<Add />}
            >
              ADD PRODUCT
            </Button>
          </Grid>
        )}

        <Grid item xs={12}>
          <DataGrid
            {...{ columns, rows: itemList }}
            disableColumnFilter
            disableColumnMenu
            disableColumnSelector
            hideFooterPagination
            disableRowSelectionOnClick
          />
        </Grid>

        <Grid item xs={12}>
          <Typography variant="h6" color={"error"}>
            {message}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Button
            variant="contained"
            color="success"
            fullWidth
            sx={{ height: "100%" }}
            onClick={handleAddOrder}
            startIcon={<Save />}
          >
            {isEdit ? "SAVE CHANGES" : "ADD ORDER"}
          </Button>
        </Grid>
      </Grid>

      <ProductItemForm
        {...{
          open,
          setOpen,
          products,
          messageModal,
          handleAddToList,
          selectedProduct,
          setSelectedProduct,
          quantity,
          setQuantity,
          isEdit,
          itemList2Edit,
          setItemList2Edit,
          handleChangeItemList,
        }}
      />
    </>
  );
}
