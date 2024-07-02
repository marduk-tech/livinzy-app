import { Route, Routes } from "react-router-dom";

//Layouts
import { DashboardLayout } from "../layouts/dashboard-layout";

// Pages
import { LoginPage } from "../pages/auth/login";
import Home from "../pages/home";
import Projects from "../pages/projects";
import Project from "../pages/project";

export const Router = () => {
  return (
    <Routes>
      <Route element={<DashboardLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/projects" element={<Projects />} />
      </Route>

      <Route path="/auth/login" element={<LoginPage />} />

      <Route path="/project/:projectId" element={<Project />} />

      <Route path="/*" element={<div>404</div>} />
    </Routes>
  );
};
