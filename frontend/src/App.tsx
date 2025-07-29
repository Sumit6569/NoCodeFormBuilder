import { Routes, Route } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import { Dashboard } from "./pages/Dashboard";
import { FormBuilder } from "./pages/FormBuilder";
import { FormView } from "./pages/FormView";
import { FormAnalytics } from "./pages/FormAnalytics";

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/builder/:id?" element={<FormBuilder />} />
          <Route path="/form/:id" element={<FormView />} />
          <Route path="/analytics/:id" element={<FormAnalytics />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
