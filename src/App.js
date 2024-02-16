
import './App.css';
import React from "react"
import Sidebar from "./components/Sidebar"
import Editor from "./components/Editor"
// import { data } from "./data"
import Split from "react-split"
import { nanoid } from "nanoid"

/**
 * Challenge: Spend 10-20+ minutes reading through the code
 * and trying to understand how it's currently working. Spend
 * as much time as you need to feel confident that you 
 * understand the existing code (although you don't need
 * to fully understand everything to move on)
 */

export default function App() {

  const [notes, setNotes] = React.useState(
    () => JSON.parse(localStorage.getItem("notes")) || [])

  const [currentNoteId, setCurrentNoteId] = React.useState(() => {
    //console.log("set currentNote Id", notes[0].id);
    return (notes[0] && notes[0].id) || ""
  })

  React.useEffect(() => {
    localStorage.setItem("notes", JSON.stringify(notes));
  }, [notes]);


  function createNewNote() {
    const newNote = {
      id: nanoid(),
      body: "# Type your markdown note's title here"
    }
    setNotes(prevNotes => [newNote, ...prevNotes])
    setCurrentNoteId(newNote.id)

  }

  function updateNote(text) {
    // this doesnt not re-arrange 
    // setNotes(oldNotes => oldNotes.map(oldNote => {
    //   return oldNote.id === currentNoteId
    //     ? { ...oldNote, body: text }
    //     : oldNote
    // }))

    // Put the most recently-modified note at the top
    setNotes(oldNotes => {
      const newArray = []
      for (let i = 0; i < oldNotes.length; i++) {
        const oldNote = oldNotes[i]
        if (oldNote.id === currentNoteId) {
          newArray.unshift({ ...oldNote, body: text })
        } else {
          newArray.push(oldNote)
        }
      }
      return newArray
    })
  }

  function findCurrentNote() {
    return notes.find(note => {
      return note.id === currentNoteId
    }) || notes[0]
  }

  function deleteNote(event, noteId) {
    event.stopPropagation();
    setNotes(oldNotes => oldNotes.filter(oldNote => {
      return oldNote.id !== noteId
    }))
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
              notes={notes}
              deleteNote={deleteNote}
              currentNote={findCurrentNote()}
              setCurrentNoteId={setCurrentNoteId}
              newNote={createNewNote}
            />
            {
              currentNoteId &&
              notes.length > 0 &&
              <Editor
                currentNote={findCurrentNote()}
                updateNote={updateNote}
              />
            }
          </Split>
          :
          <div className="no-notes">
            <h1>You have no notes</h1>
            <button
              className="first-note"
              onClick={createNewNote}
            >
              Create one now
            </button>
          </div>

      }
    </main>
  )
}
