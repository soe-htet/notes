import TopBar from "./components/TopBar";
import Container from "@mui/material/Container";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import NoteEdit from "./pages/NoteEdit";
import Notes from "./pages/Notes";
import RequireAuth from "./auth/RequireAuth";

function App() {
  return (
    <>
      <TopBar></TopBar>
      <Container maxWidth="lg">
        <Routes>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/signup" element={<Signup />}></Route>
          <Route
            path="/"
            element={
              <RequireAuth>
                <Notes />
              </RequireAuth>
            }
          ></Route>
          <Route
            path="/notes/:id"
            element={
              <RequireAuth>
                <NoteEdit />
              </RequireAuth>
            }
          ></Route>

          <Route path="*" element={<Navigate to={"/"} replace />}></Route>
        </Routes>
      </Container>
    </>
  );
}

export default App;
