import React, { useState } from "react";
import { Button, Modal, Box, TextField, FormControl, InputLabel, Select, MenuItem, Typography } from "@mui/material";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import axios from "axios";


const UserComponent = () => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [grNo, setGrNo] = useState('');
  const [userData, setUserData] = useState(null);

  const fetchUserByGrNo = async () => {
    if (!grNo) {
      return null;
    }
    try {
      const res = await axios.get(`http://localhost:8080/home/users/fetchUserBygrNo/${grNo}`)
      console.log("response from fetchUserByGrNoAPI: ", res);
      setUserData(res.data);
    } catch(e) {
      console.log("Could not fetch User: ", e)
    }
    
  }

  // Validation Schema
  const validationSchema = Yup.object({
    grNo: Yup.string().required("GRNO is required"),
    name: Yup.string().required("Name is required"),
    department: Yup.string().required("Department is required"),
    totalAttendance: Yup.number().required("Total Attendance is required"),
    mobileNumber: Yup.string().matches(/^\d{10}$/, "Mobile number must be 10 digits").required("Mobile Number is required"),
    area: Yup.string().required("Area is required"),
    age: Yup.number().required("Age is required").min(1, "Invalid age"),
    initiated: Yup.boolean().required("Initiated is required"),
  });

  // Initial Values
  const initialValues = {
    grNo: "",
    name: "",
    department: "",
    totalAttendance: "",
    photo: null,
    mobileNumber: "",
    area: "",
    age: "",
    initiated: "",
  };

  return (
    <div className="p-6 flex flex-col items-center md:items-start relative">
      {/* Add User Button (Top Left, Above Fetch Box) */}
      <Button
        variant="contained"
        color="primary"
        onClick={handleOpen}
        sx={{ alignSelf: "flex-start", mb: 2 }}
      >
        Add User
      </Button>

      {/* Modal for Adding User */}
      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "90%",
            maxWidth: 450,
            maxHeight: "80vh", // Shorter modal height
            bgcolor: "white",
            p: 4,
            borderRadius: 3,
            boxShadow: 10,
            display: "flex",
            flexDirection: "column",
            gap: 2,
            overflowY: "auto",
          }}
        >
          <Typography variant="h5" align="center" sx={{ fontWeight: "bold", color: "#1976d2" }}>
            Add User
          </Typography>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={(values, { resetForm }) => {
              console.log("Form Data: ", values);
              resetForm();
              handleClose();
            }}
          >
            {({ values, setFieldValue, errors, touched }) => (
              <Form style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <TextField label="GRNO" name="grNo" fullWidth value={values.grNo} onChange={(e) => setFieldValue("grNo", e.target.value)} error={touched.grNo && Boolean(errors.grNo)} helperText={touched.grNo && errors.grNo} />
                <TextField label="Name" name="name" fullWidth value={values.name} onChange={(e) => setFieldValue("name", e.target.value)} error={touched.name && Boolean(errors.name)} helperText={touched.name && errors.name} />
                <TextField label="Department" name="department" fullWidth value={values.department} onChange={(e) => setFieldValue("department", e.target.value)} error={touched.department && Boolean(errors.department)} helperText={touched.department && errors.department} />
                <TextField label="Total Attendance" name="totalAttendance" fullWidth type="number" value={values.totalAttendance} onChange={(e) => setFieldValue("totalAttendance", e.target.value)} error={touched.totalAttendance && Boolean(errors.totalAttendance)} helperText={touched.totalAttendance && errors.totalAttendance} />

                {/* File Upload Section */}
                <Typography variant="body1" sx={{ fontWeight: "bold", mt: 2 }}>
                  Upload Photo
                </Typography>
                <input type="file" name="photo" onChange={(event) => setFieldValue("photo", event.target.files[0])} />

                <TextField label="Mobile Number" name="mobileNumber" fullWidth value={values.mobileNumber} onChange={(e) => setFieldValue("mobileNumber", e.target.value)} error={touched.mobileNumber && Boolean(errors.mobileNumber)} helperText={touched.mobileNumber && errors.mobileNumber} />
                <TextField label="Area" name="area" fullWidth value={values.area} onChange={(e) => setFieldValue("area", e.target.value)} error={touched.area && Boolean(errors.area)} helperText={touched.area && errors.area} />
                <TextField label="Age" name="age" fullWidth type="number" value={values.age} onChange={(e) => setFieldValue("age", e.target.value)} error={touched.age && Boolean(errors.age)} helperText={touched.age && errors.age} />

                {/* Initiated Dropdown */}
                <FormControl fullWidth>
                  <InputLabel>Initiated</InputLabel>
                  <Select name="initiated" value={values.initiated} onChange={(e) => setFieldValue("initiated", e.target.value)} error={touched.initiated && Boolean(errors.initiated)}>
                    <MenuItem value={true}>Yes</MenuItem>
                    <MenuItem value={false}>No</MenuItem>
                  </Select>
                </FormControl>

                <Button type="submit" variant="contained" color="primary" fullWidth sx={{ fontSize: "1rem", padding: "12px", borderRadius: 2 }}>
                  Submit
                </Button>
              </Form>
            )}
          </Formik>
        </Box>
      </Modal>

      {/* Fetch User Box */}
      <Box className="mt-6 p-4 border rounded shadow-md w-full max-w-md">
        <Typography variant="h6" align="center" sx={{ fontWeight: "bold", color: "gray" }}>
          Fetch User
        </Typography>
        <TextField
          label="Enter GRNO"
          value={grNo}
          onChange={(e) => setGrNo(e.target.value)}
          fullWidth margin="normal"
        />
        <Button
          variant="contained"
          sx={{
            backgroundColor: "teal",
            color: "white",
            fontWeight: "bold",
            padding: "10px",
            borderRadius: 2,
            "&:hover": { backgroundColor: "darkcyan" },
          }}
          fullWidth
          onClick={fetchUserByGrNo}
        >
          Get User
        </Button>
      </Box>
    </div>
  );
};

export default UserComponent;
