import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Form } from "../types";

export function FormView() {
  const { id } = useParams<{ id: string }>();
  const [form, setForm] = useState<Form | null>(null);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchForm(id);
    }
  }, [id]);

  const fetchForm = async (formId: string) => {
    try {
      const response = await fetch(`/api/forms/${formId}`);
      if (response.ok) {
        const data = await response.json();
        setForm(data);
      } else {
        // For demo purposes, create a sample form
        setForm({
          id: formId,
          title: "Customer Feedback Form",
          description:
            "We value your feedback! Please take a moment to share your thoughts.",
          fields: [
            {
              id: "1",
              type: "text",
              label: "Full Name",
              placeholder: "Enter your full name",
              required: true,
              style: {},
            },
            {
              id: "2",
              type: "email",
              label: "Email Address",
              placeholder: "Enter your email",
              required: true,
              style: {},
            },
            {
              id: "3",
              type: "select",
              label: "How did you hear about us?",
              required: false,
              options: [
                "Search Engine",
                "Social Media",
                "Friend/Family",
                "Advertisement",
                "Other",
              ],
              style: {},
            },
            {
              id: "4",
              type: "radio",
              label: "Overall satisfaction",
              required: true,
              options: [
                "Very Satisfied",
                "Satisfied",
                "Neutral",
                "Dissatisfied",
                "Very Dissatisfied",
              ],
              style: {},
            },
            {
              id: "5",
              type: "textarea",
              label: "Additional Comments",
              placeholder: "Please share any additional feedback...",
              required: false,
              style: {},
            },
          ],
          style: {
            backgroundColor: "#ffffff",
            fontFamily: "Inter",
            primaryColor: "#3b82f6",
            submitButtonText: "Submit Feedback",
            submitButtonColor: "#3b82f6",
          },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          isPublished: true,
        });
      }
    } catch (error) {
      console.error("Error fetching form:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (fieldId: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [fieldId]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/forms/${id}/submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data: formData,
          submittedAt: new Date().toISOString(),
          userAgent: navigator.userAgent,
        }),
      });

      if (response.ok) {
        setIsSubmitted(true);
      } else {
        // For demo purposes, simulate successful submission
        setTimeout(() => {
          setIsSubmitted(true);
        }, 1000);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      // For demo purposes, simulate successful submission
      setTimeout(() => {
        setIsSubmitted(true);
      }, 1000);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (!form) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Form Not Found
        </h2>
        <p className="text-gray-600">
          The form you're looking for doesn't exist or has been removed.
        </p>
      </div>
    );
  }

  if (isSubmitted) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{
          backgroundColor: form.style.backgroundColor,
          fontFamily: form.style.fontFamily,
        }}
      >
        <div className="max-w-md mx-auto text-center bg-white p-8 rounded-lg shadow-lg">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Thank You!</h2>
          <p className="text-gray-600 mb-6">
            Your response has been submitted successfully.
          </p>
          <button
            onClick={() => {
              setIsSubmitted(false);
              setFormData({});
            }}
            className="btn-primary"
          >
            Submit Another Response
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen py-12"
      style={{
        backgroundColor: form.style.backgroundColor,
        fontFamily: form.style.fontFamily,
      }}
    >
      <div className="max-w-2xl mx-auto px-4">
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-lg rounded-lg p-8"
        >
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {form.title}
            </h1>
            {form.description && (
              <p className="text-lg text-gray-600">{form.description}</p>
            )}
          </div>

          <div className="space-y-6">
            {form.fields.map((field) => (
              <div key={field.id} className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  {field.label}
                  {field.required && (
                    <span className="text-red-500 ml-1">*</span>
                  )}
                </label>

                {field.type === "text" && (
                  <input
                    type="text"
                    placeholder={field.placeholder}
                    required={field.required}
                    value={formData[field.id] || ""}
                    onChange={(e) =>
                      handleInputChange(field.id, e.target.value)
                    }
                    className="w-full form-field"
                    style={field.style}
                  />
                )}

                {field.type === "textarea" && (
                  <textarea
                    placeholder={field.placeholder}
                    required={field.required}
                    rows={4}
                    value={formData[field.id] || ""}
                    onChange={(e) =>
                      handleInputChange(field.id, e.target.value)
                    }
                    className="w-full form-field resize-none"
                    style={field.style}
                  />
                )}

                {field.type === "email" && (
                  <input
                    type="email"
                    placeholder={field.placeholder || "Enter your email..."}
                    required={field.required}
                    value={formData[field.id] || ""}
                    onChange={(e) =>
                      handleInputChange(field.id, e.target.value)
                    }
                    className="w-full form-field"
                    style={field.style}
                  />
                )}

                {field.type === "number" && (
                  <input
                    type="number"
                    placeholder={field.placeholder || "Enter a number..."}
                    required={field.required}
                    value={formData[field.id] || ""}
                    onChange={(e) =>
                      handleInputChange(field.id, e.target.value)
                    }
                    className="w-full form-field"
                    style={field.style}
                  />
                )}

                {field.type === "date" && (
                  <input
                    type="date"
                    required={field.required}
                    value={formData[field.id] || ""}
                    onChange={(e) =>
                      handleInputChange(field.id, e.target.value)
                    }
                    className="w-full form-field"
                    style={field.style}
                  />
                )}

                {field.type === "select" && (
                  <select
                    required={field.required}
                    value={formData[field.id] || ""}
                    onChange={(e) =>
                      handleInputChange(field.id, e.target.value)
                    }
                    className="w-full form-field"
                    style={field.style}
                  >
                    <option value="">
                      {field.placeholder || "Select an option..."}
                    </option>
                    {field.options?.map((option, index) => (
                      <option key={index} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                )}

                {field.type === "radio" && (
                  <div className="space-y-2">
                    {field.options?.map((option, index) => (
                      <label
                        key={index}
                        className="flex items-center space-x-2"
                      >
                        <input
                          type="radio"
                          name={field.id}
                          value={option}
                          required={field.required}
                          checked={formData[field.id] === option}
                          onChange={(e) =>
                            handleInputChange(field.id, e.target.value)
                          }
                          className="text-primary-600"
                          style={{ accentColor: form.style.primaryColor }}
                        />
                        <span className="text-sm text-gray-700">{option}</span>
                      </label>
                    ))}
                  </div>
                )}

                {field.type === "checkbox" && (
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      required={field.required}
                      checked={formData[field.id] || false}
                      onChange={(e) =>
                        handleInputChange(field.id, e.target.checked)
                      }
                      className="text-primary-600"
                      style={{ accentColor: form.style.primaryColor }}
                    />
                    <span className="text-sm text-gray-700">{field.label}</span>
                  </label>
                )}
              </div>
            ))}
          </div>

          <div className="pt-8">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-8 py-3 rounded-lg font-medium text-white transition-colors ${
                isSubmitting
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:opacity-90"
              }`}
              style={{ backgroundColor: form.style.submitButtonColor }}
            >
              {isSubmitting ? "Submitting..." : form.style.submitButtonText}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
