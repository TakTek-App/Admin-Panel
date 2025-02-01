import { Typography } from "@mui/material";
import ContentWraper from "../components/ContentWraper";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  return (
    <ContentWraper
      name="Home"
      onBack={() => navigate(-1)}
      //  buttonFunction={() => navigate("/users/create")}
    >
      <Typography>Hola soy el home</Typography>
    </ContentWraper>
  );
};

export default Home;
