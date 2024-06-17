import React, { memo, useState, useEffect, useReducer } from "react";
import Card from "react-bootstrap/Card";
import PushPinOutlinedIcon from "@mui/icons-material/PushPinOutlined";
import PushPinIcon from "@mui/icons-material/PushPin";
import Box from "@mui/material/Box";
import Tooltip from '@mui/material/Tooltip';


import Modal from "@mui/material/Modal";
import UpdateNote from "./updateNote";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export const Notes = memo(function Notes() {
  const [notes, setNotes] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [notesPerPage] = useState(6); // Number of notes per page
  const [totalNotes, setTotalNotes] = useState(0); // Total number of notes
  const [openModal, setOpenModal] = useState(false); // to show modal when it is clicked
  const [selectedNote, setSelectedNote] = useState(null);
  const [ignored, forceUpdate] = useReducer((x) => x + 1, 0); //used to add note in notes

  useEffect(() => {
    fetchNotes();
  }, [ignored]);

  const fetchNotes = async () => {
    try {
      const response = await fetch(
        "https://google-keep-clone-2dw1.onrender.com/getnotes"
      );
      if (!response.ok) {
        throw new Error("Failed to fetch notes");
      }
      const data = await response.json();
      setNotes(data); // Assuming data is an array of notes
      forceUpdate();
      setTotalNotes(data.length); // Set total number of notes
    } catch (error) {
      console.error("Error fetching notes:", error);
    }
  };

  // Calculate current notes to display based on currentPage
  const indexOfLastNote = currentPage * notesPerPage;
  const indexOfFirstNote = indexOfLastNote - notesPerPage;
  const currentNotes = notes.slice(indexOfFirstNote, indexOfLastNote);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleNoteClick = (note) => {
    setSelectedNote(note);
    setOpenModal(true);
  };

  const handleModalClose = () => {
    setOpenModal(false);
    setSelectedNote(null);
  };
  const sortedNotes = currentNotes.sort((a, b) => b.isPinned - a.isPinned);


  return (
    <>
      <h1 style={{textAlign:'center'}}>Notes</h1>
      <h5>if there are no notes just refresh it . as the server need sometime to start</h5>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          height:'400px',
          paddingLeft: '40px',
          width: "80%",
          margin: "auto",
        }}
      >
        {sortedNotes.map((note) => (
          <Card
            key={note._id}
            onClick={() => handleNoteClick(note)}
            style={{
              width: "23rem",
              height: "12rem",
              border: "1px solid black",
              margin: "1rem",
              borderRadius: "10px",
              boxShadow: "1px 1px 1px 1px grey",
              padding: "1rem",
              cursor: "pointer",
              transition: "all 0.3s ease-in-out",
              fontWeight: "800",
            }}
          >
            <Card.Header style={{ textAlign: "center", fontSize: "1.5rem" }}>
              {note.title}
            </Card.Header>
            <Card.Body>
              <p style={{ marginLeft: "2px", fontSize: "1.1rem" }}>
                {note.tagline}
              </p>
              <p
                style={{
                  fontSize: "1.3rem",
                  overflow: "hidden",
                  whiteSpace: "nowrap",
                  textOverflow: "ellipsis",
                }}
              >
                {note.content}
              </p>
              <Tooltip title={note.isPinned ? 'Pinned Note' : 'Not Pinned' } >
              {note.isPinned ? (
                <PushPinIcon style={{ marginLeft: "18rem" }} />
              ) : (
                <PushPinOutlinedIcon style={{ marginLeft: "18rem" }} />
              )}
              </Tooltip>
            </Card.Body>
          </Card>
        ))}
        {selectedNote && (
          <Modal
            open={openModal}
            onClose={handleModalClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style}>
              <UpdateNote
                note={selectedNote}
                onUpdate={fetchNotes}
                onClose={handleModalClose}
              />
            </Box>
          </Modal>
        )}
      </div>
      {/* Pagination controls */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: "1rem",
          paddingBottom: "2rem",
          paddingTop: "0.2rem",
        }}
      >
        <button
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
          className="button-89"
        >
          Previous
        </button>
        <button
          className="button-89"
          onClick={() => paginate(currentPage + 1)}
          disabled={indexOfLastNote >= totalNotes}
        >
          Next
        </button>
      </div>
    </>
  );
});
