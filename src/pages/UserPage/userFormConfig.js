import * as Yup from "yup";

const toText = (value) => (value === null || value === undefined ? "" : String(value));

export const EMPTY_USER_FORM = {
  grNo: "",
  name: "",
  department: "",
  subDepartment: "",
  totalAttendance: "",
  mobileNumber: "",
  area: "",
  age: "",
  initiated: false,
  remarks: "",
  email: "",
  photoBase64: "",
};

export const toFormValues = (user = {}) => ({
  grNo: toText(user.grNo),
  name: toText(user.name),
  department: toText(user.department),
  subDepartment: toText(user.subDepartment),
  totalAttendance: toText(user.totalAttendance),
  mobileNumber: toText(user.mobileNumber),
  area: toText(user.area),
  age: toText(user.age),
  initiated: Boolean(user.initiated ?? user.isInitiated),
  remarks: toText(user.remarks),
  email: toText(user.email),
  photoBase64: toText(user.photoBase64),
});

export const userFormValidationSchema = Yup.object({
  grNo: Yup.string().trim().required("GR number is required"),
  name: Yup.string().trim().min(2, "Name is too short").required("Name is required"),
  department: Yup.string().trim().required("Department is required"),
  subDepartment: Yup.string().trim(),
  totalAttendance: Yup.number()
    .typeError("Attendance must be a valid number")
    .min(0, "Attendance cannot be negative")
    .required("Attendance is required"),
  mobileNumber: Yup.string()
    .matches(/^\d{10}$/, "Mobile number must be exactly 10 digits")
    .required("Mobile number is required"),
  area: Yup.string().trim().required("Address is required"),
  age: Yup.number()
    .typeError("Age must be a valid number")
    .min(1, "Age must be at least 1")
    .max(120, "Age must be realistic")
    .required("Age is required"),
  initiated: Yup.boolean().required("Please select initiation status"),
  remarks: Yup.string().max(250, "Remarks can be at most 250 characters"),
  email: Yup.string().trim().email("Please provide a valid email address"),
});

export const toImageSrc = (photoBase64) => {
  if (!photoBase64) {
    return "";
  }

  return photoBase64.startsWith("data:image")
    ? photoBase64
    : `data:image/jpeg;base64,${photoBase64}`;
};

export const buildUserFormData = (values, photoFile) => {
  const formData = new FormData();

  formData.append("grNo", values.grNo.trim());
  formData.append("name", values.name.trim());
  formData.append("department", values.department.trim());
  formData.append("subDepartment", values.subDepartment.trim());
  formData.append("totalAttendance", values.totalAttendance);
  formData.append("mobileNumber", values.mobileNumber.trim());
  formData.append("area", values.area.trim());
  formData.append("age", values.age);
  formData.append("isInitiated", String(values.initiated));
  formData.append("remarks", values.remarks.trim());
  formData.append("email", values.email.trim());

  if (photoFile) {
    formData.append("photo", photoFile);
  }

  return formData;
};
