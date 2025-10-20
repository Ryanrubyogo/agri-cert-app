import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout'; // Import the new Layout
import FarmersListPage from './pages/FarmersListPage';
import FarmerDetailPage from './pages/FarmerDetailPage';
import InspectionFormPage from './pages/InspectionFormPage';

function App() {
  return (
    <BrowserRouter>
      <Layout> {/* The Layout component now wraps the pages */}
        <Routes>
          <Route path="/" element={<FarmersListPage />} />
          <Route path="/farmers/:farmerId" element={<FarmerDetailPage />} />
          <Route path="/farms/:farmId/inspect" element={<InspectionFormPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;