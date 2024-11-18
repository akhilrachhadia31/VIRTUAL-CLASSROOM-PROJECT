// File: src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import RoomActions from "./pages/RoomActions";
// import VideoRoom from "./pages/Video-room"

const theme = createTheme({
  palette: {
    primary: {
      main: "#4CAF50",
    },
    secondary: {
      main: "#2196F3",
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Routes>
          <Route path="/" element={<RoomActions />} />
          {/* <Route path="/video-room" element={<VideoRoom />} /> */}
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
