import { Form } from "../../types";

interface FormSettingsProps {
  form: Form;
  onUpdateForm: (updates: Partial<Form>) => void;
}

export function FormSettings({ form, onUpdateForm }: FormSettingsProps) {
  const fontOptions = [
    { value: "Inter", label: "Inter" },
    { value: "Arial", label: "Arial" },
    { value: "Georgia", label: "Georgia" },
    { value: "Times New Roman", label: "Times New Roman" },
    { value: "Helvetica", label: "Helvetica" },
  ];

  const colorPresets = [
    "#3b82f6",
    "#ef4444",
    "#10b981",
    "#f59e0b",
    "#8b5cf6",
    "#06b6d4",
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Form Settings</h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Form Title
            </label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => onUpdateForm({ title: e.target.value })}
              className="w-full form-field text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={form.description || ""}
              onChange={(e) => onUpdateForm({ description: e.target.value })}
              rows={3}
              className="w-full form-field text-sm resize-none"
              placeholder="Optional description for your form..."
            />
          </div>
        </div>
      </div>

      <div>
        <h4 className="text-md font-semibold mb-4">Styling</h4>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Background Color
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="color"
                value={form.style.backgroundColor || "#ffffff"}
                onChange={(e) =>
                  onUpdateForm({
                    style: { ...form.style, backgroundColor: e.target.value },
                  })
                }
                className="w-8 h-8 rounded border border-gray-300"
              />
              <input
                type="text"
                value={form.style.backgroundColor || "#ffffff"}
                onChange={(e) =>
                  onUpdateForm({
                    style: { ...form.style, backgroundColor: e.target.value },
                  })
                }
                className="flex-1 form-field text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Primary Color
            </label>
            <div className="flex items-center space-x-2 mb-2">
              <input
                type="color"
                value={form.style.primaryColor || "#3b82f6"}
                onChange={(e) =>
                  onUpdateForm({
                    style: { ...form.style, primaryColor: e.target.value },
                  })
                }
                className="w-8 h-8 rounded border border-gray-300"
              />
              <input
                type="text"
                value={form.style.primaryColor || "#3b82f6"}
                onChange={(e) =>
                  onUpdateForm({
                    style: { ...form.style, primaryColor: e.target.value },
                  })
                }
                className="flex-1 form-field text-sm"
              />
            </div>
            <div className="flex space-x-1">
              {colorPresets.map((color) => (
                <button
                  key={color}
                  onClick={() =>
                    onUpdateForm({
                      style: { ...form.style, primaryColor: color },
                    })
                  }
                  className="w-6 h-6 rounded border border-gray-300"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Font Family
            </label>
            <select
              value={form.style.fontFamily || "Inter"}
              onChange={(e) =>
                onUpdateForm({
                  style: { ...form.style, fontFamily: e.target.value },
                })
              }
              className="w-full form-field text-sm"
            >
              {fontOptions.map((font) => (
                <option key={font.value} value={font.value}>
                  {font.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div>
        <h4 className="text-md font-semibold mb-4">Submit Button</h4>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Button Text
            </label>
            <input
              type="text"
              value={form.style.submitButtonText || "Submit"}
              onChange={(e) =>
                onUpdateForm({
                  style: { ...form.style, submitButtonText: e.target.value },
                })
              }
              className="w-full form-field text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Button Color
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="color"
                value={form.style.submitButtonColor || "#3b82f6"}
                onChange={(e) =>
                  onUpdateForm({
                    style: { ...form.style, submitButtonColor: e.target.value },
                  })
                }
                className="w-8 h-8 rounded border border-gray-300"
              />
              <input
                type="text"
                value={form.style.submitButtonColor || "#3b82f6"}
                onChange={(e) =>
                  onUpdateForm({
                    style: { ...form.style, submitButtonColor: e.target.value },
                  })
                }
                className="flex-1 form-field text-sm"
              />
            </div>
          </div>
        </div>
      </div>

      <div>
        <h4 className="text-md font-semibold mb-4">Publishing</h4>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <span className="text-sm font-medium text-gray-900">
                Form Status
              </span>
              <p className="text-xs text-gray-600">
                {form.isPublished
                  ? "Your form is live and accepting responses"
                  : "Your form is in draft mode"}
              </p>
            </div>
            <span
              className={`px-3 py-1 text-xs rounded-full ${
                form.isPublished
                  ? "bg-green-100 text-green-800"
                  : "bg-yellow-100 text-yellow-800"
              }`}
            >
              {form.isPublished ? "Published" : "Draft"}
            </span>
          </div>

          {form.isPublished && (
            <div className="p-4 bg-blue-50 rounded-lg">
              <span className="text-sm font-medium text-blue-900">
                Share Your Form
              </span>
              <p className="text-xs text-blue-700 mt-1 mb-2">
                Copy this link to share your form with others
              </p>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={`${window.location.origin}/form/${form.id}`}
                  readOnly
                  className="flex-1 form-field text-sm bg-white"
                />
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(
                      `${window.location.origin}/form/${form.id}`
                    );
                    alert("Link copied to clipboard!");
                  }}
                  className="btn-secondary text-sm"
                >
                  Copy
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
