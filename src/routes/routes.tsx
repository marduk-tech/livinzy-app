import { Route, Routes } from "react-router-dom";

//Layouts
import { DashboardLayout } from "../layouts/dashboard-layout";

// Pages
import { AuthenticatedRoute } from "../components/authenticated-route";
import { LoginPage } from "../pages/auth/login";
import Home from "../pages/home";
import { ProfilePage } from "../pages/profile";
import ProjectDetailsPage from "../pages/project/project-details";
import { ProjectImagesPage } from "../pages/project/project-images";
import SearchProjectsPage from "../pages/project/search";
import Projects from "../pages/projects";

export const Router = () => {
  return (
    <Routes>
      <Route element={<DashboardLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/projects" element={<Projects />} />
      </Route>

      <Route element={<AuthenticatedRoute />}>
        <Route path="/profile" element={<ProfilePage />} />
      </Route>

      <Route path="/auth/login" element={<LoginPage />} />

      <Route path="/project/:projectId" element={<ProjectDetailsPage />} />
      <Route
        path="/project/:projectId/images"
        element={<ProjectImagesPage />}
      />

      <Route path="/project/search" element={<SearchProjectsPage />} />

      <Route path="/*" element={<div>404</div>} />
    </Routes>
  );
};
