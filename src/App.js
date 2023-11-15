import { Component } from "react";
import { app } from "./firebase";
import { getFirestore, collection, getDocs } from "firebase/firestore/lite";

class App extends Component {
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
    console.log(notes);
    return (
      <div className="App">
        <h2>todo App</h2>
        {notes.map((note) => (
          <p>
            {note.title}
            {note.description}
          </p>
        ))}
      </div>
    );
  }
}

export default App;
