import { useNavigate, useParams } from "react-router-dom";
import ContentWraper from "../../components/ContentWraper";
import { Box, Tab, Tabs, Typography } from "@mui/material";
import { useState } from "react";
import EditCompanyForm from "../../components/EditCompanyForm";
import Technicians from "../Technicians";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const EditCompany = () => {
  const navigate = useNavigate();
  const [value, setValue] = useState(1);
  const { id } = useParams();

  function CustomTabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
      </div>
    );
  }
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <ContentWraper name="Company Info" onBack={() => navigate(-1)}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs value={value} onChange={handleChange}>
          <Tab value={1} label="Company Info" />
          <Tab value={2} label="Technicians" />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={1}>
        <EditCompanyForm id={id} />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        <Technicians id={id} />
      </CustomTabPanel>
    </ContentWraper>
  );
};

export default EditCompany;
