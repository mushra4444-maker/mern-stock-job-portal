import { Router } from "express";
import Application from "../models/Application.js";
import Job from "../models/Job.js";
import { protect, allowRoles } from "../middleware/auth.js";

const router = Router();

// Job seeker applies for a job
router.post(
  "/:jobId",
  protect,
  allowRoles("jobseeker"),
  async (req, res, next) => {
    try {
      const job = await Job.findById(req.params.jobId);

      if (!job) {
        return res.status(404).json({ message: "Job not found." });
      }

      const application = await Application.create({
        job: job._id,
        applicant: req.user.id,
        coverLetter: req.body.coverLetter || ""
      });

      res.status(201).json(application);
    } catch (error) {
      if (error.code === 11000) {
        return res.status(409).json({
          message: "You already applied for this job."
        });
      }
      next(error);
    }
  }
);

// Job seeker views their applications
router.get(
  "/mine",
  protect,
  allowRoles("jobseeker"),
  async (req, res, next) => {
    try {
      const applications = await Application.find({
        applicant: req.user.id
      })
        .populate("job")
        .sort({ createdAt: -1 });

      res.json(applications);
    } catch (error) {
      next(error);
    }
  }
);

// Recruiter views applications for their jobs
router.get(
  "/recruiter",
  protect,
  allowRoles("recruiter"),
  async (req, res, next) => {
    try {
      const jobs = await Job.find({ recruiter: req.user.id }).select("_id");

      const applications = await Application.find({
        job: { $in: jobs.map(job => job._id) }
      })
        .populate("job", "title company")
        .populate("applicant", "name email")
        .sort({ createdAt: -1 });

      res.json(applications);
    } catch (error) {
      next(error);
    }
  }
);

// Recruiter updates application status
router.patch(
  "/:applicationId/status",
  protect,
  allowRoles("recruiter"),
  async (req, res, next) => {
    try {
      const application = await Application.findById(
        req.params.applicationId
      ).populate("job");

      if (!application) {
        return res.status(404).json({ message: "Application not found." });
      }

      if (String(application.job.recruiter) !== req.user.id) {
        return res.status(403).json({ message: "Access denied." });
      }

      const allowed = ["Submitted", "Under review", "Shortlisted", "Rejected"];

      if (!allowed.includes(req.body.status)) {
        return res.status(400).json({ message: "Invalid status." });
      }

      application.status = req.body.status;
      await application.save();

      res.json(application);
    } catch (error) {
      next(error);
    }
  }
);

export default router;