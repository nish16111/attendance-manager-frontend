export const BULK_IMPORT_ACCEPTED_FILE_TYPES = ".csv,.xlsx,.xls";

export const BULK_IMPORT_REQUIRED_COLUMNS = [
  "grNo",
  "name",
  "department",
  "subDepartment",
  "totalAttendance",
  "mobileNumber",
  "area",
  "age",
  "isInitiated",
];

export const BULK_IMPORT_OPTIONAL_COLUMNS = ["photo", "remarks", "email"];

export const BULK_IMPORT_ALL_COLUMNS = [
  ...BULK_IMPORT_REQUIRED_COLUMNS,
  ...BULK_IMPORT_OPTIONAL_COLUMNS,
];

const SAMPLE_ROWS = [
  {
    grNo: "1001",
    name: "Aarav Sharma",
    department: "Engineering",
    subDepartment: "Frontend",
    totalAttendance: "92.5",
    mobileNumber: "9876543210",
    area: "Pune",
    age: "22",
    isInitiated: "true",
    photo: "",
    remarks: "Regular attendee",
    email: "aarav.sharma@example.com",
  },
  {
    grNo: "1002",
    name: "Indrajit Mehta",
    department: "Operations",
    subDepartment: "Support",
    totalAttendance: "88",
    mobileNumber: "9123456780",
    area: "Mumbai",
    age: "24",
    isInitiated: "false",
    photo: "",
    remarks: "",
    email: "indrajit.mehta@example.com",
  },
];

const escapeCsvValue = (value) => {
  const stringValue = value === null || value === undefined ? "" : String(value);

  if (/[",\n]/.test(stringValue)) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }

  return stringValue;
};

export const buildBulkImportCsvTemplate = () => {
  const lines = [
    BULK_IMPORT_ALL_COLUMNS.join(","),
    ...SAMPLE_ROWS.map((row) =>
      BULK_IMPORT_ALL_COLUMNS.map((column) => escapeCsvValue(row[column])).join(
        ","
      )
    ),
  ];

  return lines.join("\n");
};
