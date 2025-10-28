import { Router } from "express";
import {
  addNote,
  deleteNote,
  updateNote,
  allNote,
  getOneNote,
  listOfCategories,
} from "../controllers/noteController.js";

const router = Router();

router.route("/categories").get(listOfCategories);
router.route("/add").post(addNote);

router.route("/all").get(allNote);

router.route("/categories").get(listOfCategories);
router.route("/delete/:id").delete(deleteNote);
router.route("/update/:id").put(updateNote);
router.route("/one/:id").get(getOneNote);

export default router;
