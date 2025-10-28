import {
  Button,
  Container,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";

function Login() {
  const { login } = useAuth();
  const nav = useNavigate();
  const loc = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  const onHandleSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    try {
      await login({ email, password });
      nav("/", { replace: true });
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
          Login
        </Typography>
        {err && <Typography color="error">{err}</Typography>}
        <form onSubmit={onHandleSubmit}>
          <Stack spacing={2}>
            <TextField
              label="Email"
              value={email}
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
              Login
            </Button>
            <Typography
              variant="body1"
              sx={{
                alignSelf: "center",
              }}
            >
              No account? <Link to={"/signup"}>Sign Up</Link>
            </Typography>
          </Stack>
        </form>
      </Paper>
    </Container>
  );
}

export default Login;
