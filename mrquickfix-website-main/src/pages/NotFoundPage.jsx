import React, { useEffect } from "react";
import NotFound from "../components/NotFound";

const NotFoundPage = () => {
  useEffect(() => {
    document.title = "Page Not Found";
  });
  return (
    <>
      <NotFound />
    </>
  );
};

export default NotFoundPage;
