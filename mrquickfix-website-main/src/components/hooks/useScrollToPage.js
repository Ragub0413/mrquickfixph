import { useNavigate } from "react-router-dom";
import { scroller } from "react-scroll";

const useScrollToPage = () => {
  const navigate = useNavigate();

  const scrollToPage = async (target) => {
    if (window.location.pathname !== "/") {
      await navigate("/");
    }

    setTimeout(() => {
      scroller.scrollTo(target, {
        smooth: true,
        duration: 700,
        offset: target === "home" ? -150 : 0,
      });
    }, 100);
  };

  return scrollToPage;
};

export default useScrollToPage;
