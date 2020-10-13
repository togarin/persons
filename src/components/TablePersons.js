import React, { useState, useEffect } from "react";
import {
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
  Snackbar,
} from "@material-ui/core";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import { Edit, Delete } from "@material-ui/icons";
import axios from "axios";
import CreateOrEditDialog from "./CreateOrEditDialog";
import DeleteDialog from "./DeleteDialog";

import "./TablePersons.css";

const TablePersons = () => {
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState({
    open: false,
    person: null,
  });
  const [deleteModalOpen, setDeleteModalOpen] = useState({
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
    if (error.response && error.response.status) {
      if (error.response.status === 500) {
        setErrorMessage("Cерверная ошибка");
      } else if (error.response.status === 404) {
        setErrorMessage("Cущность не найдена в системе");
      } else if (error.response.status === 400) {
        setErrorMessage("Неверный запрос");
      } else if (error.response.status === 200) {
        setErrorMessage("Верный запрос");
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
      setErrorMessage("Верный запрос");
      setCreateModalOpen(false);
      setFirstName("");
      setLastName("");
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
      setErrorMessage("Верный запрос");
      setEditModalOpen({ open: false, person: null });
      setFirstName("");
      setLastName("");
    } catch (error) {
      catchMessages(error);
    }
  };

  const deletePerson = async (id) => {
    try {
      await axios.delete(`${apiUrl}${id}`);
      setPersons(persons.filter((person) => person.id !== id));
      setErrorMessage("Верный запрос");
      setDeleteModalOpen({ open: false, person: null });
    } catch (error) {
      catchMessages(error);
    }
  };

  return (
    <React.Fragment>
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
                  <IconButton
                    onClick={() => {
                      setFirstName(person.firstName);
                      setLastName(person.lastName);
                      setEditModalOpen({ open: true, person: person });
                    }}
                  >
                    {" "}
                    <Edit />{" "}
                  </IconButton>{" "}
                </TableCell>
                <TableCell>
                  <IconButton
                    onClick={() =>
                      setDeleteModalOpen({ open: true, person: person })
                    }
                  >
                    {" "}
                    <Delete />{" "}
                  </IconButton>{" "}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <div className="btn-wrapper">
        <Button
          variant="contained"
          color="primary"
          onClick={() => setCreateModalOpen(true)}
        >
          Добавить сотрудника
        </Button>
      </div>
      <CreateOrEditDialog
        title="Создание нового сотрудника"
        subtitle="Введите имя и фамилию"
        isOpen={createModalOpen}
        onClose={() => {
          setCreateModalOpen(false);
          setFirstName("");
          setLastName("");
        }}
        disabled={isFetching || firstName === "" || lastName === ""}
        firstName={firstName}
        lastName={lastName}
        onFirstNameChange={setFirstName}
        onLastNameChange={setLastName}
        onSubmit={() => createPerson(firstName, lastName)}
        submitButtonLabel="Добавить"
      />

      <CreateOrEditDialog
        title="Редактирование сотрудника"
        subtitle="Отредактируйте имя и/или фамилию"
        isOpen={editModalOpen.open}
        onClose={() => {
          setEditModalOpen({ open: false, person: null });
          setFirstName("");
          setLastName("");
        }}
        disabled={isFetching}
        firstName={firstName}
        lastName={lastName}
        onFirstNameChange={setFirstName}
        onLastNameChange={setLastName}
        onSubmit={() =>
          editPerson(editModalOpen.person.id, firstName, lastName)
        }
        submitButtonLabel="Сохранить"
      />

      <DeleteDialog
        title="Удаление сотрудника"
        subtitle="Вы действительно хотите удалить сотрудника?"
        isOpen={deleteModalOpen.open}
        onClose={() => setDeleteModalOpen({ open: false, person: null })}
        disabled={isFetching}
        onSubmit={() => {
          deletePerson(deleteModalOpen.person.id);
        }}
        submitButtonLabel="Удалить"
      />

      <Snackbar
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        open={errorMessage !== ""}
        autoHideDuration={3000}
        onClose={() => setErrorMessage("")}
        message={errorMessage}
      />
    </React.Fragment>
  );
};

export default TablePersons;
