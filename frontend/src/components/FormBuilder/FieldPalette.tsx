import { FormField } from "../../types";

interface FieldPaletteProps {
  onAddField: (type: FormField["type"]) => void;
  selectedField: string | null;
  fields: FormField[];
  onUpdateField: (fieldId: string, updates: Partial<FormField>) => void;
  onDeleteField: (fieldId: string) => void;
}

const fieldTypes = [
  { type: "text" as const, label: "Text Input", icon: "📝" },
  { type: "textarea" as const, label: "Text Area", icon: "📄" },
  { type: "email" as const, label: "Email", icon: "📧" },
  { type: "number" as const, label: "Number", icon: "🔢" },
  { type: "date" as const, label: "Date", icon: "📅" },
  { type: "select" as const, label: "Dropdown", icon: "📋" },
  { type: "radio" as const, label: "Radio Buttons", icon: "🔘" },
  { type: "checkbox" as const, label: "Checkbox", icon: "☑️" },
];

export function FieldPalette({
  onAddField,
  selectedField,
  fields,
  onUpdateField,
  onDeleteField,
}: FieldPaletteProps) {
  const selectedFieldData = fields.find((f) => f.id === selectedField);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Add Fields</h3>
        <div className="grid grid-cols-1 gap-2">
          {fieldTypes.map((fieldType) => (
            <button
              key={fieldType.type}
              onClick={() => onAddField(fieldType.type)}
              className="flex items-center space-x-3 p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <span className="text-lg">{fieldType.icon}</span>
              <span className="text-sm font-medium">{fieldType.label}</span>
            </button>
          ))}
        </div>
      </div>

      {selectedFieldData && (
        <div>
          <h3 className="text-lg font-semibold mb-4">Field Properties</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Label
              </label>
              <input
                type="text"
                value={selectedFieldData.label}
                onChange={(e) =>
                  onUpdateField(selectedFieldData.id, { label: e.target.value })
                }
                className="w-full form-field text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Placeholder
              </label>
              <input
                type="text"
                value={selectedFieldData.placeholder || ""}
                onChange={(e) =>
                  onUpdateField(selectedFieldData.id, {
                    placeholder: e.target.value,
                  })
                }
                className="w-full form-field text-sm"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="required"
                checked={selectedFieldData.required}
                onChange={(e) =>
                  onUpdateField(selectedFieldData.id, {
                    required: e.target.checked,
                  })
                }
                className="h-4 w-4 text-primary-600 rounded border-gray-300"
              />
              <label htmlFor="required" className="ml-2 text-sm text-gray-700">
                Required field
              </label>
            </div>

            {(selectedFieldData.type === "select" ||
              selectedFieldData.type === "radio") && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Options
                </label>
                <div className="space-y-2">
                  {selectedFieldData.options?.map((option, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={option}
                        onChange={(e) => {
                          const newOptions = [
                            ...(selectedFieldData.options || []),
                          ];
                          newOptions[index] = e.target.value;
                          onUpdateField(selectedFieldData.id, {
                            options: newOptions,
                          });
                        }}
                        className="flex-1 form-field text-sm"
                      />
                      <button
                        onClick={() => {
                          const newOptions = selectedFieldData.options?.filter(
                            (_, i) => i !== index
                          );
                          onUpdateField(selectedFieldData.id, {
                            options: newOptions,
                          });
                        }}
                        className="text-red-500 hover:text-red-700"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => {
                      const newOptions = [
                        ...(selectedFieldData.options || []),
                        `Option ${
                          (selectedFieldData.options?.length || 0) + 1
                        }`,
                      ];
                      onUpdateField(selectedFieldData.id, {
                        options: newOptions,
                      });
                    }}
                    className="text-sm text-primary-600 hover:text-primary-700"
                  >
                    + Add Option
                  </button>
                </div>
              </div>
            )}

            <div className="pt-4 border-t border-gray-200">
              <button
                onClick={() => onDeleteField(selectedFieldData.id)}
                className="w-full py-2 px-4 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm"
              >
                Delete Field
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
