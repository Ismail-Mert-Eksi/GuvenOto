import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import VehicleListPage from './pages/VehicleListPage';
import Home from './pages/Home';
import VehicleDetailPage from './pages/VehicleDetailPage';
import Contact from './pages/Contact';
import SearchResultsPage from './pages/SearchResultsPage';
import SparePartsPage from './pages/SparePartsPage';
import SparePartDetailPage from './pages/SparePartDetailPage';
import AdminApp from './admin/AdminApp'; 
import NotFound from './pages/NotFound'; 



const ADMIN_SLUG = import.meta.env.VITE_ADMIN_SLUG || "panel-8742";

const App = () => {
  return (
    <Router>
      <Routes>
        {/* 🔒 Admin Routes - Kendi layout'u ile */}
        <Route path={`/${ADMIN_SLUG}/*`} element={<AdminApp />} />

        {/* 👤 Kullanıcı Routes - Layout ile */}
        <Route
          path="*"
          element={
            <div className="min-h-screen flex flex-col">
              <Navbar />

              {/* Üst ince çizgi */}
              <div className="w-full h-[1px] bg-black" />

              {/* Alt kalın çizgi sadece içerik hizasında */}
              <div className="relative w-full h-[4px]">
                <div className="absolute inset-0 bg-black" />
                <div className="relative max-w-6xl h-[4px] mx-auto bg-gray-800" />
              </div>

              {/* Sayfa içeriği */}
              <main className="flex-grow bg-gray-200">
                <div className="max-w-7xl mx-auto px-6 sm:px-8">
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/vehicles/:vehicleType" element={<VehicleListPage />} />
                    <Route path="/ilan/:ilanNo" element={<VehicleDetailPage />} />
                    <Route path="/search" element={<SearchResultsPage />} />
                    <Route path="/yedek-parca" element={<SparePartsPage />} />
                    <Route path="/yedek-parca/:ilanNo" element={<SparePartDetailPage />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="*" element={<NotFound />} />

                  </Routes>
                </div>
              </main>

              <Footer />
            </div>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
