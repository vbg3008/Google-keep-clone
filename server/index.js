import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

const app = express();
app.use(express.json());
app.use(cors());
dotenv.config();

// MODELS*****
const notesSchema = mongoose.Schema({
  title: {
    type: String,
  },
  tagline: {
    type: String,
  },
  content: {
    type: String,
  },
  isPinned: {
    type: Boolean,
    default: false,
    required: true,
  },
});

const Notes = mongoose.model("Notes", notesSchema);

/* MONGOOSE SETUP */

const PORT = process.env.PORT || 6001;
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    app.listen(PORT, () => console.log(`Server Port: ${PORT}`));

 
  })
  .catch((error) => console.log(`${error} did not connect`));

  app.post("/addnote", async (req, res) => {
    const { title, tagline, content } = req.body;
  
    try {
      const newNote = new Notes({ title, tagline, content });
      await newNote.save(); // Wait for save operation to complete
      res.json(newNote); // Respond with saved note
      console.log(newNote);
    } catch (err) {
      console.error("Error saving note:", err);
      res.status(500).json({ error: "Failed to save note" });
    }
  });

app.get("/getnotes", async (req, res) => {
  const notes = await Notes.find().sort({_id:-1});
  res.status(200).json(notes);
});

app.put("/updatenote/:id", async (req, res) => { 
  const noteId = req.params.id;
  const { title, tagline, content, isPinned } = req.body;

  try {
    const updatedNote = await Notes.findByIdAndUpdate(
      noteId,
      { title, tagline, content, isPinned },
      { new: true }
    );
    res.json(updatedNote);
  } catch (err) {
    console.error("Error updating note:", err);
    res.status(500).json({ error: "Failed to update note" });
  }
});

app.get("/deletenote/:id", async (req, res) => {
  let id = req.params.id;
  await Notes.findByIdAndDelete(id);
  res.status(200).send("Note deleted");
});
