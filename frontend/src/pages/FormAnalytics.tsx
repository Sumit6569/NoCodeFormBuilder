import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Form,
  FormSubmission,
  FormAnalytics as FormAnalyticsType,
} from "../types";

export function FormAnalytics() {
  const { id } = useParams<{ id: string }>();
  const [form, setForm] = useState<Form | null>(null);
  const [submissions, setSubmissions] = useState<FormSubmission[]>([]);
  const [analytics, setAnalytics] = useState<FormAnalyticsType | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<
    "overview" | "responses" | "export"
  >("overview");

  useEffect(() => {
    if (id) {
      fetchFormData(id);
    }
  }, [id]);

  const fetchFormData = async (formId: string) => {
    try {
      // Fetch form details
      const formResponse = await fetch(`/api/forms/${formId}`);
      // Fetch submissions
      const submissionsResponse = await fetch(
        `/api/forms/${formId}/submissions`
      );
      // Fetch analytics
      const analyticsResponse = await fetch(`/api/forms/${formId}/analytics`);

      // For demo purposes, create sample data
      const sampleForm: Form = {
        id: formId,
        title: "Customer Feedback Form",
        description: "Collect feedback from customers",
        fields: [
          {
            id: "1",
            type: "text",
            label: "Full Name",
            required: true,
            style: {},
          },
          { id: "2", type: "email", label: "Email", required: true, style: {} },
          {
            id: "3",
            type: "radio",
            label: "Satisfaction",
            required: true,
            options: ["Very Satisfied", "Satisfied", "Neutral", "Dissatisfied"],
            style: {},
          },
          {
            id: "4",
            type: "textarea",
            label: "Comments",
            required: false,
            style: {},
          },
        ],
        style: { primaryColor: "#3b82f6" },
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date().toISOString(),
        isPublished: true,
      };

      const sampleSubmissions: FormSubmission[] = [
        {
          id: "1",
          formId: formId,
          data: {
            "1": "John Doe",
            "2": "john@example.com",
            "3": "Very Satisfied",
            "4": "Great service!",
          },
          submittedAt: new Date(
            Date.now() - 2 * 24 * 60 * 60 * 1000
          ).toISOString(),
        },
        {
          id: "2",
          formId: formId,
          data: {
            "1": "Jane Smith",
            "2": "jane@example.com",
            "3": "Satisfied",
            "4": "Good experience overall",
          },
          submittedAt: new Date(
            Date.now() - 1 * 24 * 60 * 60 * 1000
          ).toISOString(),
        },
        {
          id: "3",
          formId: formId,
          data: {
            "1": "Bob Johnson",
            "2": "bob@example.com",
            "3": "Very Satisfied",
            "4": "Excellent!",
          },
          submittedAt: new Date().toISOString(),
        },
      ];

      const sampleAnalytics: FormAnalyticsType = {
        formId: formId,
        totalSubmissions: 3,
        submissionsToday: 1,
        submissionsThisWeek: 3,
        submissionsThisMonth: 3,
        averageCompletionTime: 120,
        fieldAnalytics: [
          {
            fieldId: "1",
            fieldLabel: "Full Name",
            responses: 3,
            mostCommonValue: "N/A",
          },
          {
            fieldId: "2",
            fieldLabel: "Email",
            responses: 3,
            mostCommonValue: "N/A",
          },
          {
            fieldId: "3",
            fieldLabel: "Satisfaction",
            responses: 3,
            mostCommonValue: "Very Satisfied",
          },
          {
            fieldId: "4",
            fieldLabel: "Comments",
            responses: 2,
            mostCommonValue: "N/A",
          },
        ],
      };

      setForm(sampleForm);
      setSubmissions(sampleSubmissions);
      setAnalytics(sampleAnalytics);
    } catch (error) {
      console.error("Error fetching form data:", error);
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = () => {
    if (!form || submissions.length === 0) return;

    const headers = [
      "Submission ID",
      "Submitted At",
      ...form.fields.map((f) => f.label),
    ];
    const rows = submissions.map((submission) => [
      submission.id,
      new Date(submission.submittedAt).toLocaleString(),
      ...form.fields.map((field) => submission.data[field.id] || ""),
    ]);

    const csvContent = [headers, ...rows]
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${form.title}_responses.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (!form || !analytics) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Form Not Found
        </h2>
        <p className="text-gray-600">
          The form you're looking for doesn't exist.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <Link to="/" className="text-gray-600 hover:text-gray-900">
            ← Back to Dashboard
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">
            {form.title} - Analytics
          </h1>
        </div>
        <div className="flex items-center space-x-3">
          <Link to={`/form/${form.id}`} className="btn-secondary">
            View Form
          </Link>
          <Link to={`/builder/${form.id}`} className="btn-secondary">
            Edit Form
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab("overview")}
            className={`py-3 px-6 text-sm font-medium ${
              activeTab === "overview"
                ? "bg-primary-50 text-primary-600 border-b-2 border-primary-600"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab("responses")}
            className={`py-3 px-6 text-sm font-medium ${
              activeTab === "responses"
                ? "bg-primary-50 text-primary-600 border-b-2 border-primary-600"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Responses ({analytics.totalSubmissions})
          </button>
          <button
            onClick={() => setActiveTab("export")}
            className={`py-3 px-6 text-sm font-medium ${
              activeTab === "export"
                ? "bg-primary-50 text-primary-600 border-b-2 border-primary-600"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Export
          </button>
        </div>

        <div className="p-6">
          {activeTab === "overview" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {analytics.totalSubmissions}
                  </div>
                  <div className="text-sm text-blue-600">Total Responses</div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {analytics.submissionsToday}
                  </div>
                  <div className="text-sm text-green-600">Today</div>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">
                    {analytics.submissionsThisWeek}
                  </div>
                  <div className="text-sm text-purple-600">This Week</div>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600">
                    {analytics.submissionsThisMonth}
                  </div>
                  <div className="text-sm text-yellow-600">This Month</div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">Field Analytics</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Field
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Responses
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Response Rate
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Most Common
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {analytics.fieldAnalytics.map((field) => (
                        <tr key={field.fieldId}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {field.fieldLabel}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {field.responses}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {Math.round(
                              (field.responses / analytics.totalSubmissions) *
                                100
                            )}
                            %
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {field.mostCommonValue || "N/A"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === "responses" && (
            <div>
              <div className="space-y-4">
                {submissions.map((submission) => (
                  <div
                    key={submission.id}
                    className="border border-gray-200 rounded-lg p-4"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium text-gray-900">
                        Response #{submission.id}
                      </span>
                      <span className="text-sm text-gray-500">
                        {new Date(submission.submittedAt).toLocaleString()}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {form.fields.map((field) => (
                        <div key={field.id}>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            {field.label}
                          </label>
                          <div className="text-sm text-gray-900">
                            {submission.data[field.id] || "No response"}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}

                {submissions.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No responses yet.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "export" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Export Options</h3>
                <div className="space-y-4">
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-md font-medium text-gray-900">
                          CSV Export
                        </h4>
                        <p className="text-sm text-gray-600">
                          Download all responses as a CSV file for analysis in
                          Excel or other tools.
                        </p>
                      </div>
                      <button
                        onClick={exportToCSV}
                        className="btn-primary"
                        disabled={submissions.length === 0}
                      >
                        Download CSV
                      </button>
                    </div>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-md font-medium text-gray-900">
                          JSON Export
                        </h4>
                        <p className="text-sm text-gray-600">
                          Download responses in JSON format for developers and
                          integrations.
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          const jsonContent = JSON.stringify(
                            submissions,
                            null,
                            2
                          );
                          const blob = new Blob([jsonContent], {
                            type: "application/json",
                          });
                          const url = window.URL.createObjectURL(blob);
                          const a = document.createElement("a");
                          a.href = url;
                          a.download = `${form.title}_responses.json`;
                          a.click();
                          window.URL.revokeObjectURL(url);
                        }}
                        className="btn-secondary"
                        disabled={submissions.length === 0}
                      >
                        Download JSON
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">Data Summary</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Total Responses:</span>{" "}
                      {analytics.totalSubmissions}
                    </div>
                    <div>
                      <span className="font-medium">Form Created:</span>{" "}
                      {new Date(form.createdAt).toLocaleDateString()}
                    </div>
                    <div>
                      <span className="font-medium">Last Updated:</span>{" "}
                      {new Date(form.updatedAt).toLocaleDateString()}
                    </div>
                    <div>
                      <span className="font-medium">Status:</span>{" "}
                      {form.isPublished ? "Published" : "Draft"}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
