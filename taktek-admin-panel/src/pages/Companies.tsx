import { Edit } from "@mui/icons-material";
import ContentWraper from "../components/ContentWraper";
import { DataGrid, GridActionsCellItem, GridColDef } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Companies = () => {
  const navigate = useNavigate();
  const [companies, setCompanies] = useState();

  const getCompanies = async () => {
    try {
      const data = await fetch("http://localhost:3000/companies");
      const response = await data.json();
      setCompanies(response);
    } catch (error) {
      console.log(error);
    }
  };

  const columns: GridColDef[] = [
    { field: "name", headerName: "Company Name", flex: 1 },
    { field: "email", headerName: "Email", flex: 1 },
    { field: "location", headerName: "Location", flex: 1 },
    { field: "amountDue", headerName: "Amount Due", flex: 1 },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      flex: 1,
      getActions: (params) => [
        <GridActionsCellItem
          icon={<Edit />}
          label="Edit"
          onClick={() => navigate(`/companies/${params.id}`)}
        />,
        // <GridActionsCellItem
        //   icon={<Delete />}
        //   label="Delete"
        //   onClick={() => deleteService(params.id)}
        // />,
      ],
    },
  ];

  const rows = companies;

  useEffect(() => {
    getCompanies();
  }, []);
  return (
    <ContentWraper name="Companies" onBack={() => navigate(-1)}>
      <DataGrid
        rows={rows}
        columns={columns}
        sortModel={[{ field: "name", sort: "asc" }]}
      />
    </ContentWraper>
  );
};

export default Companies;
