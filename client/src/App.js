import "./App.css";
import { NoteInput } from "./components/noteInput";
import { Notes } from "./components/notes";
import { ErrorPage } from "./components/errorPage";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          index
          element={
            <div className="App">
              <NoteInput />
              <Notes />
            </div>
          }
        />
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
