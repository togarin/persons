import React from "react";
import {
  Container,
} from "@material-ui/core";
import TablePersons from "../src/components/TablePersons";

import "./App.css";

function App() {

  return (
    <React.Fragment>
      <Container maxWidth="lg">
        <TablePersons />
      </Container>
    </React.Fragment>
  );
}


export default App;
