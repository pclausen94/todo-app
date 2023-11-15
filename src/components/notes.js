import { Component } from "react";
import { app } from "../firebase";
import { getFirestore, collection, getDocs } from "firebase/firestore/lite";
import {
  Box,
  Checkbox,
  IconButton,
  InputAdornment,
  ListItemIcon,
  TextField,
  Typography,
} from "@mui/material";
import HistoryEduIcon from "@mui/icons-material/HistoryEdu";
import AddIcon from "@mui/icons-material/Add";
import ClearIcon from "@mui/icons-material/Clear";

class Notes extends Component {
  constructor(props) {
    super(props);
    this.state = {
      notes: [],
    };
  }

  async refreshNotes() {
    var notesList = [];
    const db = getFirestore(app);
    const notesCol = collection(db, "notes");
    const notesSnapshot = await getDocs(notesCol);

    notesSnapshot.forEach((doc) => {
      let note = doc.data();
      note.id = doc.id;
      notesList.push(note);
    });

    this.setState({ notes: notesList });
  }

  componentDidMount() {
    this.refreshNotes();
  }

  render() {
    const { notes } = this.state;
    return (
      <Box>
        <Typography variant="h2">
          Todo List{" "}
          <ListItemIcon>
            <HistoryEduIcon style={{ fontSize: 50 }} />
          </ListItemIcon>
        </Typography>
        <form style={{ display: "flex", alignItems: "stretch" }}>
          <TextField
            label="Add your task"
            variant="outlined"
            fullWidth
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => {
                      /* Add your click handler here */
                    }}
                  >
                    <AddIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </form>
        {notes.map((note) => (
          <Box display="flex" alignItems="center">
            <Checkbox color="default" />
            <Typography
              variant="body1"
              style={{ marginRight: "8px", marginLeft: "8px" }}
            >
              {note.description}
            </Typography>
            <Box flex="1" />
            <IconButton aria-label="delete">
              <ClearIcon />
            </IconButton>
          </Box>
        ))}
      </Box>
    );
  }
}

export default Notes;
