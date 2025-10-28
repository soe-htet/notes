import {
  Button,
  Container,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";

function Signup() {
  const { signup } = useAuth();
  const nav = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  const onHandleSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    try {
      await signup({ name, email, password });
      nav("/login", { replace: true });
    } catch (e) {
      setErr(e?.response?.data?.message || e.message);
    }
  };

  return (
    <Container maxWidth={"sm"} sx={{ py: 8 }}>
      <Paper sx={{ p: 4 }}>
        <Typography
          variant="h5"
          sx={{
            textAlign: "center",
            mb: 3,
          }}
        >
          Sign Up
        </Typography>
        {err && <Typography color="error">{err}</Typography>}
        <form onSubmit={onHandleSubmit}>
          <Stack spacing={2}>
            <TextField
              label="Name"
              value={name}
              type="text"
              onChange={(e) => setName(e.target.value)}
              required
            />
            <TextField
              label="Email"
              value={email}
              type="email"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <TextField
              label="Password"
              value={password}
              type="password"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Button type="submit" variant="contained">
              Sign Up
            </Button>
            <Typography
              variant="body1"
              sx={{
                alignSelf: "center",
              }}
            >
              Already have an account? <Link to={"/login"}>Login</Link>
            </Typography>
          </Stack>
        </form>
      </Paper>
    </Container>
  );
}

export default Signup;
