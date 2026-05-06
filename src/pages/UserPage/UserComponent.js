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
  importUsers,
  updateUser,
} from "../../API/HomeAPI";
import { useAuth } from "../../auth/AuthContext";
import BulkImportCard from "./components/BulkImportCard";
import UserFormDialog from "./components/UserFormDialog";
import UserDetailsCard from "./components/UserDetailsCard";
import ViewUserDialog from "./components/ViewUserDialog";
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
  const [bulkImporting, setBulkImporting] = useState(false);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState("create");
  const [editingUser, setEditingUser] = useState(null);
  const [viewUser, setViewUser] = useState(null);
  const [importSummary, setImportSummary] = useState(null);

  const initiatedUsersCount = useMemo(
    () => users.filter((entry) => entry.initiated || entry.isInitiated).length,
    [users]
  );

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
        return response;
      } catch (error) {
        setSelectedUser(null);
        throw error;
      }
    },
    [setSelectedUser]
  );

  const handleQuickLookupView = async (grNo, shouldNotify = false) => {
    try {
      await refreshSelectedUser(grNo);

      if (shouldNotify) {
        toast.success("User details loaded");
      }
    } catch (error) {
      toast.error(extractApiError(error, "User not found"));
    }
  };

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

      const selectedGrNo = selectedUser?.grNo;
      const editedGrNo = editingUser?.grNo;
      const shouldRefreshOpenDetails =
        selectedGrNo &&
        (selectedGrNo === values.grNo || selectedGrNo === editedGrNo);
      const shouldRefreshViewModal =
        viewUser?.grNo &&
        (viewUser.grNo === values.grNo || viewUser.grNo === editedGrNo);

      if (shouldRefreshOpenDetails) {
        await refreshSelectedUser(values.grNo);
      }

      if (shouldRefreshViewModal) {
        const refreshedViewUser = await fetchUserByGrNo(values.grNo);
        setViewUser(refreshedViewUser);
      }
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
      await handleQuickLookupView(trimmedGrNo, true);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleEditFromTable = (user) => {
    openEditDialog(user);
  };

  const handleViewFromTable = async (user) => {
    if (!user?.grNo) {
      return;
    }

    try {
      const response = await fetchUserByGrNo(user.grNo);
      setViewUser(response);
    } catch (error) {
      toast.error(extractApiError(error, "Could not load user details"));
    }
  };

  const handleEditFromViewDialog = () => {
    if (!viewUser) {
      return;
    }

    const userToEdit = viewUser;
    setViewUser(null);
    openEditDialog(userToEdit);
  };

  const handleBulkImport = async (file) => {
    if (!file) {
      toast.info("Choose a CSV or Excel file first");
      return false;
    }

    setBulkImporting(true);

    try {
      const response = await importUsers(file);
      setImportSummary(response);
      toast.success(response?.message || "Users imported successfully");

      await loadUsers();

      return true;
    } catch (error) {
      setImportSummary(null);
      toast.error(extractApiError(error, "Could not import users"));
      return false;
    } finally {
      setBulkImporting(false);
    }
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
            borderColor: "rgba(122, 31, 43, 0.12)",
            backgroundColor: "rgba(255, 252, 250, 0.92)",
            backdropFilter: "blur(10px)",
            boxShadow: "0 24px 80px rgba(95, 34, 44, 0.08)",
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
                    bgcolor: "rgba(122, 31, 43, 0.08)",
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
                    Manage records, import users in bulk, and keep viewing,
                    editing, and lookup flows neatly separated.
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
                  sx={{
                    minHeight: 52,
                    px: { xs: 2.5, sm: 3 },
                    background:
                      "linear-gradient(135deg, #7a1f2b 0%, #9b384c 100%)",
                    boxShadow: "0 14px 32px rgba(122, 31, 43, 0.22)",
                    "&:hover": {
                      background:
                        "linear-gradient(135deg, #651622 0%, #8d3143 100%)",
                      boxShadow: "0 16px 36px rgba(122, 31, 43, 0.28)",
                    },
                  }}
                >
                  Add user
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
                borderColor: "rgba(122, 31, 43, 0.12)",
                background:
                  "linear-gradient(135deg, rgba(122, 31, 43, 0.08) 0%, rgba(255, 251, 249, 0.97) 56%, rgba(140, 106, 90, 0.08) 100%)",
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
                    Search by GR number to open the lookup card here. Table
                    users open in a separate modal so this section stays focused.
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
                  {selectedUser ? (
                    <Button
                      variant="text"
                      color="secondary"
                      onClick={() => setSelectedUser(null)}
                      sx={{ minWidth: { xs: "100%", sm: 120 } }}
                    >
                      Clear view
                    </Button>
                  ) : null}
                </Stack>
              </Stack>
            </Paper>

            <BulkImportCard
              onImport={handleBulkImport}
              importing={bulkImporting}
              importSummary={importSummary}
            />

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "repeat(2, minmax(0, 1fr))",
                  lg: "repeat(3, minmax(0, 1fr))",
                },
                gap: 1.5,
              }}
            >
              {[
                {
                  label: "Total users",
                  value: users.length,
                  tone: "rgba(122, 31, 43, 0.08)",
                },
                {
                  label: "Initiated users",
                  value: initiatedUsersCount,
                  tone: "rgba(140, 106, 90, 0.12)",
                },
                {
                  label: "Session",
                  value: "JWT secured",
                  tone: "rgba(122, 31, 43, 0.05)",
                },
              ].map((item) => (
                <Paper
                  key={item.label}
                  elevation={0}
                  sx={{
                    p: 2,
                    borderRadius: 4,
                    border: "1px solid",
                    borderColor: "rgba(122, 31, 43, 0.1)",
                    bgcolor: item.tone,
                  }}
                >
                  <Typography color="text.secondary" sx={{ mb: 0.4 }}>
                    {item.label}
                  </Typography>
                  <Typography variant="h6">{item.value}</Typography>
                </Paper>
              ))}
            </Box>

            {selectedUser ? (
              <UserDetailsCard
                user={selectedUser}
                onEdit={() => openEditDialog(selectedUser)}
                onClose={() => setSelectedUser(null)}
              />
            ) : null}

            <UsersTable
              users={users}
              onEdit={handleEditFromTable}
              onView={handleViewFromTable}
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

      <ViewUserDialog
        open={Boolean(viewUser)}
        user={viewUser}
        onClose={() => setViewUser(null)}
        onEdit={handleEditFromViewDialog}
      />
    </Box>
  );
};

export default UserComponent;
