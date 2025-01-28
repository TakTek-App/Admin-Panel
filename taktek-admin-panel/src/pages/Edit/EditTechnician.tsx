import { useEffect, useState } from "react";
import ContentWraper from "../../components/ContentWraper";
import { useNavigate, useParams } from "react-router-dom";
import { Field, Form, Formik } from "formik";
import {
  Box,
  Button,
  CircularProgress,
  FormControlLabel,
  Switch,
} from "@mui/material";
import { Flip, toast } from "react-toastify";

interface Technician {
  id?: number;
  firstName: string;
  lastName: string;
  email: string;
  verified: boolean;
}

const EditTechnician = () => {
  const { technicianId, companyId } = useParams();
  const navigate = useNavigate();
  const [technician, setTechnician] = useState<Technician>();
  const [loading, setLoading] = useState(false);

  const getTechnician = async () => {
    try {
      const data = await fetch(`http://localhost:3000/companies/${companyId}`);
      const response = await data.json();
      const filtered = await response.technicians.filter((tech: any) => {
        return tech.id == technicianId;
      });

      setTechnician(filtered[0]);
    } catch (error) {
      console.log(error);
    }
  };
  const succesNotify = () =>
    toast.success("Technician Updated", {
      autoClose: 2000,
      position: "bottom-right",
      theme: "colored",
      transition: Flip,
    });
  const errorNotify = () =>
    toast.error("Failed to Update the Technician", {
      autoClose: 2000,
      position: "bottom-right",
      theme: "colored",
      transition: Flip,
    });

  useEffect(() => {
    getTechnician();
    210;
  }, []);

  console.log(technician);

  const fieldStyle = {
    width: "600px",
    margin: "20px 10px",
    fontSize: "20px",
    padding: "10px",
    border: "1px solid gray",
    borderRadius: "5px",
  };
  if (loading) {
    return (
      <Box sx={{ display: "flex", height: "300px" }}>
        <CircularProgress sx={{ margin: "auto" }} />
      </Box>
    );
  }

  return (
    <ContentWraper name="Edit Technician" onBack={() => navigate(-1)}>
      <Formik
        initialValues={{
          firstName: technician?.firstName,
          lastName: technician?.lastName,
          verified: technician?.verified,
          email: technician?.email,
        }}
        enableReinitialize
        onSubmit={async (values, { setSubmitting }) => {
          try {
            const data = await fetch(
              `http://localhost:3000/technicians/${technicianId}`,
              {
                method: "PATCH",
                body: JSON.stringify(values),
                headers: { "Content-Type": "application/json" },
              }
            );
            if (data.status === 200) {
              succesNotify();
              setSubmitting(false);
              setTimeout(() => {
                setLoading(false);
                navigate(-1);
              }, 1000);
            } else {
              errorNotify();
              setTimeout(() => {
                setLoading(false);
              }, 1000);
            }
          } catch (error) {
            console.log(console.error());
          }
        }}
      >
        {({ values, setFieldValue }) => (
          <Form
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-evenly",
              alignItems: "start",
            }}
          >
            <FormControlLabel
              sx={{
                margin: "5px",
              }}
              control={
                <Switch
                  name="verified"
                  checked={values.verified}
                  onChange={(e) => {
                    setFieldValue("verified", e.target.checked);
                  }}
                />
              }
              label={values.verified ? "Verified" : "Not Verified"}
            />
            <Field
              name="firstName"
              placeholder="First Name"
              style={fieldStyle}
            />
            <Field name="lastName" placeholder="Last Name" style={fieldStyle} />

            <Field name="email" placeholder="Email" style={fieldStyle} />
            <Button
              type="submit"
              variant="contained"
              size="large"
              sx={{ width: "600px", margin: "20px 10px" }}
            >
              Save
            </Button>
          </Form>
        )}
      </Formik>
    </ContentWraper>
  );
};

export default EditTechnician;
