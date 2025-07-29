import { useState } from "react";
import { Form } from "../../types";

interface FormPreviewProps {
  form: Form;
}

export function FormPreview({ form }: FormPreviewProps) {
  const [formData, setFormData] = useState<Record<string, any>>({});

  const handleInputChange = (fieldId: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [fieldId]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    alert("Form submitted successfully! (This is a preview)");
  };

  return (
    <div
      className="min-h-full p-6 rounded-lg"
      style={{
        backgroundColor: form.style.backgroundColor,
        fontFamily: form.style.fontFamily,
      }}
    >
      <div className="max-w-2xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {form.title}
            </h2>
            {form.description && (
              <p className="text-lg text-gray-600">{form.description}</p>
            )}
          </div>

          {form.fields.map((field) => (
            <div key={field.id} className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                {field.label}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </label>

              {field.type === "text" && (
                <input
                  type="text"
                  placeholder={field.placeholder}
                  required={field.required}
                  value={formData[field.id] || ""}
                  onChange={(e) => handleInputChange(field.id, e.target.value)}
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
                  onChange={(e) => handleInputChange(field.id, e.target.value)}
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
                  onChange={(e) => handleInputChange(field.id, e.target.value)}
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
                  onChange={(e) => handleInputChange(field.id, e.target.value)}
                  className="w-full form-field"
                  style={field.style}
                />
              )}

              {field.type === "date" && (
                <input
                  type="date"
                  required={field.required}
                  value={formData[field.id] || ""}
                  onChange={(e) => handleInputChange(field.id, e.target.value)}
                  className="w-full form-field"
                  style={field.style}
                />
              )}

              {field.type === "select" && (
                <select
                  required={field.required}
                  value={formData[field.id] || ""}
                  onChange={(e) => handleInputChange(field.id, e.target.value)}
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
                    <label key={index} className="flex items-center space-x-2">
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
                  />
                  <span className="text-sm text-gray-700">{field.label}</span>
                </label>
              )}
            </div>
          ))}

          <div className="pt-6">
            <button
              type="submit"
              className="px-8 py-3 rounded-lg font-medium text-white transition-colors hover:opacity-90"
              style={{ backgroundColor: form.style.submitButtonColor }}
            >
              {form.style.submitButtonText}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
