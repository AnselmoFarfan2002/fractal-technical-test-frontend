"use client";

import {
  Dialog,
  DialogContent,
  FormControl,
  MenuItem,
  Grid,
  Select,
  Typography,
  TextField,
  Button,
  FormLabel,
  InputLabel,
} from "@mui/material";

export default function ProductItemForm({
  isEdit,
  open,
  setOpen,
  products,
  messageModal,
  handleAddToList,
  selectedProduct,
  setSelectedProduct,
  quantity,
  setQuantity,
  itemList2Edit = null,
  setItemList2Edit,
  handleChangeItemList,
}) {
  function handleClose() {
    setOpen(false);
    setTimeout(() => {
      setItemList2Edit(null);
      setQuantity(0);
      setSelectedProduct(null);
    }, 500);
  }

  function handleEdit() {
    handleChangeItemList(itemList2Edit.id);
    handleClose();
  }

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogContent>
        <Grid container spacing={3}>
          <Grid item>
            <Typography variant="h6">
              {!itemList2Edit
                ? "Add product to list"
                : "Edit product from list"}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel sx={{ bgcolor: "white" }}>Product</InputLabel>
              <Select
                disabled={Boolean(itemList2Edit)}
                value={selectedProduct}
                onChange={(e) => setSelectedProduct(e.target.value)}
              >
                {products
                  .filter((product) => isEdit || product.visible)
                  .map((product, i) => (
                    <MenuItem
                      key={product.id}
                      value={product}
                    >{`${product.name}: $${product.price}`}</MenuItem>
                  ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <TextField
              type="number"
              label="Quantity"
              fullWidth
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body2" color={"error"}>
              {messageModal}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="contained"
              color="info"
              fullWidth
              sx={{ height: "100%" }}
              onClick={itemList2Edit ? handleEdit : handleAddToList}
            >
              {itemList2Edit ? "Save changes" : "Add to list"}
            </Button>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
}
