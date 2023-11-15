import React from "react";
import { app } from "../firebase";
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  updateDoc,
  addDoc,
  deleteDoc,
} from "firebase/firestore/lite";
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

class Notes extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      notes: [],
      newNote: "",
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

  async addNote() {
    const { newNote } = this.state;

    if (newNote.trim() !== "") {
      const newNotesObject = {
        description: newNote,
        status: false,
      };

      const db = getFirestore(app);
      const notesCol = collection(db, "notes");

      await addDoc(notesCol, newNotesObject);
      this.refreshNotes();

      this.setState({
        newNote: "",
      });
    } else {
      this.setState({
        error: "This field can't be empty. Please try again.",
      });
    }
  }

  handleInputChange = (event) => {
    this.setState({
      newNote: event.target.value,
      error: "",
    });
  };

  async deleteNote(id) {
    const db = getFirestore(app);
    const notesRef = doc(db, "notes/" + id);

    await deleteDoc(notesRef);
    this.refreshNotes();
  }

  toggleStatus = async (note) => {
    const db = getFirestore(app);
    const notesRef = doc(db, "notes/" + note.id);

    await updateDoc(notesRef, { status: !note.status });

    this.setState((prevState) => {
      const updatedNotes = prevState.notes.map((n) =>
        n.id === note.id ? { ...n, status: !n.status } : n
      );
      return { notes: updatedNotes };
    });
  };

  render() {
    const { notes, newNote, error } = this.state;

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
            id="newNote"
            label="Add your task"
            variant="outlined"
            fullWidth
            value={newNote}
            onChange={this.handleInputChange}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => this.addNote()}>
                    <AddIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </form>
        {error && (
          <Typography color="error" variant="body2">
            {error}
          </Typography>
        )}
        {notes.map((note) => (
          <Box key={note.id} display="flex" alignItems="center">
            <Checkbox
              color="default"
              checked={note.status}
              onChange={() => this.toggleStatus(note)}
              id={`status_${note.id}`}
            />
            <Typography
              variant="body1"
              style={{
                marginRight: "8px",
                marginLeft: "8px",
                textDecoration: note.status ? "line-through" : "none",
              }}
            >
              {note.description}
            </Typography>
            <Box flex="1" />
            <IconButton onClick={() => this.deleteNote(note.id)}>
              <ClearIcon />
            </IconButton>
          </Box>
        ))}
      </Box>
    );
  }
}

export default Notes;
