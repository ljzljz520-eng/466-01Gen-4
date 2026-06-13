import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "@/pages/Home";
import NodeDetail from "@/pages/NodeDetail";
import { LoginModal } from "@/components/LoginModal";
import { RegisterModal } from "@/components/RegisterModal";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/node/:id" element={<NodeDetail />} />
      </Routes>
      <LoginModal />
      <RegisterModal />
    </Router>
  );
}
