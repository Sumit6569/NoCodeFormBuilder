import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Form } from "../types";

export function Dashboard() {
  const [forms, setForms] = useState<Form[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchForms();
  }, []);

  const fetchForms = async () => {
    try {
      const response = await fetch("/api/forms");
      if (response.ok) {
        const data = await response.json();
        setForms(data);
      }
    } catch (error) {
      console.error("Error fetching forms:", error);
      // For demo purposes, load some sample data
      setForms([
        {
          id: "1",
          title: "Customer Feedback Form",
          description: "Collect feedback from customers",
          fields: [],
          style: { primaryColor: "#3b82f6" },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          isPublished: true,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const duplicateForm = async (form: Form) => {
    const newForm = {
      ...form,
      id: Date.now().toString(),
      title: `${form.title} (Copy)`,
      isPublished: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setForms([...forms, newForm]);
  };

  const deleteForm = async (formId: string) => {
    if (window.confirm("Are you sure you want to delete this form?")) {
      setForms(forms.filter((form) => form.id !== formId));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Forms Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Manage your forms and view analytics
          </p>
        </div>
        <Link to="/builder" className="btn-primary">
          Create New Form
        </Link>
      </div>

      {forms.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
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
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No forms yet
          </h3>
          <p className="text-gray-500 mb-6">
            Get started by creating your first form
          </p>
          <Link to="/builder" className="btn-primary">
            Create Your First Form
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {forms.map((form) => (
            <div
              key={form.id}
              className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {form.title}
                    </h3>
                    {form.description && (
                      <p className="text-gray-600 text-sm">
                        {form.description}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        form.isPublished
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {form.isPublished ? "Published" : "Draft"}
                    </span>
                  </div>
                </div>

                <div className="flex items-center text-sm text-gray-500 mb-4">
                  <span>{form.fields.length} fields</span>
                  <span className="mx-2">•</span>
                  <span>
                    Created {new Date(form.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <Link
                    to={`/builder/${form.id}`}
                    className="flex-1 text-center py-2 px-3 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors text-sm"
                  >
                    Edit
                  </Link>
                  {form.isPublished && (
                    <Link
                      to={`/form/${form.id}`}
                      className="flex-1 text-center py-2 px-3 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors text-sm"
                    >
                      View
                    </Link>
                  )}
                  <Link
                    to={`/analytics/${form.id}`}
                    className="py-2 px-3 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors text-sm"
                  >
                    Analytics
                  </Link>
                </div>

                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                  <button
                    onClick={() => duplicateForm(form)}
                    className="text-sm text-gray-600 hover:text-gray-900"
                  >
                    Duplicate
                  </button>
                  <button
                    onClick={() => deleteForm(form.id)}
                    className="text-sm text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
