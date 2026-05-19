import { BrowserRouter, Route, Routes } from "react-router-dom"
import Footer from "./components/layout/Footer"
import Navbar from "./components/layout/Navbar"
import ProtectedRoute from "./components/ProtectedRoute"
import AboutPage from "./pages/AboutPage"
import CampaignDetailPage from "./pages/CampaignDetailPage"
import CampaignsPage from "./pages/CampaignsPage"
import ContactPage from "./pages/ContactPage"
import CreateCampaignPage from "./pages/CreateCampaignPage"
import DashboardPage from "./pages/DashboardPage"
import EditCampaignPage from "./pages/EditCampaignPage"
import FAQPage from "./pages/FAQPage"
import HomePage from "./pages/HomePage"
import LoginPage from "./pages/LoginPage"
import RegisterPage from "./pages/RegisterPage"

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-emerald-50/40 text-slate-800">
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/campaigns" element={<CampaignsPage />} />
          <Route path="/campaigns/:id" element={<CampaignDetailPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/faq" element={<FAQPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/campaigns/create" element={<CreateCampaignPage />} />
            <Route path="/campaigns/:id/edit" element={<EditCampaignPage />} />
          </Route>
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>
  )
}
