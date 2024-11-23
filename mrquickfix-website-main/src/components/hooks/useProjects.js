import { useEffect, useState, useRef } from "react";

const useProjects = ({
  limit = null,
  selectedCategory = "Latest",
  projectsPerPage = 6,
  currentPage = 1,
} = {}) => {
  const [data, setData] = useState([]);
  const [totalProjects, setTotalProjects] = useState(0);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const cache = useRef({});

  useEffect(() => {
    const cacheKey = `${selectedCategory}-${projectsPerPage}`;

    if (cache.current[cacheKey]) {
      const cachedData = cache.current[cacheKey];

      setTotalProjects(cachedData.totalProjects);
      setLoading(false);

      const startIndex = (currentPage - 1) * projectsPerPage;
      const paginatedData = cachedData.data.slice(startIndex, startIndex + projectsPerPage);

      setData(paginatedData);
    } else {
      // Fetch new data if not cached
      const fetchData = async () => {
        setLoading(true);
        try {
          const response = await fetch("/SampleData/ProjectData.json");
          if (!response.ok) throw new Error("Network response was not ok");
          const jsonData = await response.json();

          // Validate and filter data
          let validatedData = jsonData.filter(
            (item) =>
              item &&
              item.id &&
              item.date &&
              item.thumbnail &&
              item.name &&
              item.category
          );

          // Sort projects by date
          validatedData = validatedData.sort(
            (a, b) => new Date(b.date) - new Date(a.date)
          );

          if (selectedCategory && selectedCategory !== "Latest") {
            validatedData = validatedData.filter((project) =>
              project.category.includes(selectedCategory)
            );
          }

          // Cache the filtered data
          cache.current[cacheKey] = {
            data: validatedData,
            totalProjects: validatedData.length,
          };

          setTotalProjects(validatedData.length);

          const startIndex = (currentPage - 1) * projectsPerPage;
          const paginatedData = validatedData.slice(startIndex, startIndex + projectsPerPage);

          setData(paginatedData);
        } catch (error) {
          console.error("Error loading JSON:", error);
          setError("Failed to load projects.");
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }
  }, [limit, selectedCategory, projectsPerPage, currentPage]);

  return { data, totalProjects, error, loading };
};

export default useProjects;