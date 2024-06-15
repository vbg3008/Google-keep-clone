import { useState } from "react";
import "./App.css";
import { NoteInput } from "./components/noteInput";
import { Notes } from "./components/notes";


function App() {
  return (
    <div className="App">
      <NoteInput />
      <Notes />
    </div>
  );
}

export default App;
