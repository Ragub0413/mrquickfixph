import { useState, useEffect } from "react";

const useServices = () => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/SampleData/ServicesData.json");
        if (!response.ok) throw new Error("Network response was not ok");
        const jsonData = await response.json();

        // Validate data structure
        const validatedData = jsonData
          .filter(
            (item) =>
              item && item.id && item.title && item.image && item.description
          )
          .map((item) => ({
            id: item.id,
            title: item.title,
            image: item.image,
            description: item.description,
          }));

        setData(validatedData);
      } catch (error) {
        console.error("Error loading JSON:", error);
        setError("Failed to load services.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data, error, loading };
};

export default useServices;
