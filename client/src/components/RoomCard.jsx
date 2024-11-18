import React from "react";
import { Card, CardContent, TextField, Button, Typography } from "@mui/material";
import "../App.css";  // Make sure to import your CSS file

const RoomCard = ({ title, placeholder1, placeholder2, action1, action2, onSubmit }) => {
  return (
    <Card className="room-card">
      <CardContent>
        <Typography variant="h5" align="center" className="room-card-title">
          {title}
        </Typography>
        <form className="room-form" onSubmit={onSubmit}>
          <TextField 
            fullWidth 
            label={placeholder1} 
            variant="outlined" 
            className="room-card-input"
            required 
          />
          <TextField 
            fullWidth 
            label={placeholder2} 
            variant="outlined" 
            className="room-card-input"
            required 
          />
          <div className="room-card-buttons">
            <Button type="button" variant="outlined" className="room-card-action-button">
              {action1}
            </Button>
            <Button type="submit" variant="contained" className="room-card-submit-button">
              {action2}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default RoomCard;













// import React from "react";
// import { Card, CardContent, TextField, Button, Typography } from "@mui/material";

// const RoomCard = ({ title, placeholder1, placeholder2, action1, action2, onSubmit }) => {
//   return (
//     <Card style={{ maxWidth: 400, margin: "20px auto", padding: "20px", borderRadius: "10px", boxShadow: "0px 5px 15px rgba(0,0,0,0.2)" }}>
//       <CardContent>
//         <Typography variant="h5" align="center" style={{ marginBottom: "20px", color: "#4CAF50" }}>
//           {title}
//         </Typography>
//         <form onSubmit={onSubmit}>
//           <TextField 
//             fullWidth 
//             label={placeholder1} 
//             variant="outlined" 
//             style={{ marginBottom: "15px" }} 
//             required
//           />
//           <TextField 
//             fullWidth 
//             label={placeholder2} 
//             variant="outlined" 
//             style={{ marginBottom: "15px" }} 
//             required
//           />
//           <div style={{ display: "flex", justifyContent: "space-between", marginTop: "20px" }}>
//             <Button type="button" variant="outlined" style={{ color: "#4CAF50", borderColor: "#4CAF50" }}>
//               {action1}
//             </Button>
//             <Button type="submit" variant="contained" style={{ backgroundColor: "#4CAF50", color: "#fff" }}>
//               {action2}
//             </Button>
//           </div>
//         </form>
//       </CardContent>
//     </Card>
//   );
// };

// export default RoomCard;
