import React, { useState } from "react";
import RoomCard from "../components/RoomCard";
import { Container, Typography, Button, TextField, IconButton } from "@mui/material";
import { FileCopy } from "@mui/icons-material"; // For the Copy icon
import "../App.css"; // Make sure to import the CSS file

const RoomActions = () => {
  const [isJoinRoom, setIsJoinRoom] = useState(true);
  const [generatedLink, setGeneratedLink] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");

  // Switch between Create Room and Join Room
  const handleSwitch = () => setIsJoinRoom(!isJoinRoom);

  // Handle form submission for Join/Create room
  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const enteredUsername = formData.get("username");
    const roomNumber = formData.get("roomNumber");

    if (isJoinRoom) {
      alert(`Joining Room ${roomNumber} as ${enteredUsername}`);
    } else {
      alert(`Creating Room ${roomNumber} for ${enteredUsername}`);
    }
  };

  // Handle generating a room link
  const handleGenerateLink = () => {
    const roomLink = `https://myapp.com/room/${Math.random().toString(36).substring(2, 15)}`;
    setGeneratedLink(roomLink);
  };

  // Copy generated link to clipboard
  const handleCopyLink = () => {
    if (generatedLink) {
      navigator.clipboard.writeText(generatedLink);
      alert("Link copied to clipboard!");
    }
  };

  return (
    <Container maxWidth="sm" className="room-actions-container">
      <Typography variant="h3" className="room-actions-title">
        Virtual Room
      </Typography>
      <Button 
        onClick={handleSwitch} 
        variant="contained" 
        className="room-actions-switch-button"
      >
        {isJoinRoom ? "Switch to Create Room" : "Switch to Join Room"}
      </Button>
      
      {isJoinRoom ? (
        <RoomCard
          title="Join a Room"
          placeholder1="Username"
          placeholder2="Room Number"
          action1="Cancel"
          action2="Join"
          onSubmit={handleSubmit}
        />
      ) : (
        <RoomCard
          title="Create a Room"
          placeholder1="Username"
          placeholder2="Email"
          action1="Cancel"
          action2="Create"
          onSubmit={handleSubmit}
        >
          {/* Username Input (for Create Room) */}
          <TextField
            fullWidth
            label="Username"
            variant="outlined"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="room-card-input"
            margin="normal"
          />
          {/* Email Input (for Create Room) */}
          <TextField
            fullWidth
            label="Email"
            variant="outlined"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="room-card-input"
            margin="normal"
          />
          {/* Create Button */}
          <Button
            onClick={handleGenerateLink}
            variant="contained"
            className="room-card-submit-button"
            style={{ marginBottom: '20px' }}
          >
            Create Link
          </Button>

          {/* Display Generated Link */}
          {generatedLink && (
            <div>
              <TextField
                fullWidth
                label="Generated Link"
                variant="outlined"
                value={generatedLink}
                InputProps={{
                  readOnly: true,
                }}
                className="room-card-input"
                margin="normal"
              />
              <IconButton
                onClick={handleCopyLink}
                style={{ marginTop: '10px' }}
                aria-label="Copy Link"
              >
                <FileCopy />
              </IconButton>
            </div>
          )}
        </RoomCard>
      )}
    </Container>
  );
};

export default RoomActions;



