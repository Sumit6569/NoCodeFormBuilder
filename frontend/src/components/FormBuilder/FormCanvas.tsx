import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Form, FormField } from "../../types";

interface FormCanvasProps {
  form: Form;
  selectedField: string | null;
  onSelectField: (fieldId: string) => void;
  onUpdateField: (fieldId: string, updates: Partial<FormField>) => void;
  onDeleteField: (fieldId: string) => void;
}

interface SortableFieldProps {
  field: FormField;
  isSelected: boolean;
  onClick: () => void;
}

function SortableField({ field, isSelected, onClick }: SortableFieldProps) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: field.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={onClick}
      className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
        isSelected
          ? "border-primary-500 bg-primary-50"
          : "border-gray-200 hover:border-gray-300"
      }`}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-900">{field.label}</span>
        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
          {field.type}
        </span>
      </div>

      {field.type === "text" && (
        <input
          type="text"
          placeholder={field.placeholder}
          disabled
          className="w-full p-2 border border-gray-300 rounded text-sm bg-gray-50"
        />
      )}

      {field.type === "textarea" && (
        <textarea
          placeholder={field.placeholder}
          disabled
          rows={3}
          className="w-full p-2 border border-gray-300 rounded text-sm bg-gray-50 resize-none"
        />
      )}

      {field.type === "email" && (
        <input
          type="email"
          placeholder={field.placeholder || "Enter email..."}
          disabled
          className="w-full p-2 border border-gray-300 rounded text-sm bg-gray-50"
        />
      )}

      {field.type === "number" && (
        <input
          type="number"
          placeholder={field.placeholder || "Enter number..."}
          disabled
          className="w-full p-2 border border-gray-300 rounded text-sm bg-gray-50"
        />
      )}

      {field.type === "date" && (
        <input
          type="date"
          disabled
          className="w-full p-2 border border-gray-300 rounded text-sm bg-gray-50"
        />
      )}

      {field.type === "select" && (
        <select
          disabled
          className="w-full p-2 border border-gray-300 rounded text-sm bg-gray-50"
        >
          <option>{field.placeholder || "Select an option..."}</option>
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
                disabled
                className="text-primary-600"
              />
              <span className="text-sm text-gray-700">{option}</span>
            </label>
          ))}
        </div>
      )}

      {field.type === "checkbox" && (
        <label className="flex items-center space-x-2">
          <input type="checkbox" disabled className="text-primary-600" />
          <span className="text-sm text-gray-700">{field.label}</span>
        </label>
      )}

      {field.required && (
        <span className="text-xs text-red-500 mt-1 block">* Required</span>
      )}
    </div>
  );
}

export function FormCanvas({
  form,
  selectedField,
  onSelectField,
}: FormCanvasProps) {
  if (form.fields.length === 0) {
    return (
      <div className="h-full flex items-center justify-center text-center">
        <div>
          <div className="mx-auto w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
            <svg
              className="w-6 h-6 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Start building your form
          </h3>
          <p className="text-gray-500">
            Drag and drop fields from the left panel to build your form
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-full p-6 rounded-lg"
      style={{
        backgroundColor: form.style.backgroundColor,
        fontFamily: form.style.fontFamily,
      }}
    >
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {form.title}
          </h2>
          {form.description && (
            <p className="text-gray-600">{form.description}</p>
          )}
        </div>

        <div className="space-y-4">
          {form.fields.map((field) => (
            <SortableField
              key={field.id}
              field={field}
              isSelected={selectedField === field.id}
              onClick={() => onSelectField(field.id)}
            />
          ))}
        </div>

        <div className="mt-8">
          <button
            className="px-6 py-3 rounded-lg font-medium text-white"
            style={{ backgroundColor: form.style.submitButtonColor }}
            disabled
          >
            {form.style.submitButtonText}
          </button>
        </div>
      </div>
    </div>
  );
}
