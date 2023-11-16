import React from "react";
import Notes from "./components/notes";
import { Card, Container, CssBaseline } from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";

const theme = createTheme({
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: "#11617B",
          backgroundImage: `linear-gradient(19deg, #11617B 0%, #DDD6F3 100%)`,
        },
      },
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
            padding: "30px", // Adjust the padding to add space around the text
            width: "40%", // Adjust the width to make the Card larger
          }}
        >
          <Notes />
        </Card>
      </Container>
    </ThemeProvider>
  );
}

export default App;
