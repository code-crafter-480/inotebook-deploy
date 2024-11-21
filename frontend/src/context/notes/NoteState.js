import { useState } from "react";
import NoteContext from "./noteContext";

const NoteState = (props) => {
  // const host = "http://localhost:5000"
  const host = "https://inotebook-deploy.onrender.com"

  const notesInitial = []
  const [notes, setNotes] = useState(notesInitial)



  // ➡️ Get all Notes :
  const getNotes = async () => {
    // API call
    try {
      const response = await fetch(`${host}/api/notes/fetchallnotes`, {
        method: 'GET',
        headers: {
          'auth-token': localStorage.getItem('token'),
        },
      })
      const json = await response.json()
      console.log(json)
      setNotes(json)

    } catch (error) {
      console.log(error)
    }
  }


  //  Add a Note :
  const addNote = async (title, description, tag) => {
    //  API Call         
    const response = await fetch(`${host}/api/notes/addnote`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'auth-token': localStorage.getItem('token')
      },
      body: JSON.stringify({ title, description, tag })
    })
    const note = await response.json()
    console.log("Adding a new note")
    setNotes(notes.concat(note))
  }




  //  Delete a Note :      
  const deleteNote = async (id) => {

    //  API CALL 
    const response = await fetch(`${host}/api/notes/deletenote/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',

        'auth-token': localStorage.getItem('token')

      },
    })
    const json = response.json()
    console.log(json)


    console.log("Deleting the note with id" + id)
    const newNotes = notes.filter((note) => { return note._id !== id })
    setNotes(newNotes)
  }




  // ➡️ Edit a Note :
  const editNote = async (id, title, description, tag) => {
    // ➡️ API Call
    const response = await fetch(`${host}/api/notes/updatenote/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',

        'auth-token': localStorage.getItem('token')

      },
      body: JSON.stringify({ title, description, tag })
    })
    const json = response.json()
    console.log(json)


    // Logic to edit in client-side     
    let newNotes = JSON.parse(JSON.stringify(notes))
    for (let index = 0; index < newNotes.length; index++) {
      const element = notes[index]
      if (element._id === id) {
        newNotes[index].title = title
        newNotes[index].description = description
        newNotes[index].tag = tag
        break
      }
    }
    setNotes(newNotes)
  }


  return (
    <NoteContext.Provider value={{ notes, setNotes, addNote, deleteNote, editNote, getNotes }}>
      {props.children}
    </NoteContext.Provider>
  )

}


export default NoteState