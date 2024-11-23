import React, { lazy, Suspense } from "react";
import SpinLoader from "../Loader/SpinLoader";
import NoProjectAvailable from "../Loader/NoProjectAvailable";

// Lazy load
const ProjectCard = lazy(() => import("./ProjectCard"));

const ProjectCardList = ({ data }) => (
  <Suspense
    fallback={
      <div className="flex justify-center">
        <SpinLoader />
      </div>
    }
  >
    <section className="flex flex-wrap items-center justify-center">
      {data.length > 0 ? (
        data.map((project) => (
          <ProjectCard key={project.id} projectdata={project} />
        ))
      ) : (
        <NoProjectAvailable />
      )}
    </section>
  </Suspense>
);

export default ProjectCardList;
