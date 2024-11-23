import { useEffect, useState } from "react";

const useBGCarousel = () => {
  const [backgrounds, setBackgrounds] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch("/SampleData/BackgroundCarouselData.json");
        if (!response.ok) throw new Error("Failed to load background images.");
        const data = await response.json();
        const imageUrls = data.map((item) => item.image);
        setBackgrounds(imageUrls);
      } catch (err) {
        console.error("Error loading JSON:", err);
        setError("Failed to load background images.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { backgrounds, error, loading };
};

export default useBGCarousel;