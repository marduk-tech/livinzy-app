import { Route, Routes } from "react-router-dom";

//Layouts
import { DashboardLayout } from "../layouts/dashboard-layout";

// Pages
import { AuthenticatedRoute } from "../components/authenticated-route";
import { useDevice } from "../libs/device";
import AskPage from "../pages/ask";

import { LoginPage } from "../pages/auth/login";
import Home from "../pages/home";
import { ProfilePage } from "../pages/profile";
import ProjectDetailsPage from "../pages/project/project-details";
import { ProjectImagesPage } from "../pages/project/project-images";
import SearchProjectsPage from "../pages/project/search";
import Projects from "../pages/projects";
import SpaceDetails from "../pages/space/space-details";

export const Router = () => {
  const { isMobile } = useDevice();

  return (
    <Routes>
      <Route element={<DashboardLayout />}>
        {isMobile ? null : (
          <>
            <Route
              path="/project/:projectId"
              element={<ProjectDetailsPage />}
            />
          </>
        )}
        <Route path="/" element={<Home />} />
        <Route path="/projects" element={<Projects />} />
      </Route>
      {!isMobile ? null : (
        <>
          <Route path="/project/:projectId" element={<ProjectDetailsPage />} />
        </>
      )}
      <Route
        path="/project/:projectId/space/:spaceId"
        element={<SpaceDetails />}
      />
      <Route element={<AuthenticatedRoute />}>
        <Route path="/profile" element={<ProfilePage />} />
      </Route>

      <Route path="/auth/login" element={<LoginPage />} />

      <Route
        path="/project/:projectId/images"
        element={<ProjectImagesPage />}
      />

      <Route path="/project/search" element={<SearchProjectsPage />} />

      <Route path="/ask" element={<AskPage />} />

      <Route path="/*" element={<div>404</div>} />
    </Routes>
  );
};
