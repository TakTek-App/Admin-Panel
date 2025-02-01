import { useEffect, useState } from "react";
import ContentWraper from "../components/ContentWraper";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();
  const getCategories = async () => {
    try {
      const data = await fetch("http://localhost:3000/categories");
      const response = await data.json();
      setCategories(response);
    } catch (error) {
      console.log(error);
    }
  };
  const columns: GridColDef[] = [
    { field: "id", headerName: "Id" },
    { field: "name", headerName: "Category Name", flex: 1 },
  ];

  const rows = categories;

  useEffect(() => {
    getCategories();
  }, []);
  return (
    <ContentWraper name="Categories" onBack={() => navigate("/home")}>
      <DataGrid columns={columns} rows={rows} />
    </ContentWraper>
  );
};

export default Categories;
