import "dotenv/config";
import express, { Request, Response } from "express";
import cors from "cors";
import { connectToDatabase } from "./database";
import { Form, FormSubmission } from "./models";

const app = express();
const port = process.env.PORT || 3001;

console.log("🚀 Starting server...");
console.log("📁 Environment:", process.env.NODE_ENV);
console.log("🔗 MongoDB URI:", process.env.MONGODB_URI ? "Set" : "Not Set");

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
console.log("🔌 Connecting to MongoDB...");

// Health check
app.get("/api/health", (_req: Request, res: Response) => {
  res.json({ status: "OK", message: "Server is running" });
});

// Start the server
const startServer = async () => {
  try {
    await connectToDatabase();

    app.listen(port, () => {
      console.log(`🎉 Server running on port ${port}`);
      console.log(`🌐 Frontend: http://localhost:5173`);
      console.log(`🔧 Backend API: http://localhost:${port}/api`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
app.get("/api/health", (_req: Request, res: Response) => {
  res.json({ status: "OK", message: "Server is running" });
});

// Get all forms
app.get("/api/forms", async (_req: Request, res: Response) => {
  try {
    const forms = await Form.find().sort({ createdAt: -1 });
    res.json(forms);
  } catch (error) {
    console.error("Error fetching forms:", error);
    res.status(500).json({ error: "Failed to fetch forms" });
  }
});

// Get a specific form
app.get("/api/forms/:id", async (req: Request, res: Response) => {
  try {
    const form = await Form.findOne({ id: req.params.id });
    if (!form) {
      return res.status(404).json({ error: "Form not found" });
    }
    res.json(form);
  } catch (error) {
    console.error("Error fetching form:", error);
    res.status(500).json({ error: "Failed to fetch form" });
  }
});

// Create a new form
app.post("/api/forms", async (req: Request, res: Response) => {
  try {
    const { title, description, fields, settings } = req.body;

    const form = new Form({
      id: Date.now().toString(),
      title,
      description,
      fields: fields || [],
      settings: settings || {
        backgroundColor: "#ffffff",
        textColor: "#000000",
        submitButtonColor: "#3b82f6",
        submitButtonText: "Submit",
        submitButtonTextColor: "#ffffff",
        showProgress: false,
        showFieldNumbers: false,
        allowFileUploads: false,
        maxFileSize: 10,
        allowedFileTypes: [".jpg", ".jpeg", ".png", ".pdf"],
      },
      isPublished: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await form.save();
    res.status(201).json(form);
  } catch (error) {
    console.error("Error creating form:", error);
    res.status(500).json({ error: "Failed to create form" });
  }
});

// Update a form
app.put("/api/forms/:id", async (req: Request, res: Response) => {
  try {
    const { title, description, fields, settings, isPublished } = req.body;

    const updatedForm = await Form.findOneAndUpdate(
      { id: req.params.id },
      {
        title,
        description,
        fields,
        settings,
        isPublished,
        updatedAt: new Date(),
      },
      { new: true }
    );

    if (!updatedForm) {
      return res.status(404).json({ error: "Form not found" });
    }

    res.json(updatedForm);
  } catch (error) {
    console.error("Error updating form:", error);
    res.status(500).json({ error: "Failed to update form" });
  }
});

// Delete a form
app.delete("/api/forms/:id", async (req: Request, res: Response) => {
  try {
    const deletedForm = await Form.findOneAndDelete({ id: req.params.id });

    if (!deletedForm) {
      return res.status(404).json({ error: "Form not found" });
    }

    // Also delete all submissions for this form
    await FormSubmission.deleteMany({ formId: req.params.id });

    res.json({ message: "Form deleted successfully" });
  } catch (error) {
    console.error("Error deleting form:", error);
    res.status(500).json({ error: "Failed to delete form" });
  }
});

// Submit a form response
app.post("/api/forms/:id/submit", async (req: Request, res: Response) => {
  try {
    const { data } = req.body;

    const form = await Form.findOne({ id: req.params.id });
    if (!form) {
      return res.status(404).json({ error: "Form not found" });
    }

    if (!form.isPublished) {
      return res.status(400).json({ error: "Form is not published" });
    }

    const submission = new FormSubmission({
      formId: req.params.id,
      data,
      submittedAt: new Date(),
    });

    await submission.save();
    res.status(201).json({ message: "Form submitted successfully" });
  } catch (error) {
    console.error("Error submitting form:", error);
    res.status(500).json({ error: "Failed to submit form" });
  }
});

// Get form submissions
app.get("/api/forms/:id/submissions", async (req: Request, res: Response) => {
  try {
    const submissions = await FormSubmission.find({
      formId: req.params.id,
    }).sort({ submittedAt: -1 });
    res.json(submissions);
  } catch (error) {
    console.error("Error fetching submissions:", error);
    res.status(500).json({ error: "Failed to fetch submissions" });
  }
});

// Get form analytics
app.get("/api/forms/:id/analytics", async (req: Request, res: Response) => {
  try {
    const form = await Form.findOne({ id: req.params.id });
    if (!form) {
      return res.status(404).json({ error: "Form not found" });
    }

    const submissions = await FormSubmission.find({ formId: req.params.id });
    const totalSubmissions = submissions.length;

    // Calculate completion rate (assuming all submissions are complete)
    const completionRate = totalSubmissions > 0 ? 100 : 0;

    // Calculate field analytics
    const fieldAnalytics: Record<string, any> = {};

    form.fields.forEach((field: any) => {
      fieldAnalytics[field.id] = {
        label: field.label,
        type: field.type,
        responses: submissions.filter(
          (sub: any) =>
            sub.data[field.id] !== undefined && sub.data[field.id] !== ""
        ).length,
        values: submissions
          .map((sub: any) => sub.data[field.id])
          .filter((val) => val !== undefined && val !== ""),
      };
    });

    // Calculate average completion time (placeholder - would need actual timing data)
    const avgCompletionTime =
      totalSubmissions > 0 ? Math.floor(Math.random() * 300) + 60 : 0;

    const analytics = {
      totalSubmissions,
      completionRate,
      avgCompletionTime,
      fieldAnalytics,
      submissionTrend: submissions.reduce((acc: any, sub: any) => {
        const date = new Date(sub.submittedAt).toDateString();
        acc[date] = (acc[date] || 0) + 1;
        return acc;
      }, {}),
    };

    res.json(analytics);
  } catch (error) {
    console.error("Error fetching analytics:", error);
    res.status(500).json({ error: "Failed to fetch analytics" });
  }
});

// Export form data
app.get("/api/forms/:id/export", async (req: Request, res: Response) => {
  try {
    // For now, just return the submissions as JSON
    // In a real app, you'd generate CSV/Excel files
    const submissions = await FormSubmission.find({ formId: req.params.id });
    res.json({
      format: "json",
      data: submissions,
      exportedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error exporting data:", error as Error);
    res.status(500).json({ error: "Failed to export data" });
  }
});
