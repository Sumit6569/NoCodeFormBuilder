export interface FormField {
  id: string;
  type:
    | "text"
    | "textarea"
    | "select"
    | "radio"
    | "checkbox"
    | "email"
    | "number"
    | "date";
  label: string;
  placeholder?: string;
  required: boolean;
  options?: string[];
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    message?: string;
  };
  style?: {
    width?: string;
    fontSize?: string;
    color?: string;
    backgroundColor?: string;
    borderColor?: string;
    borderRadius?: string;
  };
}

export interface Form {
  id: string;
  title: string;
  description?: string;
  fields: FormField[];
  style: {
    backgroundColor?: string;
    fontFamily?: string;
    primaryColor?: string;
    submitButtonText?: string;
    submitButtonColor?: string;
  };
  createdAt: string;
  updatedAt: string;
  isPublished: boolean;
}

export interface FormSubmission {
  id: string;
  formId: string;
  data: Record<string, any>;
  submittedAt: string;
  ipAddress?: string;
  userAgent?: string;
}

export interface FormAnalytics {
  formId: string;
  totalSubmissions: number;
  submissionsToday: number;
  submissionsThisWeek: number;
  submissionsThisMonth: number;
  averageCompletionTime?: number;
  fieldAnalytics: {
    fieldId: string;
    fieldLabel: string;
    responses: number;
    mostCommonValue?: string;
  }[];
}
