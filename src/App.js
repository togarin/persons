import React, { useState, useEffect } from "react";
import {
  Container,
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Icon,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  Snackbar,
} from "@material-ui/core";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import { Edit, Delete } from "@material-ui/icons";
import axios from "axios";

function App() {
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState({
    open: false,
    person: null,
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [persons, setPersons] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const apiUrl = "http://localhost:3001/api/v1/person/";
  const catchMessages = (error) => {
    if (error.response.status) {
      if (error.response.status === 500) {
        setErrorMessage("Cерверная ошибка");
      } else if (error.response.status === 404) {
        setErrorMessage("Cущность не найдена в системе");
      } else if (error.response.status === 400) {
        setErrorMessage("Неверный запрос");
      } else if (error.response.status === 200) {
        setErrorMessage("Веверный запрос");
      }
    } else setErrorMessage(error.message);
  };

  useEffect(() => {
    const fetchPersons = async () => {
      const result = await axios(apiUrl);
      setPersons(result.data);
    };
    fetchPersons();
  }, []);

  const createPerson = async (firstName, lastName) => {
    setIsFetching(true);
    try {
      const response = await axios.post(apiUrl, {
        firstName,
        lastName,
      });
      const newPerson = response.data;
      setPersons([newPerson, ...persons]);
      setCreateModalOpen(false);
    } catch (error) {
      catchMessages(error);
    }
    setIsFetching(false);
  };

  const editPerson = async (id, firstName, lastName) => {
    try {
      await axios.put(`${apiUrl}${id}`, {
        firstName,
        lastName,
      });
      setPersons(
        persons.map((person) =>
          person.id === id ? { ...person, firstName, lastName } : person
        )
      );
      setEditModalOpen({ open: false, person: null });
    } catch (error) {
      catchMessages(error);
    }
  };

  const deletePerson = async (id) => {
    try {
      await axios.delete(`${apiUrl}${id}`);
      setPersons(persons.filter((person) => person.id !== id));
    } catch (error) {
      catchMessages(error);
    }
  };

  return (
    <div style={styles.root}>
      <Container maxWidth="lg">
        <TableContainer component={Paper}>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell align="left"></TableCell>
                <TableCell align="left">Имя</TableCell>
                <TableCell align="left">Фамилия</TableCell>
                <TableCell align="left">Редактировать</TableCell>
                <TableCell align="left">Удалить</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {persons.map((person) => (
                <TableRow key={person.id}>
                  <TableCell align="left">
                    {" "}
                    <Icon>
                      {" "}
                      <AccountCircleIcon />
                    </Icon>{" "}
                  </TableCell>
                  <TableCell align="left">{person.firstName}</TableCell>
                  <TableCell align="left">{person.lastName}</TableCell>
                  <TableCell>
                    {" "}
                    <IconButton>
                      {" "}
                      <Edit
                        onClick={() => {
                          setFirstName(person.firstName);
                          setLastName(person.lastName);
                          setEditModalOpen({ open: true, person: person });
                        }}
                      />{" "}
                    </IconButton>{" "}
                  </TableCell>
                  <TableCell>
                    <IconButton>
                      {" "}
                      <Delete onClick={() => deletePerson(person.id)} />{" "}
                    </IconButton>{" "}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setCreateModalOpen(true)}
        >
          Добавить сотрудника
        </Button>
        <Dialog
          open={createModalOpen}
          onClose={() => setCreateModalOpen(false)}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">
            Создание нового сотрудника
          </DialogTitle>
          <DialogContent>
            <DialogContentText>Введите имя и фамилию</DialogContentText>
            <TextField
              disabled={isFetching}
              autoFocus
              margin="dense"
              id="createfirstname"
              label="Имя"
              type="text"
              fullWidth
              onChange={(event) => setFirstName(event.target.value)}
            />
            <TextField
              disabled={isFetching}
              autoFocus
              margin="dense"
              id="createlastname"
              label="Фамилия"
              type="text"
              fullWidth
              onChange={(event) => setLastName(event.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setCreateModalOpen(false)} color="primary">
              Отмена
            </Button>
            <Button
              disabled={isFetching}
              onClick={() => createPerson(firstName, lastName)}
              color="primary"
            >
              Добавить
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog
          open={editModalOpen.open}
          onClose={() => setEditModalOpen({ open: false, person: null })}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">
            Редактирование сотрудника
          </DialogTitle>
          <DialogContent>
            <TextField
              disabled={isFetching}
              autoFocus
              margin="dense"
              id="firstname"
              label="Имя"
              type="text"
              fullWidth
              value={firstName}
              onChange={(event) => setFirstName(event.target.value)}
            />
            <TextField
              disabled={isFetching}
              autoFocus
              margin="dense"
              id="lastname"
              label="Фамилия"
              type="text"
              fullWidth
              value={lastName}
              onChange={(event) => setLastName(event.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => setEditModalOpen({ open: false, person: null })}
              color="primary"
            >
              Отмена
            </Button>
            <Button
              disabled={isFetching}
              onClick={() =>
                editPerson(editModalOpen.person.id, firstName, lastName)
              }
              color="primary"
            >
              Сохранить
            </Button>
          </DialogActions>
        </Dialog>

        <Snackbar
          anchorOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          open={errorMessage !== ""}
          autoHideDuration={5000}
          onClose={() => setErrorMessage("")}
          message={errorMessage}
        />
      </Container>
    </div>
  );
}

const styles = {
  root: {
    paddingTop: 30,
    paddingBottom: 30,
  },
};

export default App;
