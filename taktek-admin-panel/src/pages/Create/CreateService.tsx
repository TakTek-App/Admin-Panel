import { useEffect, useState } from "react";
import ContentWraper from "../../components/ContentWraper";
import { Field, Form, Formik } from "formik";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
} from "@mui/material";
import { Flip, toast } from "react-toastify";
import { Category } from "@mui/icons-material";

interface Categories {
  id: number;
  name: string;
}

const CreateService = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Categories[]>([]);
  const succesNotify = () =>
    toast.success("Service Created", {
      autoClose: 2000,
      position: "bottom-right",
      theme: "colored",
      transition: Flip,
    });
  const errorNotify = () =>
    toast.error("Failed To Create The Service", {
      autoClose: 2000,
      position: "bottom-right",
      theme: "colored",
      transition: Flip,
    });

  const fieldStyle = {
    width: "500px",
    margin: "20px 10px",
    fontSize: "20px",
    padding: "10px",
    border: "1px solid gray",
    borderRadius: "5px",
  };

  const getCategories = async () => {
    try {
      const data = await fetch("http://localhost:3000/categories");
      const response = await data.json();
      setCategories(response);
    } catch (error) {}
  };

  useEffect(() => {
    getCategories();
  }, []);

  return (
    <ContentWraper name="Create Service" onBack={() => navigate(-1)}>
      <Formik
        initialValues={{
          name: "",
          categoryId: "",
        }}
        enableReinitialize
        onSubmit={async (values, { setSubmitting }) => {
          console.log(values);
          setLoading(true);
          setSubmitting(true);
          const data = await fetch(`http://localhost:3000/services`, {
            method: "POST",
            body: JSON.stringify({
              ...values,
              categoryId: Number(values.categoryId),
            }),
            headers: { "Content-Type": "application/json" },
          });
          if (data.status === 200 || 201) {
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
          ({ values, setFieldValue }) => (
            <Form
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-evenly",
                alignItems: "start",
              }}
            >
              <Field
                name="name"
                style={fieldStyle}
                placeholder="Service Name"
              />

              <Box sx={{ width: "500px" }}>
                <FormControl fullWidth sx={{ margin: "20px 10px" }}>
                  <InputLabel>Category</InputLabel>
                  <Select
                    value={values.categoryId}
                    onChange={(e) => {
                      console.log(e.target.value);
                      setFieldValue("categoryId", e.target.value);
                    }}
                  >
                    {categories?.map((category) => (
                      <MenuItem key={category.id} value={category.id}>
                        {category.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
              <Button
                variant="contained"
                type="submit"
                size="large"
                sx={{ width: "400px", margin: "20px" }}
              >
                Create
              </Button>
            </Form>
          )
        )}
      </Formik>
    </ContentWraper>
  );
};

export default CreateService;
