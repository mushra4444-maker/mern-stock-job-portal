import { Router } from "express";
import Job from "../models/Job.js";
import { protect, allowRoles } from "../middleware/auth.js";

const router = Router();

// View and search jobs
router.get("/", async (req, res, next) => {
  try {
    const filter = {};

    if (req.query.search) {
      const search = String(req.query.search).slice(0, 100);

      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { company: { $regex: search, $options: "i" } },
        { skills: { $regex: search, $options: "i" } }
      ];
    }

    if (req.query.location) {
      filter.location = {
        $regex: String(req.query.location).slice(0, 100),
        $options: "i"
      };
    }

    const jobs = await Job.find(filter)
      .populate("recruiter", "name")
      .sort({ createdAt: -1 });

    res.json(jobs);
  } catch (error) {
    next(error);
  }
});

// Recruiter creates a job
router.post(
  "/",
  protect,
  allowRoles("recruiter"),
  async (req, res, next) => {
    try {
      const { title, company, location, salary, description, skills } = req.body;

      if (!title || !company || !location || !description) {
        return res.status(400).json({
          message: "Title, company, location and description are required."
        });
      }

      const job = await Job.create({
        title,
        company,
        location,
        salary,
        description,
        skills: Array.isArray(skills)
          ? skills
          : String(skills || "").split(",").map(s => s.trim()).filter(Boolean),
        recruiter: req.user.id
      });

      res.status(201).json(job);
    } catch (error) {
      next(error);
    }
  }
);

// Recruiter views their own jobs
router.get(
  "/mine",
  protect,
  allowRoles("recruiter"),
  async (req, res, next) => {
    try {
      const jobs = await Job.find({ recruiter: req.user.id })
        .sort({ createdAt: -1 });

      res.json(jobs);
    } catch (error) {
      next(error);
    }
  }
);

export default router;