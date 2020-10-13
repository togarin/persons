import React from "react";
import {
  Container,
} from "@material-ui/core";
import TablePersons from "../src/components/TablePersons";

function App() {

  return (
    <div className="root">
      <Container maxWidth="lg">
        <TablePersons />
      </Container>
    </div>
  );
}


export default App;
