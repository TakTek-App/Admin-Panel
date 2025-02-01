import { Edit } from "@mui/icons-material";
import { DataGrid, GridActionsCellItem, GridColDef } from "@mui/x-data-grid";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Technicians = ({ id }: { id: any }) => {
  const navigate = useNavigate();
  const [technicians, setTechnicians] = useState<any>();
  const getTechnicians = async () => {
    try {
      const data = await fetch(`http://localhost:3000/companies/${id}`);
      const response = await data.json();
      setTechnicians(response.technicians);
    } catch (error) {}
  };

  const columns: GridColDef[] = [
    { field: "firstName", headerName: "First Name", flex: 1 },
    { field: "lastName", headerName: "Last Name", flex: 1 },
    { field: "email", headerName: "Email", flex: 1 },
    { field: "rating", headerName: "Rating", flex: 1 },
    { field: "verified", headerName: "Status", flex: 1 },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      flex: 1,
      getActions: (params) => [
        <GridActionsCellItem
          icon={<Edit />}
          label="Edit"
          onClick={() => navigate(`/companies/${id}/technicians/${params.id}`)}
        />,
        // <GridActionsCellItem
        //   icon={<Delete />}
        //   label="Delete"
        //   onClick={() => deleteService(params.id)}
        // />,
      ],
    },
  ];

  useEffect(() => {
    getTechnicians();
  }, []);

  const rows = technicians?.map((technician: any) => ({
    ...technician,
    status: technician?.status === true ? "Active" : "Inactive",
  }));

  return <DataGrid columns={columns} rows={rows} />;
};

export default Technicians;
