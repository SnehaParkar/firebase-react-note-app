
import './App.css';
import React from "react"
import Sidebar from "./components/Sidebar"
import Editor from "./components/Editor"
import Footer from './components/Footer';
import Split from "react-split"
import { onSnapshot, addDoc, doc, deleteDoc, setDoc } from "firebase/firestore"
import { notesCollection, db } from './firebase';

export default function App() {

  const [notes, setNotes] = React.useState([])
  const [currentNoteId, setCurrentNoteId] = React.useState("")
  const [tempNoteText, setTempNoteText] = React.useState("")

  const currentNote =
    notes.find(note => note.id === currentNoteId)
    || notes[0]

  const sortedNotes = notes.sort((a, b) => b.updatedAt - a.updatedAt)

  React.useEffect(() => {
    // this is basically web-socket connection for firestore collection
    const unsubscribe = onSnapshot(notesCollection, (snapshot) => {
      // Sync up our local notes array with the snapshot data
      // console.log("THINGS ARE CHANGING!", snapshot);
      const notesArr = snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
      }))
      setNotes(notesArr);

    })
    return unsubscribe
  }, []);

  React.useEffect(() => {
    if (!currentNoteId) {
      setCurrentNoteId(notes[0]?.id)
    }
  }, [notes])

  React.useEffect(() => {
    if (currentNote) {
      setTempNoteText(currentNote.body)
    }
  }, [currentNote])

  // debouncing logic , make delay in seding req. and wait for user to type more text.
  React.useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (tempNoteText !== currentNote?.body)
        updateNote(tempNoteText)
    }, 500)
    return () => clearTimeout(timeoutId);
  }, [tempNoteText])

  // CREATE / UPDATE/ DELETE
  async function createNewNote() {
    const newNote = {
      body: "# Type your markdown note's title here",
      createdAt: Date.now(),
      updatedAt: Date.now()
    }
    const newNoteRef = await addDoc(notesCollection, newNote)
    //setNotes(prevNotes => [newNote, ...prevNotes])
    setCurrentNoteId(newNoteRef.id)

  }

  async function updateNote(text) {
    const toBeUpdatedNote = doc(db, "notes", currentNoteId);
    await setDoc(toBeUpdatedNote,
      {
        body: text,
        updatedAt: Date.now()
      },
      { merge: true });
  }

  async function deleteNote(noteId) {
    const toBeDeletedNote = doc(db, "notes", noteId);
    await deleteDoc(toBeDeletedNote);
  }

  return (
    <main>
      {
        notes.length > 0
          ?
          <Split
            sizes={[30, 70]}
            direction="horizontal"
            className="split"
          >
            <Sidebar
              notes={sortedNotes}
              deleteNote={deleteNote}
              currentNote={currentNote}
              setCurrentNoteId={setCurrentNoteId}
              newNote={createNewNote}
            />
            <Editor
              tempNoteText={tempNoteText}
              setTempNoteText={setTempNoteText}
            />

          </Split>
          :
          <div className="no-notes">
            <h1>You have no notes</h1>
            <button className="first-note" onClick={createNewNote}>Create one now</button>
          </div>

      }
      <Footer />
    </main >
  )
}
