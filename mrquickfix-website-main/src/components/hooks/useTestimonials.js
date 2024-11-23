import { useEffect, useState } from "react";

const useTestimonials = (limit = null) => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch("/SampleData/TestimonialData.json");
        if (!response.ok) throw new Error("Network response was not ok");
        const jsonData = await response.json();

        // Validate and process data
        let validatedData = jsonData.filter(
          (item) =>
            item &&
            item.id &&
            item.name &&
            item.image &&
            item.feedback &&
            item.date
        );

        validatedData = validatedData.sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        );

        if (limit) {
          validatedData = validatedData.slice(0, limit);
        }

        setData(validatedData);
      } catch (error) {
        console.error("Error loading JSON:", error);
        setError("Failed to load testimonials.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [limit]);

  return { data, error, loading };
};

export default useTestimonials;
