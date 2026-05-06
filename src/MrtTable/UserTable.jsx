import { useMemo } from "react";
import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Paper,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import { MaterialReactTable } from "material-react-table";
import { toImageSrc } from "../pages/UserPage/userFormConfig";

const DetailLine = ({ label, value }) => (
  <Box>
    <Typography variant="caption" color="text.secondary">
      {label}
    </Typography>
    <Typography sx={{ fontWeight: 600 }}>{value || "-"}</Typography>
  </Box>
);

const UsersTable = ({ users, onEdit, onView, isLoading }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const columns = useMemo(
    () => [
      {
        accessorKey: "photoBase64",
        header: "Photo",
        size: 70,
        Cell: ({ cell, row }) => {
          const imageSrc = toImageSrc(cell.getValue());
          const fallbackLabel = row.original?.name?.[0] || "U";

          return (
            <Avatar
              src={imageSrc}
              alt={row.original?.name || "User"}
              variant="rounded"
              sx={{ width: 52, height: 52, borderRadius: 2 }}
            >
              {fallbackLabel}
            </Avatar>
          );
        },
      },
      {
        accessorKey: "grNo",
        header: "GR No",
        size: 110,
      },
      {
        accessorKey: "name",
        header: "Name",
        size: 150,
      },
      {
        accessorKey: "department",
        header: "Department",
      },
      {
        accessorKey: "subDepartment",
        header: "Sub Dept",
      },
      {
        accessorKey: "totalAttendance",
        header: "Attendance",
        size: 90,
      },
      {
        accessorKey: "mobileNumber",
        header: "Mobile",
      },
      {
        accessorKey: "email",
        header: "Email",
      },
      {
        id: "actions",
        header: "Actions",
        size: 180,
        Cell: ({ row }) => (
          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
            <Button
              size="small"
              variant="outlined"
              startIcon={<VisibilityRoundedIcon />}
              onClick={() => onView(row.original)}
            >
              View
            </Button>
            <Button
              size="small"
              variant="text"
              startIcon={<EditRoundedIcon />}
              onClick={() => onEdit(row.original)}
            >
              Edit
            </Button>
          </Box>
        ),
      },
    ],
    [onEdit, onView]
  );

  if (!users.length && !isLoading) {
    return (
      <Box sx={{ py: 8, textAlign: "center" }}>
        <Typography variant="h6" sx={{ mb: 1 }}>
          No users found
        </Typography>
        <Typography color="text.secondary">
          Add a user to get started or refresh the list.
        </Typography>
      </Box>
    );
  }

  if (isMobile) {
    if (isLoading && !users.length) {
      return (
        <Stack spacing={1.5} alignItems="center" sx={{ py: 6 }}>
          <CircularProgress />
          <Typography color="text.secondary">Loading users...</Typography>
        </Stack>
      );
    }

    return (
      <Stack spacing={1.5}>
        {users.map((user) => (
          <Paper
            key={user.grNo}
            elevation={0}
            sx={{
              p: 2,
              borderRadius: 3,
              border: "1px solid",
              borderColor: "divider",
              backgroundColor: "rgba(255,251,249,0.94)",
            }}
          >
            <Stack spacing={2}>
              <Stack direction="row" spacing={1.5} alignItems="center">
                <Avatar
                  src={toImageSrc(user.photoBase64)}
                  alt={user.name || "User"}
                  variant="rounded"
                  sx={{ width: 56, height: 56, borderRadius: 2.5 }}
                >
                  {user.name?.[0] || "U"}
                </Avatar>

                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography sx={{ fontWeight: 700 }}>
                    {user.name || "Unknown User"}
                  </Typography>
                  <Typography color="text.secondary">GR No: {user.grNo || "-"}</Typography>
                </Box>

                <Stack direction="row" spacing={1}>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<VisibilityRoundedIcon />}
                    onClick={() => onView(user)}
                  >
                    View
                  </Button>
                  <Button
                    variant="text"
                    size="small"
                    startIcon={<EditRoundedIcon />}
                    onClick={() => onEdit(user)}
                  >
                    Edit
                  </Button>
                </Stack>
              </Stack>

              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                  gap: 1.5,
                }}
              >
                <DetailLine label="Department" value={user.department} />
                <DetailLine label="Sub Dept" value={user.subDepartment} />
                <DetailLine label="Attendance" value={user.totalAttendance} />
                <DetailLine label="Mobile" value={user.mobileNumber} />
              </Box>

              <DetailLine label="Email" value={user.email} />
            </Stack>
          </Paper>
        ))}
      </Stack>
    );
  }

  return (
    <MaterialReactTable
      columns={columns}
      data={users}
      state={{ isLoading }}
      enableColumnActions={false}
      enableDensityToggle={false}
      enableFullScreenToggle={false}
      enableRowSelection={false}
      initialState={{
        density: "comfortable",
        pagination: { pageSize: 10, pageIndex: 0 },
      }}
      muiTableBodyCellProps={{
        sx: {
          whiteSpace: "normal",
          wordBreak: "break-word",
        },
      }}
      muiTableContainerProps={{
        sx: { maxHeight: 560 },
      }}
      muiTablePaperProps={{
        elevation: 0,
        sx: {
          borderRadius: 4,
          border: "1px solid",
          borderColor: "rgba(122, 31, 43, 0.14)",
          overflow: "hidden",
          backgroundColor: "rgba(255, 252, 250, 0.95)",
        },
      }}
      muiTopToolbarProps={{
        sx: {
          background:
            "linear-gradient(90deg, rgba(122, 31, 43, 0.08) 0%, rgba(140, 106, 90, 0.08) 100%)",
        },
      }}
    />
  );
};

export default UsersTable;
