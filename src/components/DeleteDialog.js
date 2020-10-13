import React from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@material-ui/core";

const DeleteDialog = ({
  title,
  subtitle,
  isOpen,
  onClose,
  onSubmit,
  submitButtonLabel,
}) => {
  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {subtitle}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Отмена
        </Button>
        <Button
          onClick={onSubmit}
          color="primary"
          autoFocus
        >
          {submitButtonLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteDialog;