import React, { useEffect } from "react";
import AllProject from "../components/Project/AllProject";

const ProjectPage = () => {
  useEffect(() => {
    document.title = "Mr. Quick Fix | Projects";
  }, []);
  return (
    <>
      <AllProject />
    </>
  );
};

export default ProjectPage;
