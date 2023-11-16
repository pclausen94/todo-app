import { useState, useEffect } from "react";
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

const Notes = () => {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState("");
  const [totalTasksCounter, setTotalTasksCounter] = useState(null);
  const [completedTasksCounter, setCompletedTasksCounter] = useState(null);
  const [error, setError] = useState("");

  const refreshNotes = async () => {
    const notesList = [];
    const db = getFirestore(app);
    const notesCol = collection(db, "notes");
    const notesSnapshot = await getDocs(notesCol);

    notesSnapshot.forEach((doc) => {
      const note = doc.data();
      note.id = doc.id;
      notesList.push(note);
    });

    setNotes(notesList);
    setTotalTasksCounter(notesList.length);
  };

  useEffect(() => {
    const fetchData = async () => {
      await refreshNotes();

      const initialCompletedTasksCounter = notes.filter(
        (note) => note.status
      ).length;

      setCompletedTasksCounter(initialCompletedTasksCounter);
    };

    fetchData();
  }, [notes]);

  const addNote = async () => {
    if (newNote.trim() !== "") {
      const newNotesObject = {
        description: newNote,
        status: false,
      };

      const db = getFirestore(app);
      const notesCol = collection(db, "notes");

      await addDoc(notesCol, newNotesObject);
      await refreshNotes();

      setNewNote("");
      setTotalTasksCounter((prevCounter) => prevCounter + 1);
    } else {
      setError("This field can't be empty. Please try again.");
    }
  };

  const handleInputChange = (event) => {
    setNewNote(event.target.value);
    setError("");
  };

  const deleteNote = async (id) => {
    const db = getFirestore(app);
    const notesRef = doc(db, "notes/" + id);

    await deleteDoc(notesRef);
    await refreshNotes();

    const updatedNotes = notes.filter((note) => note.id !== id);
    const completedTasksCounter = updatedNotes.filter(
      (note) => note.status
    ).length;

    setTotalTasksCounter(updatedNotes.length);
    setCompletedTasksCounter(completedTasksCounter);
    setNotes(updatedNotes);
  };

  const clearAllTasks = async () => {
    const db = getFirestore(app);
    const notesCol = collection(db, "notes");

    const snapshot = await getDocs(notesCol);

    const batch = writeBatch(db);

    snapshot.forEach((doc) => {
      batch.delete(doc.ref);
    });

    await batch.commit();

    await refreshNotes();
    setCompletedTasksCounter(0);
    setTotalTasksCounter(0);
  };

  const toggleStatus = async (note) => {
    const db = getFirestore(app);
    const notesRef = doc(db, "notes/" + note.id);

    await updateDoc(notesRef, { status: !note.status });

    const updatedNotes = notes.map((n) =>
      n.id === note.id ? { ...n, status: !n.status } : n
    );

    const completedTasksCounter = updatedNotes.filter((n) => n.status).length;

    setNotes(updatedNotes);
    setCompletedTasksCounter(completedTasksCounter);
  };

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
          onChange={handleInputChange}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={addNote}>
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
          sx={{
            backgroundColor: "#eee",
            padding: "10px",
            marginTop: "10px",
          }}
        >
          <Box display="flex" alignItems="center">
            <Checkbox
              icon={<PanoramaFishEyeRoundedIcon />}
              checkedIcon={<CheckCircleOutlineRoundedIcon />}
              color="success"
              checked={note.status}
              onChange={() => toggleStatus(note)}
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
                wordBreak: "break-word", // Allow long words to break and wrap onto the next line
              }}
            >
              {note.description}
            </Typography>

            <Box flex="1" />
            <IconButton onClick={() => deleteNote(note.id)}>
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
          You have completed {completedTasksCounter} out of {totalTasksCounter}{" "}
          pending tasks
        </Typography>
        <Button
          variant="contained"
          color="error"
          style={{ marginTop: "10px" }}
          onClick={clearAllTasks}
        >
          Clear All
        </Button>
      </Box>
    </Box>
  );
};

export default Notes;
