import { domain } from "@/constraints/directory";
import { Save } from "@mui/icons-material";
import {
  Button,
  Dialog,
  DialogContent,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import { useRef } from "react";

export default function AddProduct({
  open,
  handleClose,
  handleNewProduct,
  handleChangeProduct,
  toEdit,
}) {
  const formRef = useRef();
  function handleSubmit(e) {
    e.preventDefault();
    const fd = new FormData(formRef.current);
    console.log({ name: fd.get("name"), price: fd.get("price") });
    fetch(domain + "/api/product" + (toEdit ? "/" + toEdit.id : ""), {
      method: toEdit ? "PUT" : "POST",
      body: JSON.stringify({ name: fd.get("name"), price: fd.get("price") }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((res) => {
        handleClose();
        if (toEdit) handleChangeProduct(res);
        else handleNewProduct(res);
      });
  }

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogContent>
        <Grid
          container
          component={"form"}
          spacing={2}
          method="POST"
          ref={formRef}
          onSubmit={handleSubmit}
        >
          <Grid item xs={12}>
            <Typography variant="h6">
              {toEdit ? "Edit" : "Add"} product
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <TextField
              name="name"
              label="Name"
              fullWidth
              defaultValue={toEdit?.name}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              name="price"
              label="Price"
              fullWidth
              defaultValue={toEdit?.price}
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              type="submit"
              startIcon={<Save />}
              fullWidth
              variant="contained"
            >
              {toEdit ? "Save" : "Add"} Product
            </Button>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
}
