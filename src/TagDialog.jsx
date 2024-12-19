/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import EditIcon from "@mui/icons-material/Edit";

const TagDialog = ({ tags = [], onAddTag, onDeleteTag, onDeleteAllTags }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [newTag, setNewTag] = useState("");
  const [displayedTags, setDisplayedTags] = useState(tags);

  useEffect(() => {
    setDisplayedTags(tags);
  }, [tags]);

  const handleOpen = () => setIsOpen(true);

  const handleClose = () => {
    setIsOpen(false);
    setNewTag("");
  };

  const handleAddTag = () => {
    const trimmedTag = newTag.trim();
    if (trimmedTag && !tags.includes(trimmedTag)) {
      onAddTag([trimmedTag]); // Add tag callback expects an array
      setNewTag("");
      setDisplayedTags((prevTags) => [...prevTags, trimmedTag]);
    }
  };

  return (
    <>
      <Button
        variant="contained"
        sx={{ borderRadius: 0, width: "200px" }}
        onClick={handleOpen}
        startIcon={<EditIcon />}
      >
        Hallinnoi tägejä
      </Button>
      <Dialog
        open={isOpen}
        onClose={handleClose}
        PaperProps={{ component: "form", onSubmit: (e) => e.preventDefault() }}
      >
        <DialogTitle>Lisää tai poista tägejä sovelluksesta</DialogTitle>
        <DialogContent>
          <Stack direction="column" spacing={2}>
            <TextField
              label="Uusi tägi"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              variant="standard"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddTag();
                }
              }}
              fullWidth
            />
            <Button
              onClick={handleAddTag}
              variant="contained"
              color="primary"
              disabled={!newTag.trim() || tags.includes(newTag.trim())}
            >
              Lisää tägi
            </Button>
            <Button
              disabled={tags.length === 0}
              onClick={onDeleteAllTags}
              variant="contained"
              sx={{ backgroundColor: "red", color: "white" }}
            >
              Poista kaikki tägit
            </Button>
            <Stack direction="row" gap={2} flexWrap="wrap">
              {displayedTags.map((tag, index) => (
                <Chip
                  key={index}
                  label={tag}
                  onDelete={() => onDeleteTag(tag)}
                  sx={{ fontSize: "1.25rem" }}
                  color="primary"
                  onKeyDown={(e) => {
                    // The delete button in the chip is not focusable by default,
                    // so adding a keydown event listener to the chip itself allows
                    // to delete the tag by pressing Enter or Space when it's focused.
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      onDeleteTag(tag); // Trigger delete on Enter or Space
                    }
                  }}
                />
              ))}
            </Stack>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button color="error" onClick={handleClose}>
            Sulje
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default TagDialog;
