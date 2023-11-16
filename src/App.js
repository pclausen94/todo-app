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
          padding: "0", // Remove default padding
        }}
      >
        <Card
          sx={{
            padding: "20px",
            width: ["100%", "80%", "60%", "40%"], // Responsive width
          }}
        >
          <Notes />
        </Card>
      </Container>
    </ThemeProvider>
  );
}

export default App;
