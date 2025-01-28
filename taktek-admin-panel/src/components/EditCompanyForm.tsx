import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  FormGroup,
  Typography,
} from "@mui/material";
import { Field, Form, Formik } from "formik";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Flip, toast } from "react-toastify";

interface Company {
  id?: number;
  name: string;
  email: string;
  address: string;
  city: string;
  zipCode: string;
  services?: Service[] | number[];
}

interface Service {
  id: number;
  name: string;
  categoryId: number;
}

const EditCompanyForm = ({ id }: { id: any }) => {
  const navigate = useNavigate();
  const [services, setServices] = useState<Service[]>();
  const [companyInfo, setCompanyInfo] = useState<Company>({
    name: "",
    email: "",
    address: "",
    city: "",
    zipCode: "",
    services: [],
  });
  const [loading, setLoading] = useState(false);

  const getCompanyInfo = async () => {
    try {
      const data = await fetch(`http://localhost:3000/companies/${id}`);
      const response = await data.json();
      setCompanyInfo(response);
    } catch (error) {
      console.log(error);
    }
  };
  const getServices = async () => {
    const data = await fetch("http://localhost:3000/services");
    const response = await data.json();
    setServices(response);
  };
  const succesNotify = () =>
    toast.success("Company Updated", {
      autoClose: 2000,
      position: "bottom-right",
      theme: "colored",
      transition: Flip,
    });
  const errorNotify = () =>
    toast.error("Failed to Update the Company", {
      autoClose: 2000,
      position: "bottom-right",
      theme: "colored",
      transition: Flip,
    });

  const fieldStyle = {
    width: "600px",
    margin: "20px 10px",
    fontSize: "20px",
    padding: "10px",
    border: "1px solid gray",
    borderRadius: "5px",
  };

  useEffect(() => {
    getCompanyInfo();
    getServices();
  }, []);
  return (
    <Formik
      initialValues={{
        name: companyInfo?.name,
        email: companyInfo?.email,
        address: companyInfo?.address,
        city: companyInfo?.city,
        zipCode: companyInfo?.zipCode,
        services:
          companyInfo?.services?.map((service) =>
            typeof service === "object" ? service.id : service
          ) || [],
      }}
      enableReinitialize
      onSubmit={async (values, { setSubmitting }) => {
        try {
          setLoading(true);
          setSubmitting(true);
          setCompanyInfo(values);
          const data = await fetch(`http://localhost:3000/companies/${id}`, {
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
        } catch (error) {
          console.log(error);
        }
      }}
    >
      {loading ? (
        <Box sx={{ display: "flex", height: "300px" }}>
          <CircularProgress sx={{ margin: "auto" }} />
        </Box>
      ) : (
        ({ values, setFieldValue }) => {
          return (
            <Form
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-evenly",
                alignItems: "start",
              }}
            >
              <Field name="name" label="Company Name" style={fieldStyle} />
              <Field name="email" style={fieldStyle} />
              <Field name="address" style={fieldStyle} />
              <Field name="city" style={fieldStyle} />
              <Field name="zipCode" style={fieldStyle} />
              <Typography variant="h5" sx={{ m: "20px 10px 10px 10px" }}>
                Services
              </Typography>
              <FormGroup sx={{ m: "0px 10px 20px 10px" }}>
                {(services || []).map((service) => {
                  return (
                    <FormControlLabel
                      key={service.id}
                      control={
                        <Checkbox
                          checked={values.services?.includes(service.id)}
                          value={service.id}
                          onChange={(e) =>
                            // setFieldValue("services", [Number(e.target.value)])
                            {
                              if (e.target.checked) {
                                // Asegúrate de que `values.services` sea un array antes de usar el operador de propagación
                                setFieldValue("services", [
                                  ...(values.services || []),
                                  service.id,
                                ]);
                              } else {
                                // Maneja el caso en el que se desmarca el checkbox
                                setFieldValue(
                                  "services",
                                  (values.services || []).filter(
                                    (id) => id !== service.id
                                  )
                                );
                              }
                            }
                          }
                        />
                      }
                      label={service.name}
                    />
                  );
                })}
              </FormGroup>
              <Button
                type="submit"
                variant="contained"
                size="large"
                sx={{ width: "600px", margin: "20px 10px" }}
              >
                Edit
              </Button>
            </Form>
          );
        }
      )}
    </Formik>
  );
};

export default EditCompanyForm;
