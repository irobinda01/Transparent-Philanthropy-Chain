import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import { Layout } from "./components/Layout";
import { Home } from "./pages/Home";
import { CampaignDetails } from "./pages/CampaignDetails";
import { CreateCampaign } from "./pages/CreateCampaign";
import { MyDonations } from "./pages/MyDonations";
import { About } from "./pages/About";

export default function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/campaign/:id" element={<CampaignDetails />} />
          <Route path="/create" element={<CreateCampaign />} />
          <Route path="/donations" element={<MyDonations />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </Layout>
      <Toaster position="bottom-right" />
    </Router>
  );
}