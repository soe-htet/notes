import Note from "../models/Note.js";

export const addNote = async (req, res) => {
  try {
    const {
      title,
      description,
      date = Date.now(),
      category = "general",
    } = req.body;

    if (!title || !description)
      return res.status(200).json({
        success: false,
        message: "Title and Description are required",
      });

    const newNote = await Note.create({
      title,
      description,
      date: date || Date.now(),
      category: category || "general",
      owner: req.user._id,
    });

    return res.status(200).json({
      success: true,
      message: "New Note Created",
    });
  } catch (err) {
    console.log(err);
    return res.status(401).json({
      success: false,
      message: "Something Went Wrong",
    });
  }
};

export const updateNote = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(401).json({
      success: false,
      message: "No Id provided",
    });
  }

  try {
    const { title, description, date, category } = req.body;

    if (!title && !description && !date && !category) {
      return res.status(409).json({
        success: false,
        message: "Title, Description and Date are required",
      });
    }

    const note = await Note.findOneAndUpdate(
      { _id: id, owner: req.user._id },
      { title, description, date, category }
    );
    if (!note)
      return res.status(404).json({
        success: false,
        message: `No Note with the id Found`,
      });

    return res.status(200).json({
      success: true,
      message: "Note Updated",
    });
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Something Went Wrong",
    });
  }
};

export const deleteNote = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(401).json({
      success: false,
      message: "No Id provided",
    });
  }

  try {
    const note = await Note.findOneAndDelete({ _id: id, owner: req.user._id });
    if (!note)
      return res.status(404).json({
        success: false,
        message: `No Note with the id Found`,
      });

    return res.status(200).json({
      success: true,
      message: "Note Deleted",
    });
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Something Went Wrong",
    });
  }
};

export const allNote = async (req, res) => {
  const page = Math.max(parseInt(req.query.page ?? "1", 10), 1);
  const limit = Math.max(parseInt(req.query.limit ?? "10", 10), 20);

  const { q, category, sortBy = "createdAt", sortDir = "desc" } = req.query;

  const filter = { owner: req.user._id };

  if (category && category.toLowerCase() !== "all") {
    filter.category = category;
  }

  if (q && q.trim()) {
    filter.$text = { $search: q.trim() };
  }
  console.log(filter);

  const sort = { [sortBy]: sortDir === "asc" ? 1 : -1 };

  const skip = (page - 1) * limit;

  const [items, total] = await Promise.all([
    Note.find(filter).sort(sort).skip(skip).limit(limit),
    Note.countDocuments(filter),
  ]);

  return res.status(200).json({
    success: true,
    notes: items,
    page,
    limit,
    total,
    hasMore: skip + items.length < total,
  });
};
export const getOneNote = async (req, res) => {
  const { id } = req.params;

  const note = await Note.findById(id);
  if (!note) {
    return res.status(404).json({ success: false, message: "No Not found" });
  }

  return res.status(200).json({ success: true, note });
};

export const listOfCategories = async (req, res) => {
  const categories = await Note.aggregate([
    { $match: { owner: req.user._id } },
    { $group: { _id: "$category", count: { $sum: 1 } } },
  ]);

  return res.status(200).json({ success: true, categories });
};
