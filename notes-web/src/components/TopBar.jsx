import {
  AppBar,
  Box,
  Button,
  Toolbar,
  Typography,
  Tooltip,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Link,
} from "@mui/material";
import React, { useState } from "react";
import { useAuth } from "../auth/AuthProvider";
import EditProfileDialog from "./EditProfileDialog";
import { Link as RouterLink, useNavigate } from "react-router-dom";

function TopBar() {
  const { user, logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);
  const [openEdit, setOpenEdit] = useState(false);

  const handleMenu = (e) => setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);

  if (!user) return null;

  return (
    <>
      <AppBar position="static" color="default" elevation={1}>
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Link
            component={RouterLink}
            to="/"
            underline="none"
            color="inherit"
            sx={{ "&:hover": { color: "primary.main" }, fontWeight: 600 }}
          >
            <Typography variant="h6">Notes</Typography>
          </Link>

          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Typography variant="body2">{user?.name}</Typography>
            <Tooltip title="Profile">
              <IconButton onClick={handleMenu}>
                <Avatar
                  src={user?.profileImage}
                  sx={{ width: 36, height: 36 }}
                />
              </IconButton>
            </Tooltip>
          </Box>
        </Toolbar>
      </AppBar>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        PaperProps={{ sx: { mt: 1.5 } }}
      >
        <MenuItem
          onClick={() => {
            setOpenEdit(true);
            handleClose();
          }}
        >
          Edit Profile
        </MenuItem>
        <MenuItem onClick={logout}>Logout</MenuItem>
      </Menu>

      <EditProfileDialog open={openEdit} onClose={() => setOpenEdit(false)} />
    </>
  );
}

export default TopBar;
