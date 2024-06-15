import React, { useState, useEffect } from "react";
import { TextField, Box } from "@mui/material";

const UpdateNote = ({ note, onUpdate, onClose }) => {
  const [title, setTitle] = useState(note.title);
  const [tagline, setTagline] = useState(note.tagline);
  const [content, setContent] = useState(note.content);
  const [isPinned, setIsPinned] = useState(note.isPinned);

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setTagline(note.tagline);
      setContent(note.content);
      setIsPinned(note.isPinned);
    }
  }, [note]);

  const handleSave = () => {
    const url = `https://google-keep-clone-2dw1.onrender.com/updatenote/${note._id}`;
    console.log(url);

    fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        tagline,
        content,
        isPinned,
      }),
    })
      .then((response) => {
        if (response.ok) {
          onUpdate(); // Call the onUpdate function to refresh the notes
          onClose(); // Close the modal
        } else {
          throw new Error(`Failed to update note. Status: ${response.status}`);
        }
      })
      .catch((error) => {
        console.error("Error updating note:", error);
      });
  };

  return (
    <Box style={{}}>
      <h1>Update Note?</h1>
      <TextField
        fullWidth
        label="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        margin="normal"
      />
      <TextField
        fullWidth
        label="Tagline"
        value={tagline}
        onChange={(e) => setTagline(e.target.value)}
        margin="normal"
      />
      <TextField
        fullWidth
        multiline
        rows={4}
        label="Content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        margin="normal"
      />
      <button
        style={{ color: "black", marginLeft: "9rem" }}
        centered
        className="button-89"
        onClick={handleSave}
      >
        Update
      </button>
    </Box>
  );
};

export default UpdateNote;
