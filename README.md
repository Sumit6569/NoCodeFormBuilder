# No-Code Dynamic Forms Builder

A comprehensive web application for creating, customizing, and managing dynamic forms without any coding knowledge.

## 🚀 Features

### 1. Form Creation & Customization

- **Intuitive Drag-and-Drop Interface**: Build forms effortlessly using a visual editor
- **Rich Field Types**: Support for text, email, number, date, textarea, dropdown, radio buttons, and checkboxes
- **Custom Styling**: Customize colors, fonts, layout, and field alignment
- **Real-time Preview**: See changes instantly as you build

### 2. Form Management

- **Complete CRUD Operations**: Create, read, update, and delete forms
- **Form Dashboard**: Manage multiple forms from a central location
- **Form Duplication**: Clone existing forms for quick setup
- **Publishing System**: Draft and publish forms when ready

### 3. User Interaction

- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Accessible Interface**: Built with accessibility best practices
- **Smooth Submission Process**: User-friendly form filling experience
- **Success Feedback**: Clear confirmation after form submission

### 4. Data Storage & Analytics

- **MongoDB Database**: Scalable NoSQL database with schema validation
- **Response Analytics**: View submission statistics and trends
- **Data Export**: Download responses in CSV and JSON formats
- **Field Analytics**: Track response rates and common answers
- **Advanced Queries**: Leverage MongoDB's aggregation pipeline for insights

## 🛠 Technologies Used

- **Frontend**: React 19 with TypeScript
- **Build Tool**: Vite for fast development and building
- **Styling**: Tailwind CSS for responsive design
- **Drag & Drop**: @dnd-kit for intuitive form building
- **Routing**: React Router for client-side navigation
- **Backend**: Node.js with Express.js
- **Database**: MongoDB with Mongoose ODM for data persistence
- **Schema Validation**: MongoDB schema validation and indexing

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- MongoDB (local installation or MongoDB Atlas account)

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd Bm_infoTechAssingment
```

2. Install dependencies:

```bash
npm install
```

3. **Set up MongoDB**

   **Option A: Local MongoDB**

   - Install MongoDB on your machine
   - Start MongoDB service
   - The app will connect to `mongodb://localhost:27017/dynamic-forms`

   **Option B: MongoDB Atlas (Cloud)**

   - Create a MongoDB Atlas account
   - Create a new cluster
   - Get your connection string
   - Create a `.env` file in the root directory with:
     ```
     MONGODB_URI=your-mongodb-connection-string
     PORT=3001
     ```

   **Option C: Docker (Easiest)**

   ```bash
   docker-compose up -d
   ```

4. Start the development server:

```bash
npm run dev
```

This will start both the frontend (http://localhost:5175) and backend (http://localhost:3001) concurrently.
npm run dev

```

This will start both the frontend (port 3000) and backend (port 3001) simultaneously.

### Available Scripts

- `npm run dev` - Start both frontend and backend in development mode
- `npm run dev:client` - Start only the frontend development server
- `npm run dev:server` - Start only the backend development server
- `npm run build` - Build the frontend for production
- `npm run preview` - Preview the production build
- `npm run server` - Start the backend server

## Usage

### Creating a Form

1. Navigate to the dashboard
2. Click "Create New Form" or "Create Your First Form"
3. Use the drag-and-drop interface to add fields
4. Customize field properties in the right panel
5. Style your form using the Settings tab
6. Preview your form using the Preview tab
7. Save and publish your form

### Managing Forms

- **Edit**: Click the "Edit" button on any form card
- **View**: Click "View" to see the published form
- **Analytics**: Click "Analytics" to see submission data
- **Duplicate**: Use the "Duplicate" option to copy a form
- **Delete**: Remove forms you no longer need

### Form Submission

Users can access published forms via direct links and submit responses. All submissions are automatically stored and can be viewed in the analytics section.

### Data Export

1. Go to the form's analytics page
2. Click the "Export" tab
3. Choose between CSV or JSON format
4. Download your data for external analysis

## Project Structure

```

src/
├── components/
│ ├── FormBuilder/
│ │ ├── FieldPalette.tsx # Drag-and-drop field palette
│ │ ├── FormCanvas.tsx # Form editing canvas
│ │ ├── FormPreview.tsx # Real-time form preview
│ │ └── FormSettings.tsx # Form styling and settings
│ └── Navbar.tsx # Navigation component
├── pages/
│ ├── Dashboard.tsx # Forms management dashboard
│ ├── FormBuilder.tsx # Form creation/editing page
│ ├── FormView.tsx # Form submission page
│ └── FormAnalytics.tsx # Analytics and data export
├── types/
│ └── index.ts # TypeScript type definitions
├── App.tsx # Main application component
├── main.tsx # Application entry point
└── index.css # Global styles and Tailwind

server/
└── index.ts # Express.js API server

```

## API Endpoints

- `GET /api/forms` - Get all forms
- `GET /api/forms/:id` - Get a specific form
- `PUT /api/forms/:id` - Create or update a form
- `DELETE /api/forms/:id` - Delete a form
- `POST /api/forms/:id/submit` - Submit a form response
- `GET /api/forms/:id/submissions` - Get form submissions
- `GET /api/forms/:id/analytics` - Get form analytics

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the ISC License.

## Support

For support or questions, please open an issue in the repository.
```
