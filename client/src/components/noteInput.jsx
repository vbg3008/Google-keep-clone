import React, { useState, useEffect, useRef } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { Modal, Form } from "react-bootstrap";

export const NoteInput = () => {
  const [isClicked, setIsClicked] = useState(false);
  const [title, setTitle] = useState("");
  const [tagline, setTagline] = useState(""); // Assuming you may add tagline later
  const [content, setContent] = useState("");
  const modalRef = useRef(null);
  const textareaRef = useRef(null);

  const handleClickOutside = (event) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      setIsClicked(false);
      //to check we dont send notes with only taglines
      if (
        tagline.trim() === "" &&
        title.trim() === "" &&
        content.trim() === ""
      ) {
        setTagline("");
        toast.warn(
          "⚠️ Can't add a note with just a tagline. Please provide a title and some content.",
          {
            position: "top-right",
            autoClose: 4500,
            closeOnClick: true,
          }
        );
      }
      // Check if either title or content is not empty
      if (title.trim() !== "" || content.trim() !== "") {
        console.log("in handleClickOutside");
        sendNote();
      }
    }
  };

  const sendNote = () => {
    console.log("Sending note:", title, content, tagline);
    fetch("https://google-keep-clone-2dw1.onrender.com/addnote", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        tagline,
        content,
      }),
    })
      .then((response) => {
        console.log("Sending note:", response);
        if (response.ok) {
          console.log("Note added successfully");
          // Clear fields after successful submission
          setTitle("");
          setTagline("");
          setContent("");
          toast.success("Note Added", {
            position: "top-right",
            autoClose: 4500,
            closeOnClick: true,
          });
        } else {
          throw new Error("Failed to add note");
        }
      })
      .catch((error) => {
        console.error("Error adding note:", error);
      });
  };
  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      const textarea = textareaRef.current;
      console.log("ncdlsnl");
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };

  useEffect(() => {
    adjustTextareaHeight(); // Adjust the height initially if there's already content
  }, [content]);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [title, content]); // Added dependencies to ensure the effect reruns if title or content changes

  return (
    <div
      className="modal show"
      style={{
        display: "block",
        position: "initial",
        width: "42rem",
        backgroundColor: "transparent",
        paddingTop: "3rem",
      }}
    >
      {" "}
      <ToastContainer theme="colored" style={{ fontSize: "1.2rem" }} />
      <Modal.Dialog ref={modalRef} style={styles.modalDialog}>
        <Modal.Header style={{ border: "none" }}>
          <Form.Control
            style={{ ...styles.input, display: isClicked ? "inline" : "none" }}
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Form.Control
            style={{ ...styles.input, display: isClicked ? "inline" : "none" }}
            type="text"
            placeholder="#Tagline..."
            value={tagline}
            onChange={(e) => setTagline(e.target.value)}
            onFocus={() => setIsClicked(true)}
          />
        </Modal.Header>

        <Modal.Body>
          <Form.Control
            as="textarea"
            style={styles.input}
            type="textarea"
            placeholder="Take a note..."
            value={content}
            onInput={adjustTextareaHeight}
            onChange={(e) => {
              setContent(e.target.value);
            }}
            onFocus={() => setIsClicked(true)}
          />
        </Modal.Body>
      </Modal.Dialog>
    </div>
  );
};

const styles = {
  modalDialog: {
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    borderRadius: "8px",
    padding: "10px",
    background: "transparent",
    width: "90%",
  },
  input: {
    width: "36rem",
    margin: "5px auto",
    border: "none",
    boxShadow: "none",
    outline: "none",
    padding: "10px",
    fontSize: "16px",
    borderBottom: "1px solid #ddd",
    borderRadius: "4px",
    transition: "all 0.2s ease-in-out",
    background: "transparent",
    resize: "none",
  },
};
