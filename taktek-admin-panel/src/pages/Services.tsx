import {
  DataGrid,
  GridActionsCellItem,
  GridColDef,
  GridRowId,
} from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import ContentWraper from "../components/ContentWraper";
import { useNavigate } from "react-router-dom";
import { Delete, Edit } from "@mui/icons-material";
import { Flip, toast } from "react-toastify";

const Services = () => {
  const [services, setServices] = useState([]);
  const navigate = useNavigate();
  const getServices = async () => {
    try {
      const data = await fetch("http://localhost:3000/services");
      const result = await data.json();
      setServices(result);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getServices();
  }, []);

  const succesNotify = () =>
    toast.success("Service Deleted", {
      autoClose: 2000,
      position: "bottom-right",
      theme: "colored",
      transition: Flip,
    });

  const deleteService = async (id: GridRowId) => {
    await fetch(`http://localhost:3000/services/${id}`, {
      method: "DELETE",
    });
    succesNotify();
    getServices();
  };

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", flex: 0.5 },
    { field: "name", headerName: "Service Name", flex: 1 },
    { field: "categoryId", headerName: "Category", flex: 1 },
    {
      field: "actions",
      type: "actions",
      headerName: "Phone",
      flex: 1,
      getActions: (params) => {
        return [
          <GridActionsCellItem
            icon={<Edit />}
            label="Edit"
            onClick={() => navigate(`/services/${params.id}`)}
          />,
          <GridActionsCellItem
            icon={<Delete />}
            label="Delete"
            onClick={() => deleteService(params.id)}
          />,
        ];
      },
    },
  ];

  const rows = services;
  const paginationModel = { page: 0, pageSize: 10 };
  return (
    <ContentWraper
      name="Services"
      buttonName="Create Service"
      buttonFunction={() => navigate("/services/create")}
      onBack={() => navigate(-1)}
    >
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{ pagination: { paginationModel } }}
        pageSizeOptions={[10, 20]}
      />
    </ContentWraper>
  );
};

export default Services;
