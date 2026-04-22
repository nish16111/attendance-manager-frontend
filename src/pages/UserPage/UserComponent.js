import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import { toast } from "react-toastify";
import UsersTable from "../../MrtTable/UserTable";
import {
  createUser,
  extractApiError,
  fetchAllUsers,
  fetchUserByGrNo,
  updateUser,
} from "../../API/HomeAPI";
import { useAuth } from "../../auth/AuthContext";
import UserFormDialog from "./components/UserFormDialog";
import UserDetailsCard from "./components/UserDetailsCard";
import {
  EMPTY_USER_FORM,
  buildUserFormData,
  toFormValues,
} from "./userFormConfig";

const UserComponent = () => {
  const { logout, user } = useAuth();
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  const [searchGrNo, setSearchGrNo] = useState("");

  const [usersLoading, setUsersLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [formSubmitting, setFormSubmitting] = useState(false);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState("create");
  const [editingUser, setEditingUser] = useState(null);

  const loadUsers = useCallback(async () => {
    setUsersLoading(true);

    try {
      const response = await fetchAllUsers();
      setUsers(Array.isArray(response) ? response : []);
    } catch (error) {
      toast.error(extractApiError(error, "Could not load users"));
    } finally {
      setUsersLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const dialogInitialValues = useMemo(() => {
    if (dialogMode === "edit" && editingUser) {
      return toFormValues(editingUser);
    }

    return EMPTY_USER_FORM;
  }, [dialogMode, editingUser]);

  const openCreateDialog = () => {
    setDialogMode("create");
    setEditingUser(null);
    setDialogOpen(true);
  };

  const openEditDialog = (user) => {
    setDialogMode("edit");
    setEditingUser(user);
    setDialogOpen(true);
  };

  const closeDialog = () => {
    if (!formSubmitting) {
      setDialogOpen(false);
    }
  };

  const refreshSelectedUser = useCallback(
    async (grNo) => {
      if (!grNo) {
        return;
      }

      try {
        const response = await fetchUserByGrNo(grNo);
        setSelectedUser(response);
      } catch {
        setSelectedUser(null);
      }
    },
    [setSelectedUser]
  );

  const handleSubmitUser = async (values, photoFile, { resetForm }) => {
    setFormSubmitting(true);

    try {
      const formData = buildUserFormData(values, photoFile);

      if (dialogMode === "edit") {
        await updateUser(editingUser?.grNo || values.grNo, formData);
        toast.success("User updated successfully");
      } else {
        await createUser(formData);
        toast.success("User created successfully");
      }

      setDialogOpen(false);
      resetForm();

      await loadUsers();
      await refreshSelectedUser(values.grNo);
    } catch (error) {
      toast.error(
        extractApiError(
          error,
          dialogMode === "edit"
            ? "Could not update user"
            : "Could not create user"
        )
      );
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleSearch = async () => {
    const trimmedGrNo = searchGrNo.trim();

    if (!trimmedGrNo) {
      toast.info("Enter a GR number first");
      return;
    }

    setSearchLoading(true);

    try {
      const response = await fetchUserByGrNo(trimmedGrNo);
      setSelectedUser(response);
      toast.success("User fetched successfully");
    } catch (error) {
      setSelectedUser(null);
      toast.error(extractApiError(error, "User not found"));
    } finally {
      setSearchLoading(false);
    }
  };

  const handleEditFromTable = (user) => {
    setSelectedUser(user);
    openEditDialog(user);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        py: { xs: 3, md: 5 },
      }}
    >
      <Container maxWidth="xl">
        <Paper
          elevation={0}
          sx={{
            p: { xs: 2, md: 3 },
            borderRadius: 5,
            border: "1px solid",
            borderColor: "divider",
            backgroundColor: "rgba(255,255,255,0.88)",
            backdropFilter: "blur(6px)",
          }}
        >
          <Stack spacing={3}>
            <Stack
              direction={{ xs: "column", md: "row" }}
              spacing={2}
              alignItems={{ xs: "flex-start", md: "center" }}
              justifyContent="space-between"
            >
              <Stack spacing={1.25}>
                <Chip
                  icon={
                    <Avatar
                      sx={{
                        width: 28,
                        height: 28,
                        bgcolor: "primary.main",
                        color: "common.white",
                        fontSize: "0.8rem",
                        fontWeight: 800,
                      }}
                    >
                      {(user?.username || user?.email || "A")[0]?.toUpperCase()}
                    </Avatar>
                  }
                  label={user?.username || user?.email || "Authenticated admin"}
                  sx={{
                    alignSelf: "flex-start",
                    borderRadius: 99,
                    py: 0.4,
                    px: 0.4,
                    bgcolor: "rgba(12,122,107,0.08)",
                    "& .MuiChip-label": {
                      fontWeight: 700,
                    },
                  }}
                />
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 800, mb: 0.5 }}>
                    Attendance User Manager
                  </Typography>
                  <Typography color="text.secondary">
                    Manage records, fetch users quickly by GR number, and edit
                    data from a single secure workspace.
                  </Typography>
                </Box>
              </Stack>

              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={1.5}
                width={{ xs: "100%", md: "auto" }}
              >
                <Button
                  variant="outlined"
                  startIcon={<RefreshRoundedIcon />}
                  onClick={loadUsers}
                  disabled={usersLoading}
                  fullWidth
                >
                  Refresh
                </Button>
                <Button
                  variant="contained"
                  startIcon={<AddRoundedIcon />}
                  onClick={openCreateDialog}
                  fullWidth
                >
                  Add User
                </Button>
                <Button
                  color="secondary"
                  variant="text"
                  startIcon={<LogoutRoundedIcon />}
                  onClick={logout}
                  fullWidth
                >
                  Logout
                </Button>
              </Stack>
            </Stack>

            <Paper
              elevation={0}
              sx={{
                p: { xs: 2, md: 2.5 },
                borderRadius: 4,
                border: "1px solid",
                borderColor: "divider",
                background:
                  "linear-gradient(135deg, rgba(247,251,255,0.88) 0%, rgba(242,252,247,0.9) 100%)",
              }}
            >
              <Stack
                direction={{ xs: "column", lg: "row" }}
                spacing={2}
                justifyContent="space-between"
                alignItems={{ xs: "stretch", lg: "center" }}
              >
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 800, mb: 0.5 }}>
                    Quick lookup
                  </Typography>
                  <Typography color="text.secondary">
                    Search any user by GR number and open the editable detail view
                    instantly.
                  </Typography>
                </Box>

                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  spacing={1.5}
                  alignItems={{ xs: "stretch", sm: "center" }}
                  width={{ xs: "100%", lg: "auto" }}
                >
                  <TextField
                    fullWidth
                    label="Find user by GR number"
                    placeholder="Example: 1023"
                    value={searchGrNo}
                    onChange={(event) => setSearchGrNo(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        event.preventDefault();
                        handleSearch();
                      }
                    }}
                    sx={{ minWidth: { sm: 300, lg: 340 } }}
                  />
                  <Button
                    variant="contained"
                    startIcon={
                      searchLoading ? (
                        <CircularProgress size={16} color="inherit" />
                      ) : (
                        <SearchRoundedIcon />
                      )
                    }
                    onClick={handleSearch}
                    disabled={searchLoading}
                    sx={{ minWidth: { xs: "100%", sm: 150 } }}
                  >
                    {searchLoading ? "Searching" : "Get User"}
                  </Button>
                </Stack>
              </Stack>
            </Paper>

            <Stack
              direction={{ xs: "column", md: "row" }}
              spacing={1.5}
              useFlexGap
              flexWrap="wrap"
            >
              <Chip
                color="primary"
                variant="outlined"
                label={`${users.length} total users`}
              />
              <Chip
                color="success"
                variant="outlined"
                label={`${users.filter((entry) => entry.initiated || entry.isInitiated).length} initiated`}
              />
              <Chip
                color="secondary"
                variant="outlined"
                label="JWT protected session"
              />
            </Stack>

            {selectedUser ? (
              <UserDetailsCard
                user={selectedUser}
                onEdit={() => openEditDialog(selectedUser)}
              />
            ) : null}

            <UsersTable
              users={users}
              onEdit={handleEditFromTable}
              isLoading={usersLoading}
            />
          </Stack>
        </Paper>
      </Container>

      <UserFormDialog
        open={dialogOpen}
        mode={dialogMode}
        initialValues={dialogInitialValues}
        onClose={closeDialog}
        onSubmit={handleSubmitUser}
        submitting={formSubmitting}
      />
    </Box>
  );
};

export default UserComponent;
