import {
  Box,
  Button,
  Container,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Pagination,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";
import NoteCard from "../components/NoteCard";
import { useNavigate } from "react-router-dom";
import { deleteNote, listNotes } from "../api/note";
import { listCategories } from "../api/categories";
import Empty from "./Empty";

const CATEGORIES = [
  {
    _id: "general",
    count: 3,
  },
  {
    _id: "personal",
    count: 2,
  },
  {
    _id: "work",
    count: 2,
  },
  {
    _id: "study",
    count: 2,
  },
];

const NOTES = [
  {
    _id: "68f44dc7951b6f591890c9d2",
    title: "note 1",
    description: "this is description",
    category: "study",
    date: "2025-10-19T02:32:39.050Z",
    owner: "68f3021df0c3759b7703e1b3",
    createdAt: "2025-10-19T02:32:39.050Z",
    updatedAt: "2025-10-19T02:32:39.050Z",
    __v: 0,
  },
  {
    _id: "68f44dc3951b6f591890c9cf",
    title: "note 1",
    description: "this is description",
    category: "work",
    date: "2025-10-19T02:32:35.792Z",
    owner: "68f3021df0c3759b7703e1b3",
    createdAt: "2025-10-19T02:32:35.792Z",
    updatedAt: "2025-10-19T02:32:35.792Z",
    __v: 0,
  },
  {
    _id: "68f44dbf951b6f591890c9cc",
    title: "note 1",
    description: "this is description",
    category: "personal",
    date: "2025-10-19T02:32:31.852Z",
    owner: "68f3021df0c3759b7703e1b3",
    createdAt: "2025-10-19T02:32:31.852Z",
    updatedAt: "2025-10-19T02:32:31.852Z",
    __v: 0,
  },
  {
    _id: "68f44dbb951b6f591890c9c9",
    title: "note 1",
    description: "this is description",
    category: "study",
    date: "2025-10-19T02:32:27.874Z",
    owner: "68f3021df0c3759b7703e1b3",
    createdAt: "2025-10-19T02:32:27.874Z",
    updatedAt: "2025-10-19T02:32:27.874Z",
    __v: 0,
  },
  {
    _id: "68f44db3951b6f591890c9c6",
    title: "note 1",
    description: "this is description",
    category: "work",
    date: "2025-10-19T02:32:19.290Z",
    owner: "68f3021df0c3759b7703e1b3",
    createdAt: "2025-10-19T02:32:19.291Z",
    updatedAt: "2025-10-19T02:32:19.291Z",
    __v: 0,
  },
  {
    _id: "68f44dae951b6f591890c9c3",
    title: "note 1",
    description: "this is description",
    category: "personal",
    date: "2025-10-19T02:32:14.312Z",
    owner: "68f3021df0c3759b7703e1b3",
    createdAt: "2025-10-19T02:32:14.313Z",
    updatedAt: "2025-10-19T02:32:14.313Z",
    __v: 0,
  },
  {
    _id: "68f44da0951b6f591890c9c0",
    title: "note 1",
    description: "this is description",
    category: "general",
    date: "2025-10-19T02:32:00.205Z",
    owner: "68f3021df0c3759b7703e1b3",
    createdAt: "2025-10-19T02:32:00.207Z",
    updatedAt: "2025-10-19T02:32:00.207Z",
    __v: 0,
  },
  {
    _id: "68f44d89951b6f591890c9ba",
    title: "note updated",
    description: "this is description",
    category: "general",
    date: "2025-10-19T02:31:37.536Z",
    owner: "68f3021df0c3759b7703e1b3",
    createdAt: "2025-10-19T02:31:37.541Z",
    updatedAt: "2025-10-19T02:36:57.922Z",
    __v: 0,
  },
  {
    _id: "68f44d7c7dd1b587ef89db10",
    title: "note 1",
    description: "this is description",
    category: "general",
    date: "2025-10-19T02:31:24.197Z",
    owner: "68f3021df0c3759b7703e1b3",
    createdAt: "2025-10-19T02:31:24.203Z",
    updatedAt: "2025-10-19T02:31:24.203Z",
    __v: 0,
  },
];

function Notes() {
  const [q, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const navigator = useNavigate();

  const [cats, setCats] = useState();
  const [catsLoading, setCatsLoading] = useState(true);

  // notes state
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1); // 1-based
  const [limit, setLimit] = useState(20); // page size
  const [total, setTotal] = useState(0);

  useEffect(() => {
    setPage(1);
  }, [q, category, limit]);

  const options = useMemo(
    () => [{ _id: "All", count: 0 }, ...(cats || []).map((c) => c)],
    [cats]
  );

  const totalPages = Math.max(1, Math.ceil(total / (limit || 1)));
  // load categories once
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const data = await listCategories();
        if (alive) setCats(data || []);
      } catch {
        /* ignore */
      } finally {
        if (alive) setCatsLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  // load notes on filters change
  useEffect(() => {
    let alive = true;
    setLoading(true);
    (async () => {
      try {
        const data = await listNotes({ q, category, page, limit });
        if (alive) setNotes(data.notes || []);

        setTotal(data.total || 0);
        // (optional) correct page if server adjusted it
        if (data.page && data.page !== page) setPage(data.page);
      } catch (e) {
        console.error(e);
        if (alive) setNotes([]);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [q, category, page, limit]);

  const handleDelete = async (id) => {
    if (!confirm("Delete this note?")) return;
    try {
      await deleteNote(id);
      // local update without refetch
      setNotes((prev) => prev.filter((n) => n._id !== id));

      if (notes.length === 1 && page > 1) setPage((p) => p - 1);
    } catch (e) {
      alert(e?.response?.data?.message || e.message);
    }
  };

  return (
    <Container maxWidth={"md"} sx={{ py: 3 }}>
      <Stack direction={"row"} spacing={1.5} sx={{ mb: 2 }}>
        <TextField
          label="search"
          value={q}
          onChange={(e) => setQuery(e.target.value)}
          fullWidth
        ></TextField>
        <TextField
          label="Category"
          select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          sx={{ minWidth: 160 }}
        >
          {options.map((cat) => (
            <MenuItem key={cat._id} value={cat._id}>
              {cat._id}
            </MenuItem>
          ))}
        </TextField>

        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel id="limit-label">Per page</InputLabel>
          <Select
            labelId="limit-label"
            label="Per page"
            value={limit}
            onChange={(e) => setLimit(Number(e.target.value))}
          >
            {[20, 50, 80, 100].map((sz) => (
              <MenuItem key={sz} value={sz}>
                {sz}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button variant="contained" onClick={() => navigator("/notes/new")}>
          New
        </Button>
      </Stack>
      {loading ? (
        <Box sx={{ py: 6, textAlign: "center" }}>Loading...</Box>
      ) : notes.length ? (
        <>
          <Grid container spacing={2}>
            {notes.map((note) => (
              <NoteCard
                key={note._id}
                note={note}
                onEdit={() => navigator(`/notes/${note._id}`)}
                onDelete={() => handleDelete(note._id)}
              ></NoteCard>
            ))}
          </Grid>
          <Stack direction="row" justifyContent="center" sx={{ mt: 3 }}>
            <Pagination
              page={page}
              count={totalPages}
              onChange={(_e, p) => setPage(p)}
              color="primary"
              showFirstButton
              showLastButton
            />
          </Stack>
        </>
      ) : (
        <Empty text="No notes found." />
      )}
    </Container>
  );
}

export default Notes;
