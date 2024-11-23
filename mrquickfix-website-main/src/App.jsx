import React, { Suspense, lazy } from "react";
import MainLayout from "./Layout/MainLayout";
import { Route, Routes } from "react-router-dom";
import SpinLoaderNoBg from "./components/Loader/SpinLoaderNoBg";

// Lazy load the pages
const HomePage = lazy(() => import("./pages/HomePage"));
const ProjectPage = lazy(() => import("./pages/ProjectPage"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));

function App() {
  return (
    <MainLayout>
      <Suspense
        fallback={
          <div className="flex h-screen w-full items-center justify-center">
            <SpinLoaderNoBg />
          </div>
        }
      >
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/Project" element={<ProjectPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </MainLayout>
  );
}

export default App;
