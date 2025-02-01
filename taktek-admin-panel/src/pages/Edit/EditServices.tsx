import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ContentWraper from "../../components/ContentWraper";
import { Field, Form, Formik } from "formik";
import { Box, Button, CircularProgress } from "@mui/material";
import { Flip, toast } from "react-toastify";

interface Service {
  id?: number;
  name: string;
  companies?: any[];
}

const EditServices = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [service, setService] = useState<Service>({
    name: "",
  });

  const succesNotify = () =>
    toast.success("Service Updated", {
      autoClose: 2000,
      position: "bottom-right",
      theme: "colored",
      transition: Flip,
    });

  const errorNotify = () =>
    toast.error("Failed to Update the Service", {
      autoClose: 2000,
      position: "bottom-right",
      theme: "colored",
      transition: Flip,
    });

  const getServiceData = async () => {
    try {
      const data = await fetch(`http://localhost:3000/services/${id}`);
      const response = await data.json();
      setService(response);
      console.log(service);
    } catch (error) {
      console.log(error);
    }
  };

  const fieldStyle = {
    width: "500px",
    margin: "20px 10px",
    fontSize: "20px",
    padding: "10px",
    border: "1px solid gray",
    borderRadius: "5px",
  };

  useEffect(() => {
    getServiceData();
  }, []);
  return (
    <ContentWraper name={service.name} onBack={() => navigate(-1)}>
      <Formik
        initialValues={{
          name: service.name,
        }}
        enableReinitialize
        onSubmit={async (values, { setSubmitting }) => {
          setLoading(true);
          setSubmitting(true);
          setService(values);
          const data = await fetch(`http://localhost:3000/services/${id}`, {
            method: "PATCH",
            body: JSON.stringify(values),
            headers: { "Content-Type": "application/json" },
          });

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
        }}
      >
        {loading ? (
          <Box sx={{ display: "flex", height: "300px" }}>
            <CircularProgress sx={{ margin: "auto" }} />
          </Box>
        ) : (
          <Form
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "space-evenly",
              alignItems: "center",
            }}
          >
            <Field name="name" style={fieldStyle} />
            <Button
              type="submit"
              variant="contained"
              size="large"
              sx={{ width: "400px", margin: "20px" }}
            >
              Edit
            </Button>
          </Form>
        )}
      </Formik>
    </ContentWraper>
  );
};

export default EditServices;
