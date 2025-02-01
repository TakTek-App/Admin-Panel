import React, { useState } from "react";
import ContentWraper from "../../components/ContentWraper";
import { useNavigate } from "react-router-dom";
import { Field, Form, Formik } from "formik";
import { Box, Button, CircularProgress } from "@mui/material";
import { toast } from "react-toastify";

const CreateUser = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const notify = () => toast('Wow so easy !');

  const fieldStyle = {
    width: "500px",
    margin: "20px 10px",
    fontSize: "20px",
    padding: "10px",
    border: "1px solid gray",
    borderRadius: "5px",
  };
  return (
    <ContentWraper name="Create User" onBack={() => navigate(-1)}>
      <Formik
        initialValues={{
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
        }}
        onSubmit={(values, { setSubmitting }) => {
          setLoading(true);
          setSubmitting(true);
          fetch(`http://localhost:3000/users`, {
            method: "POST",
            body: JSON.stringify(values),
            headers: { "Content-Type": "application/json" },
          });
          setSubmitting(false);
          setTimeout(() => {
            setLoading(false);
            navigate(-1);
            notify()
          }, 500);
        }}
      >
        {loading ? (
          <Box>
            <CircularProgress />
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
            <Field
              name="firstName"
              style={fieldStyle}
              placeholder="First Name"
            />
            <Field name="lastName" style={fieldStyle} placeholder="Last Name" />
            <Field name="email" style={fieldStyle} placeholder="Email" />
            <Field name="phone" style={fieldStyle} placeholder="Phone" />
            <Button
              variant="contained"
              type="submit"
              size="large"
              sx={{ width: "400px", margin: "20px" }}
            >
              Create User
            </Button>
          </Form>
        )}
      </Formik>
    </ContentWraper>
  );
};

export default CreateUser;
