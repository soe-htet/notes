import {
  Button,
  Card,
  CardActions,
  CardContent,
  Stack,
  Typography,
} from "@mui/material";
import React from "react";

import dayjs from "dayjs";

function NoteCard({ note, onEdit, onDelete }) {
  return (
    <Card variant="outlined">
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {note.title}
        </Typography>
        {!!note.category && (
          <Typography variant="caption" color="primary">
            {note.category}
          </Typography>
        )}
        {!!note.date && (
          <Typography variant="caption" sx={{ ml: 1 }} color="text.secondary">
            {dayjs(note.date).format("YYYY-MM-DD")}
          </Typography>
        )}
        {!!note.description && (
          <Typography sx={{ mt: 1.5 }}>{note.description}</Typography>
        )}
      </CardContent>
      <CardActions>
        <Stack direction="row" spacing={1}>
          <Button size="small" onClick={onEdit}>
            Edit
          </Button>
          <Button size="small" color="error" onClick={onDelete}>
            Delete
          </Button>
        </Stack>
      </CardActions>
    </Card>
  );
}

export default NoteCard;
