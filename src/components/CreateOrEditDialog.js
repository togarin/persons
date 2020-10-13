import React from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
} from "@material-ui/core";

const CreateOrEditDialog = ({
  title,
  subtitle,
  isOpen,
  onClose,
  isSubmitDisabled,
  firstName,
  lastName,
  onFirstNameChange,
  onLastNameChange,
  onSubmit,
  submitButtonLabel,
}) => {
    return (
  <Dialog open={isOpen} onClose={onClose} aria-labelledby="form-dialog-title">
    <DialogTitle id="form-dialog-title">{title}</DialogTitle>
    <DialogContent>
      <DialogContentText>{subtitle}</DialogContentText>
      <TextField
        disabled={isSubmitDisabled}
        autoFocus
        margin="dense"
        id="createfirstname"
        label="Имя"
        type="text"
        fullWidth
        value={firstName}
        onChange={(event) => onFirstNameChange(event.target.value)}
      />
      <TextField
        disabled={isSubmitDisabled}
        autoFocus
        margin="dense"
        id="createlastname"
        label="Фамилия"
        type="text"
        fullWidth
        value={lastName}
        onChange={(event) => onLastNameChange(event.target.value)}
      />
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose} color="primary">
        Отмена
      </Button>
      <Button disabled={isSubmitDisabled} onClick={onSubmit} color="primary">
        {submitButtonLabel}
      </Button>
    </DialogActions>
  </Dialog>
    )};

export default CreateOrEditDialog;
