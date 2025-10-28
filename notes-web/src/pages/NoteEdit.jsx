import {
  Button,
  Container,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { listCategories } from "../api/categories";
import { createNote, getNote, updateNote } from "../api/note";

function NoteEdit() {
  const { id } = useParams(); // "new" or real id
  const isNew = id === "new";
  const nav = useNavigate();

  const [loading, setLoading] = useState(!isNew);
  const [cats, setCats] = useState([]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const c = await listCategories();
        if (alive) setCats(c || []);
      } catch {}
    })();

    if (!isNew) {
      setLoading(true);
      (async () => {
        try {
          const existing = await getNote(id);
          if (!alive) return;
          setTitle(existing?.title || "");
          setDescription(existing?.description || "");
          setCategory(existing?.category || "");
          setDate(existing?.date ? existing.date.slice(0, 10) : "");
        } catch (e) {
          alert(e?.response?.data?.message || e.message);
        } finally {
          if (alive) setLoading(false);
        }
      })();
    }

    return () => {
      alive = false;
    };
  }, [id, isNew]);

  const save = async () => {
    if (!title.trim()) return alert("Title is required");
    const payload = { title, description, category, date: date || null };
    try {
      if (isNew) {
        await createNote(payload);
      } else {
        await updateNote(id, payload);
      }
      nav("/", { replace: true });
    } catch (e) {
      alert(e?.response?.data?.message || e.message);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 3 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          {isNew ? "Create Note" : "Edit Note"}
        </Typography>
        {!isNew && loading ? (
          "Loading…"
        ) : (
          <Stack spacing={2}>
            <TextField
              label="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <TextField
              label="Description"
              multiline
              minRows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <TextField
              select
              label="Category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <MenuItem value="">(None)</MenuItem>
              {cats.map((c) => (
                <MenuItem key={c._id} value={c._id}>
                  {c._id}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="Date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
            <Stack direction="row" spacing={1}>
              <Button variant="contained" onClick={save}>
                Save
              </Button>
              <Button variant="text" onClick={() => nav(-1)}>
                Cancel
              </Button>
            </Stack>
          </Stack>
        )}
      </Paper>
    </Container>
  );
}

export default NoteEdit;
