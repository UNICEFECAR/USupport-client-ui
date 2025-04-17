import { useNavigate } from "react-router-dom";

export const useCustomNavigate = () => {
  const navigate = useNavigate();
  const language = localStorage.getItem("language");

  // URL Should include "/"
  const customNavigate = (url, state) => {
    if (url === -1) {
      navigate(-1);
      return;
    }
    navigate(`/${language}/client${url}`, state);
  };

  return customNavigate;
};
