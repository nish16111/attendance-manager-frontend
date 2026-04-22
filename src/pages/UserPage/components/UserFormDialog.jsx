import { useEffect, useMemo, useState } from "react";
import {
  Avatar,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import CloudUploadRoundedIcon from "@mui/icons-material/CloudUploadRounded";
import { Form, Formik } from "formik";
import {
  toImageSrc,
  userFormValidationSchema,
} from "../userFormConfig";

const UserFormDialog = ({
  open,
  mode,
  initialValues,
  onClose,
  onSubmit,
  submitting,
}) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [objectUrl, setObjectUrl] = useState("");

  useEffect(() => {
    if (!open) {
      setSelectedPhoto(null);
    }
  }, [open]);

  useEffect(() => {
    if (!selectedPhoto) {
      setObjectUrl("");
      return undefined;
    }

    const previewUrl = URL.createObjectURL(selectedPhoto);
    setObjectUrl(previewUrl);

    return () => {
      URL.revokeObjectURL(previewUrl);
    };
  }, [selectedPhoto]);

  const existingImageSource = useMemo(
    () => toImageSrc(initialValues.photoBase64),
    [initialValues.photoBase64]
  );

  const previewSource = objectUrl || existingImageSource;
  const isEditMode = mode === "edit";

  return (
    <Dialog
      open={open}
      onClose={() => {
        if (!submitting) {
          onClose();
        }
      }}
      fullScreen={fullScreen}
      fullWidth
      maxWidth="md"
    >
      <DialogTitle sx={{ fontWeight: 700 }}>
        {isEditMode ? "Edit User" : "Add New User"}
      </DialogTitle>

      <Formik
        initialValues={initialValues}
        validationSchema={userFormValidationSchema}
        enableReinitialize
        onSubmit={(values, helpers) => onSubmit(values, selectedPhoto, helpers)}
      >
        {({
          values,
          errors,
          touched,
          handleBlur,
          handleChange,
          setFieldValue,
        }) => (
          <Form>
            <DialogContent dividers>
              <Stack spacing={2}>
                <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                  <TextField
                    fullWidth
                    name="grNo"
                    label="GR Number"
                    value={values.grNo}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.grNo && Boolean(errors.grNo)}
                    helperText={touched.grNo && errors.grNo}
                  />
                  <TextField
                    fullWidth
                    name="name"
                    label="Name"
                    value={values.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.name && Boolean(errors.name)}
                    helperText={touched.name && errors.name}
                  />
                </Stack>

                <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                  <TextField
                    fullWidth
                    name="department"
                    label="Department"
                    value={values.department}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.department && Boolean(errors.department)}
                    helperText={touched.department && errors.department}
                  />
                  <TextField
                    fullWidth
                    name="subDepartment"
                    label="Sub Department"
                    value={values.subDepartment}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.subDepartment && Boolean(errors.subDepartment)}
                    helperText={touched.subDepartment && errors.subDepartment}
                  />
                </Stack>

                <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                  <TextField
                    fullWidth
                    name="totalAttendance"
                    type="number"
                    label="Total Attendance"
                    value={values.totalAttendance}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={
                      touched.totalAttendance && Boolean(errors.totalAttendance)
                    }
                    helperText={touched.totalAttendance && errors.totalAttendance}
                  />
                  <TextField
                    fullWidth
                    name="mobileNumber"
                    label="Mobile Number"
                    value={values.mobileNumber}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.mobileNumber && Boolean(errors.mobileNumber)}
                    helperText={touched.mobileNumber && errors.mobileNumber}
                  />
                </Stack>

                <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                  <TextField
                    fullWidth
                    name="area"
                    label="Address"
                    value={values.area}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.area && Boolean(errors.area)}
                    helperText={touched.area && errors.area}
                  />
                  <TextField
                    fullWidth
                    name="age"
                    type="number"
                    label="Age"
                    value={values.age}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.age && Boolean(errors.age)}
                    helperText={touched.age && errors.age}
                  />
                </Stack>

                <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                  <TextField
                    fullWidth
                    name="email"
                    label="Email"
                    value={values.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.email && Boolean(errors.email)}
                    helperText={touched.email && errors.email}
                  />
                  <FormControl
                    fullWidth
                    error={touched.initiated && Boolean(errors.initiated)}
                  >
                    <InputLabel id="initiated-select-label">Initiated</InputLabel>
                    <Select
                      labelId="initiated-select-label"
                      name="initiated"
                      label="Initiated"
                      value={values.initiated}
                      onChange={(event) =>
                        setFieldValue("initiated", event.target.value)
                      }
                    >
                      <MenuItem value={true}>Yes</MenuItem>
                      <MenuItem value={false}>No</MenuItem>
                    </Select>
                    <FormHelperText>
                      {touched.initiated ? errors.initiated : ""}
                    </FormHelperText>
                  </FormControl>
                </Stack>

                <TextField
                  fullWidth
                  multiline
                  minRows={2}
                  name="remarks"
                  label="Remarks"
                  value={values.remarks}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.remarks && Boolean(errors.remarks)}
                  helperText={touched.remarks && errors.remarks}
                />

                <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                  <Button
                    component="label"
                    variant="outlined"
                    startIcon={<CloudUploadRoundedIcon />}
                  >
                    {selectedPhoto ? "Change Photo" : "Upload Photo"}
                    <input
                      hidden
                      accept="image/*"
                      type="file"
                      onChange={(event) => {
                        const file = event.target.files?.[0] || null;
                        setSelectedPhoto(file);
                      }}
                    />
                  </Button>
                  <Typography variant="body2" color="text.secondary">
                    {selectedPhoto ? selectedPhoto.name : "JPG/PNG up to 5MB"}
                  </Typography>
                </Stack>

                {previewSource ? (
                  <Avatar
                    src={previewSource}
                    alt="User preview"
                    variant="rounded"
                    sx={{ width: 120, height: 120, borderRadius: 3 }}
                  />
                ) : null}
              </Stack>
            </DialogContent>

            <DialogActions sx={{ px: 3, py: 2 }}>
              <Button onClick={onClose} disabled={submitting}>
                Cancel
              </Button>
              <Button type="submit" variant="contained" disabled={submitting}>
                {submitting
                  ? "Saving..."
                  : isEditMode
                    ? "Save Changes"
                    : "Create User"}
              </Button>
            </DialogActions>
          </Form>
        )}
      </Formik>
    </Dialog>
  );
};

export default UserFormDialog;
