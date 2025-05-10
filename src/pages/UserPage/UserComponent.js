import React, { useState } from "react";
import {
  Button,
  Modal,
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  CircularProgress,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";

const UserComponent = () => {

  const BACKEND_URL_IP = "http://192.168.1.6:8080"
  const BACKEND_URL_LOCALHOST = "http://localhost:8080"

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [grNo, setGrNo] = useState("");
  const [userData, setUserData] = useState(null);
  const [newUser, setNewUserData] = useState(null);

  const [photo, setPhoto] = useState(null);
  const [photoLoading, setPhotoLoading] = useState(false);
  const [photoError, setPhotoError] = useState(null);

  const fetchUserByGrNo = async () => {
    if (!grNo) {
      return null;
    }
    try {
      const res = await axios.get(
        `http://localhost:8080/home/users/fetchUserBygrNo?grNo=${grNo}`
      );
      console.log("response from fetchUserByGrno API is: ", res);
      toast.success("User Fetched Sucessfully")
      setUserData(res.data);
    } catch (e) {
      console.log("Could not fetch User: ", e);
      toast.error("Could not fetch User")
    }
  };

  const addUser = async (values, { resetForm }) => {
    console.log("Form Values: ", values);

    const formData = new FormData();
    formData.append("grNo", values.grNo);
    formData.append("name", values.name);
    formData.append("department", values.department);
    formData.append("subDepartment", values.subDepartment);
    formData.append("totalAttendance", values.totalAttendance);
    formData.append("mobileNumber", values.mobileNumber);
    formData.append("area", values.area);
    formData.append("age", values.age);
    formData.append("isInitiated", values.initiated);
    formData.append("remarks", values.remarks);
    formData.append("email", values.email);

    // Append photo file
    if (photo) {
      formData.append("photo", photo);
    }

    console.log("formData: ", formData);

    try {
      const res = await axios.post(
        "http://localhost:8080/home/users/createUser",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("response from createUser API: ", res);
      handleClose();
      toast.success("user added successfully")
      resetForm();
      setPhoto(null);
    } catch (e) {
      console.error("Could not create user: ", e);
      toast.error("Could not add user")
    }
  };

  // Validation Schema
  const validationSchema = Yup.object({
    grNo: Yup.string().required("GRNO is required"),
    name: Yup.string().required("Name is required"),
    department: Yup.string().required("Department is required"),
    totalAttendance: Yup.number().required("Total Attendance is required"),
    mobileNumber: Yup.string()
      .matches(/^\d{10}$/, "Mobile number must be 10 digits")
      .required("Mobile Number is required"),
    area: Yup.string().required("Area is required"),
    age: Yup.number().required("Age is required").min(1, "Invalid age"),
    isInitiated: Yup.boolean().required("Initiated is required"),
  });

  // Initial Values
  const initialValues = {
    grNo: "",
    name: "",
    department: "",
    subDepartment: "",
    totalAttendance: "",
    photo: photo,
    mobileNumber: "",
    area: "",
    age: "",
    initiated: "",
    remarks: "",
    email: "",
  };

  return (
    <div className="p-4 md:p-6 flex flex-col items-center md:items-start relative w-full">
      <ToastContainer position="top-center" autoClose={3000} />
      {/* Add User Button (Centered on Mobile, Left on Desktop) */}
      <Button
        variant="contained"
        color="primary"
        onClick={handleOpen}
        sx={{
          alignSelf: { xs: "center", md: "flex-start" },
          mb: 2,
          width: { xs: "100%", sm: "auto" },
        }}
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
            width: "95%",
            maxWidth: 400,
            maxHeight: "85vh",
            bgcolor: "white",
            p: 3,
            borderRadius: 2,
            boxShadow: 10,
            display: "flex",
            flexDirection: "column",
            gap: 2,
            overflowY: "auto",
          }}
        >
          {/* ❌ button */}
          <IconButton
            onClick={handleClose}
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>

          <Typography
            variant="h6"
            align="center"
            sx={{ fontWeight: "bold", color: "#1976d2" }}
          >
            Add User
          </Typography>
          <Formik
            initialValues={initialValues}
            // validationSchema={validationSchema}
            onSubmit={addUser}
          >
            {({ values, setFieldValue, errors, touched }) => (
              <Form
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                }}
              >
                {/* File Upload Section */}
                <input
                  type="file"
                  name="photo"
                  onChange={(event) => {
                    const file = event.target.files[0];
                    if (file) setPhoto(file); // Just store the file
                  }}
                />
                {photo && (
                  <Typography sx={{ mt: 2, color: "green" }}>
                    Photo selected: {photo.name}
                  </Typography>
                )}

                <TextField
                  label="GRNO"
                  name="grNo"
                  fullWidth
                  value={values.grNo}
                  onChange={(e) => setFieldValue("grNo", e.target.value)}
                  error={touched.grNo && Boolean(errors.grNo)}
                  helperText={touched.grNo && errors.grNo}
                />
                <TextField
                  label="Name"
                  name="name"
                  fullWidth
                  value={values.name}
                  onChange={(e) => setFieldValue("name", e.target.value)}
                  error={touched.name && Boolean(errors.name)}
                  helperText={touched.name && errors.name}
                />
                <TextField
                  label="Department"
                  name="department"
                  fullWidth
                  value={values.department}
                  onChange={(e) => setFieldValue("department", e.target.value)}
                  error={touched.department && Boolean(errors.department)}
                  helperText={touched.department && errors.department}
                />
                <TextField
                  label="Sub - Department"
                  name="subDepartment"
                  fullWidth
                  value={values.subDepartment}
                  onChange={(e) => setFieldValue("subDepartment", e.target.value)}
                  error={touched.department && Boolean(errors.department)}
                  helperText={touched.department && errors.department}
                />
                <TextField
                  label="Total Attendance"
                  name="totalAttendance"
                  fullWidth
                  // type="number"
                  value={values.totalAttendance}
                  onChange={(e) =>
                    setFieldValue("totalAttendance", e.target.value)
                  }
                  error={
                    touched.totalAttendance && Boolean(errors.totalAttendance)
                  }
                  helperText={touched.totalAttendance && errors.totalAttendance}
                />

                <TextField
                  label="Mobile Number"
                  name="mobileNumber"
                  fullWidth
                  value={values.mobileNumber}
                  onChange={(e) =>
                    setFieldValue("mobileNumber", e.target.value)
                  }
                  error={touched.mobileNumber && Boolean(errors.mobileNumber)}
                  helperText={touched.mobileNumber && errors.mobileNumber}
                />
                <TextField
                  label="Address"
                  name="area"
                  fullWidth
                  value={values.area}
                  onChange={(e) => setFieldValue("area", e.target.value)}
                  error={touched.area && Boolean(errors.area)}
                  helperText={touched.area && errors.area}
                />
                <TextField
                  label="Age"
                  name="age"
                  fullWidth
                  // type="number"

                  value={values.age}
                  onChange={(e) => setFieldValue("age", e.target.value)}
                  error={touched.age && Boolean(errors.age)}
                  helperText={touched.age && errors.age}
                />
                <TextField
                  label="Remarks"
                  name="remarks"
                  fullWidth
                  type="text"
                  value={values.remarks}
                  onChange={(e) => setFieldValue("remarks", e.target.value)}
                  error={touched.age && Boolean(errors.age)}
                  helperText={touched.age && errors.age}
                />
                <TextField
                  label="Email"
                  name="email"
                  fullWidth
                  type="text"
                  value={values.email}
                  onChange={(e) => setFieldValue("email", e.target.value)}
                  error={touched.age && Boolean(errors.age)}
                  helperText={touched.age && errors.age}
                />

                {/* Initiated Dropdown */}
                <FormControl fullWidth>
                  <InputLabel>Initiated</InputLabel>
                  <Select
                    name="isInitiated"
                    value={values.initiated}
                    onChange={(e) => setFieldValue("initiated", e.target.value)}
                    error={touched.initiated && Boolean(errors.initiated)}
                  >
                    <MenuItem value={true}>Yes</MenuItem>
                    <MenuItem value={false}>No</MenuItem>
                  </Select>
                </FormControl>

                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  sx={{ fontSize: "1rem", p: 1.5 }}
                >
                  Submit
                </Button>
              </Form>
            )}
          </Formik>
        </Box>
      </Modal>

      {/* Fetch User Box */}
      <Box className="mt-6 p-4 border rounded shadow-md w-full max-w-3xl mx-auto">
        <Typography
          variant="h6"
          align="center"
          sx={{ fontWeight: "bold", color: "gray" }}
        >
          Fetch User
        </Typography>

        <TextField
          label="Enter GRNO"
          value={grNo}
          onChange={(e) => setGrNo(e.target.value)}
          fullWidth
          margin="normal"
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

        {/* User Data Display Section */}
        {userData && (
          <div className="mt-6 bg-white p-6 rounded-lg shadow-md w-full">
            <h3 className="text-lg md:text-2xl font-semibold text-center text-gray-800">
              {userData.name}
            </h3>

            <div className="mt-4 space-y-2 text-sm md:text-base">
              <p>
                <strong>GR No:</strong> {userData.grNo}
              </p>
              <p>
                <strong>Department:</strong> {userData.department}
              </p>
              <p>
                <strong>Sub - Department:</strong> {userData.subDepartment}
              </p>
              <p>
                <strong>Total Attendance:</strong> {userData.totalAttendance}
              </p>
              <p>
                <strong>Mobile Number:</strong> {userData.mobileNumber}
              </p>
              <p>
                <strong>Address:</strong> {userData.area}
              </p>
              <p>
                <strong>Age:</strong> {userData.age}
              </p>
              <p>
                <strong>Remarks:</strong> {userData.remarks}
              </p>
              <p>
                <strong>Email:</strong> {userData.email}
              </p>
              <p
                className={`font-semibold ${
                  userData.initiated ? "text-green-600" : "text-red-500"
                }`}
              >
                {userData.initiated ? "✅ Initiated" : "❌ Not Initiated"}
              </p>
            </div>

            {userData.photoBase64 && (
              <div className="flex justify-center mt-6">
                <img
                  src={`data:image/jpeg;base64,${userData.photoBase64}`}
                  alt="User"
                  className="w-60 max-w-full max-h-64 object-contain border rounded shadow-md"
                />
              </div>
            )}
          </div>
        )}
      </Box>
    </div>
  );
};

export default UserComponent;
