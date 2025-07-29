import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Form, FormField } from "../types";
import { FieldPalette } from "../components/FormBuilder/FieldPalette";
import { FormCanvas } from "../components/FormBuilder/FormCanvas";
import { FormPreview } from "../components/FormBuilder/FormPreview";
import { FormSettings } from "../components/FormBuilder/FormSettings";

export function FormBuilder() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState<Form>({
    id: id || Date.now().toString(),
    title: "Untitled Form",
    description: "",
    fields: [],
    style: {
      backgroundColor: "#ffffff",
      fontFamily: "Inter",
      primaryColor: "#3b82f6",
      submitButtonText: "Submit",
      submitButtonColor: "#3b82f6",
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isPublished: false,
  });
  const [selectedField, setSelectedField] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"build" | "preview" | "settings">(
    "build"
  );
  const [loading, setLoading] = useState(!!id);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

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
      }
    } catch (error) {
      console.error("Error fetching form:", error);
    } finally {
      setLoading(false);
    }
  };

  const addField = (type: FormField["type"]) => {
    const newField: FormField = {
      id: Date.now().toString(),
      type,
      label: `${type.charAt(0).toUpperCase() + type.slice(1)} Field`,
      placeholder:
        type === "textarea" ? "Enter your response..." : `Enter ${type}...`,
      required: false,
      options:
        type === "select" || type === "radio"
          ? ["Option 1", "Option 2"]
          : undefined,
      style: {},
    };
    setForm((prev) => ({
      ...prev,
      fields: [...prev.fields, newField],
      updatedAt: new Date().toISOString(),
    }));
    setSelectedField(newField.id);
  };

  const updateField = (fieldId: string, updates: Partial<FormField>) => {
    setForm((prev) => ({
      ...prev,
      fields: prev.fields.map((field) =>
        field.id === fieldId ? { ...field, ...updates } : field
      ),
      updatedAt: new Date().toISOString(),
    }));
  };

  const deleteField = (fieldId: string) => {
    setForm((prev) => ({
      ...prev,
      fields: prev.fields.filter((field) => field.id !== fieldId),
      updatedAt: new Date().toISOString(),
    }));
    if (selectedField === fieldId) {
      setSelectedField(null);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = form.fields.findIndex((field) => field.id === active.id);
      const newIndex = form.fields.findIndex((field) => field.id === over.id);

      setForm((prev) => ({
        ...prev,
        fields: arrayMove(prev.fields, oldIndex, newIndex),
        updatedAt: new Date().toISOString(),
      }));
    }
  };

  const saveForm = async () => {
    try {
      const response = await fetch(`/api/forms/${form.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });
      if (response.ok) {
        alert("Form saved successfully!");
      }
    } catch (error) {
      console.error("Error saving form:", error);
      alert("Error saving form");
    }
  };

  const publishForm = async () => {
    const updatedForm = { ...form, isPublished: true };
    setForm(updatedForm);
    await saveForm();
    alert("Form published successfully!");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="h-full">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate("/")}
            className="text-gray-600 hover:text-gray-900"
          >
            ← Back to Dashboard
          </button>
          <input
            type="text"
            value={form.title}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, title: e.target.value }))
            }
            className="text-2xl font-bold bg-transparent border-none outline-none focus:bg-white focus:border focus:border-gray-300 rounded px-2 py-1"
          />
        </div>
        <div className="flex items-center space-x-3">
          <button onClick={saveForm} className="btn-secondary">
            Save
          </button>
          <button onClick={publishForm} className="btn-primary">
            Publish
          </button>
        </div>
      </div>

      <div className="flex border border-gray-200 rounded-lg bg-white overflow-hidden">
        <div className="w-1/4 border-r border-gray-200">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab("build")}
              className={`flex-1 py-3 px-4 text-sm font-medium ${
                activeTab === "build"
                  ? "bg-primary-50 text-primary-600 border-b-2 border-primary-600"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Build
            </button>
            <button
              onClick={() => setActiveTab("settings")}
              className={`flex-1 py-3 px-4 text-sm font-medium ${
                activeTab === "settings"
                  ? "bg-primary-50 text-primary-600 border-b-2 border-primary-600"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Settings
            </button>
          </div>

          <div className="p-4">
            {activeTab === "build" && (
              <FieldPalette
                onAddField={addField}
                selectedField={selectedField}
                fields={form.fields}
                onUpdateField={updateField}
                onDeleteField={deleteField}
              />
            )}
            {activeTab === "settings" && (
              <FormSettings
                form={form}
                onUpdateForm={(updates: Partial<Form>) =>
                  setForm((prev) => ({ ...prev, ...updates }))
                }
              />
            )}
          </div>
        </div>

        <div className="flex-1">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab("build")}
              className={`py-3 px-6 text-sm font-medium ${
                activeTab === "build"
                  ? "bg-primary-50 text-primary-600 border-b-2 border-primary-600"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Editor
            </button>
            <button
              onClick={() => setActiveTab("preview")}
              className={`py-3 px-6 text-sm font-medium ${
                activeTab === "preview"
                  ? "bg-primary-50 text-primary-600 border-b-2 border-primary-600"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Preview
            </button>
          </div>

          <div className="p-6 h-96 overflow-y-auto">
            {activeTab === "preview" ? (
              <FormPreview form={form} />
            ) : (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={form.fields}
                  strategy={verticalListSortingStrategy}
                >
                  <FormCanvas
                    form={form}
                    selectedField={selectedField}
                    onSelectField={setSelectedField}
                    onUpdateField={updateField}
                    onDeleteField={deleteField}
                  />
                </SortableContext>
              </DndContext>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
