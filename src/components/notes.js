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
  writeBatch,
} from "firebase/firestore/lite";
import {
  Box,
  Button,
  Card,
  Checkbox,
  Divider,
  IconButton,
  InputAdornment,
  ListItemIcon,
  TextField,
  Typography,
} from "@mui/material";
import HistoryEduIcon from "@mui/icons-material/HistoryEdu";
import AddIcon from "@mui/icons-material/Add";
import ClearIcon from "@mui/icons-material/Clear";
import PanoramaFishEyeRoundedIcon from "@mui/icons-material/PanoramaFishEyeRounded";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";

class Notes extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      notes: [],
      newNote: "",
      totalTasksCounter: null,
      completedTasksCounter: null,
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

    this.setState({ notes: notesList, totalTasksCounter: notesList.length });
  }

  async componentDidMount() {
    await this.refreshNotes();

    const initialCompletedTasksCounter = this.state.notes.filter(
      (note) => note.status
    ).length;

    this.setState({
      completedTasksCounter: initialCompletedTasksCounter,
    });
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

      this.setState((prevState) => ({
        newNote: "",
        totalTasksCounter: prevState.totalTasksCounter + 1,
      }));
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
    await this.refreshNotes(); // Wait for refreshNotes to complete

    const { notes } = this.state;
    const updatedNotes = notes.filter((n) => n.id !== id);
    const completedTasksCounter = updatedNotes.filter((n) => n.status).length;

    this.setState({
      totalTasksCounter: updatedNotes.length,
      completedTasksCounter,
      notes: updatedNotes,
    });
  }

  clearAllTasks = async () => {
    const db = getFirestore(app);
    const notesCol = collection(db, "notes");

    const snapshot = await getDocs(notesCol);

    const batch = writeBatch(db);

    snapshot.forEach((doc) => {
      batch.delete(doc.ref);
    });

    // The writes are committed when you execute the batch
    await batch.commit();

    // Refresh notes and update counters
    await this.refreshNotes();
    this.setState({
      completedTasksCounter: 0,
      totalTasksCounter: 0,
    });
  };

  toggleStatus = async (note) => {
    const db = getFirestore(app);
    const notesRef = doc(db, "notes/" + note.id);

    await updateDoc(notesRef, { status: !note.status });

    this.setState((prevState) => {
      const updatedNotes = prevState.notes.map((n) =>
        n.id === note.id ? { ...n, status: !n.status } : n
      );

      const completedTasksCounter = updatedNotes.filter((n) => n.status).length;

      return { notes: updatedNotes, completedTasksCounter };
    });
  };

  render() {
    const { notes, newNote, error, totalTasksCounter, completedTasksCounter } =
      this.state;

    return (
      <Box>
        <Typography variant="h2">
          Todo List{" "}
          <ListItemIcon>
            <HistoryEduIcon style={{ fontSize: "3rem" }} />
          </ListItemIcon>
        </Typography>
        <form style={{ display: "flex", flexDirection: "column" }}>
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
        <Divider style={{ margin: "10px 0" }} />
        {notes.map((note) => (
          <Card
            key={note.id}
            variant="outlined"
            style={{
              backgroundColor: "#eee", // Grey background color
              padding: "10px",
              marginTop: "10px", // Adjust the spacing as needed
            }}
          >
            <Box display="flex" alignItems="center">
              <Checkbox
                icon={<PanoramaFishEyeRoundedIcon />}
                checkedIcon={<CheckCircleOutlineRoundedIcon />}
                color="success"
                checked={note.status}
                onChange={() => this.toggleStatus(note)}
                id={`status_${note.id}`}
              />
              <Typography
                variant="body1"
                sx={{
                  marginLeft: "8px",
                  marginRight: "8px",
                  textDecoration: note.status ? "line-through" : "none",
                  overflowWrap: "break-word",
                  wordWrap: "break-word",
                  maxWidth: ["100%", "70%", "50%"], // Responsive max-width
                  fontFamily: "'Roboto', sans-serif", // Change the font family
                  fontSize: "1rem", // Adjust the font size
                  color: note.status ? "#757575" : "inherit", // Adjust the text color
                }}
              >
                {note.description}
              </Typography>
              <Box flex="1" />
              <IconButton onClick={() => this.deleteNote(note.id)}>
                <ClearIcon />
              </IconButton>
            </Box>
          </Card>
        ))}
        <Box
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: "4%",
          }}
        >
          <Typography variant="h6">
            You have completed {completedTasksCounter} out of{" "}
            {totalTasksCounter} pending tasks
          </Typography>
          <Button
            variant="contained"
            color="error"
            style={{ marginTop: "10px" }}
            onClick={this.clearAllTasks}
          >
            Clear All
          </Button>
        </Box>
      </Box>
    );
  }
}

export default Notes;
