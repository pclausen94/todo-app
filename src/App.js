import React from "react";
import Notes from "./components/notes";
import { Card, Container, CssBaseline } from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    background: {
      default: "#11617B", // Set your desired background color
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
        }}
      >
        <Card
          sx={{
            padding: "20px", // Adjust the padding to add space around the text
            width: "50%", // Adjust the width to make the Card larger
          }}
        >
          <Notes />
        </Card>
      </Container>
    </ThemeProvider>
  );
}

export default App;
