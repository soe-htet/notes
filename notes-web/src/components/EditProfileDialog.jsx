import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Avatar,
  Stack,
} from "@mui/material";
import { updateProfile } from "../api/user";
import { useAuth } from "../auth/AuthProvider";

export default function EditProfileDialog({ open, onClose }) {
  const { user, logout, updateUserContext } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(user?.profileImage || "");
  const [saving, setSaving] = useState(false);

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const updated = await updateProfile({ name, profileImage: image });
      // update local user in AuthProvider manually
      localStorage.setItem("accessToken", localStorage.getItem("accessToken")); // keep token
      // reload the page or broadcast user update
      await updateUserContext(updated); // simplest way
      onClose();
    } catch (e) {
      alert(e?.response?.data?.message || e.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Edit Profile</DialogTitle>
      <DialogContent sx={{ pt: 2 }}>
        <Stack spacing={2} alignItems="center">
          <Avatar src={preview} sx={{ width: 80, height: 80 }} />
          <Button variant="outlined" component="label">
            Change Image
            <input type="file" hidden accept="image/*" onChange={handleFile} />
          </Button>
          <TextField
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} disabled={saving} variant="contained">
          {saving ? "Saving..." : "Save"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
