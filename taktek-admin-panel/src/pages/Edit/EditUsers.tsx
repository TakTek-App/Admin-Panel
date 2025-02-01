import { useEffect, useState } from "react";
import ContentWraper from "../../components/ContentWraper";
import { useNavigate, useParams } from "react-router-dom";
import { Field, Form, Formik } from "formik";
import { Box, Button, CircularProgress } from "@mui/material";
import { Flip, toast } from "react-toastify";

interface User {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

const EditUsers = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const succesNotify = () =>
    toast.success("User Updated", {
      autoClose: 2000,
      position: "bottom-right",
      theme: "colored",
      transition: Flip,
    });
  const errorNotify = () =>
    toast.error("Failed to update the user", {
      autoClose: 2000,
      position: "bottom-right",
      theme: "colored",
      transition: Flip,
    });
  const [userInfo, setUserInfo] = useState<User>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });

  const getUserInfo = async () => {
    try {
      const data = await fetch(`http://localhost:3000/users/${id}`);
      const result = await data.json();
      setUserInfo(result);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUserInfo();
  }, []);

  useEffect(() => {}, [userInfo]);

  const fieldStyle = {
    width: "500px",
    margin: "20px 10px",
    fontSize: "20px",
    padding: "10px",
    border: "1px solid gray",
    borderRadius: "5px",
  };

  return (
    <ContentWraper
      name={userInfo?.firstName + " " + userInfo?.lastName}
      onBack={() => navigate(-1)}
    >
      <Formik
        initialValues={{
          firstName: userInfo.firstName,
          lastName: userInfo.lastName,
          email: userInfo.email,
          phone: userInfo.phone,
        }}
        enableReinitialize
        onSubmit={async (values: User, { setSubmitting }) => {
          setLoading(true);
          setSubmitting(true);
          setUserInfo(values);
          const data = await fetch(`http://localhost:3000/users/${id}`, {
            method: "PUT",
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
            <Field name="firstName" style={fieldStyle} />
            <Field name="lastName" style={fieldStyle} />
            <Field name="email" style={fieldStyle} />
            <Field name="phone" style={fieldStyle} />
            <Button
              variant="contained"
              type="submit"
              size="large"
              sx={{ width: "400px", margin: "20px" }}
            >
              Update
            </Button>
          </Form>
        )}
      </Formik>
    </ContentWraper>
  );
};

export default EditUsers;
