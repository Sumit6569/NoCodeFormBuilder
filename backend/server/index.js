console.log("=== SERVER WITH MONGODB ===");

//
require("dotenv/config");
console.log("Environment loaded");

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
console.log("Dependencies loaded");

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());
console.log("Middleware configured");

const FieldSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    type: { type: String, required: true },
    label: { type: String, required: true },
    placeholder: String,
    required: { type: Boolean, default: false },
    options: [String],
    style: mongoose.Schema.Types.Mixed, // Allow any object structure for styling
  },
  { _id: false }
); 

const FormSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    description: String,
    fields: [FieldSchema],
    isPublished: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const FormSubmissionSchema = new mongoose.Schema(
  {
    formId: { type: String, required: true },
    data: mongoose.Schema.Types.Mixed,
    submittedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const Form = mongoose.model("Form", FormSchema);
const FormSubmission = mongoose.model("FormSubmission", FormSubmissionSchema);
console.log("Models created");

app.get("/api/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date() });
});

app.get("/api/forms", async (req, res) => {
  try {
    const forms = await Form.find().sort({ updatedAt: -1 });
    res.json(forms);
  } catch (error) {
    console.error("Error fetching forms:", error);
    res.status(500).json({ error: "Failed to fetch forms" });
  }
});

// Get a specific form
app.get("/api/forms/:id", async (req, res) => {
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


app.post("/api/forms", async (req, res) => {
  try {
    console.log("🆕 Creating new form");
    console.log("📄 Request body:", JSON.stringify(req.body, null, 2));

    const { title, description, fields } = req.body;

    // Validate fields array if present
    if (fields && !Array.isArray(fields)) {
      console.log("❌ Fields is not an array:", typeof fields);
      return res.status(400).json({ error: "Fields must be an array" });
    }

    const form = new Form({
      id: Date.now().toString(),
      title: title || "Untitled Form",
      description: description || "",
      fields: fields || [],
      isPublished: false,
    });

    const savedForm = await form.save();
    console.log("✅ Form created successfully:", savedForm.id);
    res.status(201).json(savedForm);
  } catch (error) {
    console.error("Error creating form:", error);
    res
      .status(500)
      .json({ error: "Failed to create form", details: error.message });
  }
});

// Update a form
app.put("/api/forms/:id", async (req, res) => {
  try {
    console.log("📝 Updating form:", req.params.id);
    console.log("📄 Request body:", JSON.stringify(req.body, null, 2));

    const { title, description, fields, isPublished } = req.body;

    if (fields && Array.isArray(fields)) {
      console.log("✅ Fields is valid array with", fields.length, "items");
    } else if (fields) {
      console.log("❌ Fields is not an array:", typeof fields);
      return res.status(400).json({ error: "Fields must be an array" });
    }

    const updatedForm = await Form.findOneAndUpdate(
      { id: req.params.id },
      {
        title,
        description,
        fields: fields || [],
        isPublished,
      },
      { new: true, runValidators: true }
    );

    if (!updatedForm) {
      return res.status(404).json({ error: "Form not found" });
    }

    console.log("✅ Form updated successfully:", updatedForm.id);
    res.json(updatedForm);
  } catch (error) {
    console.error("Error updating form:", error);
    res
      .status(500)
      .json({ error: "Failed to update form", details: error.message });
  }
});


app.delete("/api/forms/:id", async (req, res) => {
  try {
    const deletedForm = await Form.findOneAndDelete({ id: req.params.id });

    if (!deletedForm) {
      return res.status(404).json({ error: "Form not found" });
    }

    await FormSubmission.deleteMany({ formId: req.params.id });
    console.log("✅ Form deleted:", req.params.id);
    res.json({ message: "Form deleted successfully" });
  } catch (error) {
    console.error("Error deleting form:", error);
    res.status(500).json({ error: "Failed to delete form" });
  }
});

app.post("/api/forms/:id/submit", async (req, res) => {
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
    console.log("✅ Form submission saved for form:", req.params.id);
    res.status(201).json({ message: "Form submitted successfully" });
  } catch (error) {
    console.error("Error submitting form:", error);
    res.status(500).json({ error: "Failed to submit form" });
  }
});


app.get("/api/forms/:id/submissions", async (req, res) => {
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
console.log("Routes configured");

async function startServer() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB connected successfully");

    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
      console.log(`Health check: http://localhost:${port}/api/health`);
    });
  } catch (error) {
    console.error("Error starting server:", error);
    process.exit(1);
  }
}

console.log("Starting server...");
startServer().catch(console.error);
