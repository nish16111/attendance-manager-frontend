import {
  Avatar,
  Box,
  Button,
  Chip,
  Dialog,
  DialogContent,
  IconButton,
  Paper,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import { toImageSrc } from "../userFormConfig";

const DetailBlock = ({ label, value }) => (
  <Paper
    elevation={0}
    sx={{
      p: 1.75,
      borderRadius: 3,
      border: "1px solid",
      borderColor: "rgba(122, 31, 43, 0.12)",
      bgcolor: "rgba(255, 251, 249, 0.94)",
      minHeight: 84,
    }}
  >
    <Typography
      variant="caption"
      sx={{ color: "text.secondary", display: "block", mb: 0.6 }}
    >
      {label}
    </Typography>
    <Typography sx={{ fontWeight: 700, lineHeight: 1.4 }}>
      {value || "-"}
    </Typography>
  </Paper>
);

const ViewUserDialog = ({ open, user, onClose, onEdit }) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  if (!user) {
    return null;
  }

  const imageSrc = toImageSrc(user.photoBase64);
  const isInitiated = user.initiated || user.isInitiated;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullScreen={fullScreen}
      fullWidth
      maxWidth="md"
      PaperProps={{
        sx: {
          borderRadius: { xs: 0, sm: 5 },
          overflow: "hidden",
          background:
            "linear-gradient(180deg, rgba(247, 239, 235, 0.98) 0%, rgba(255, 252, 250, 1) 100%)",
        },
      }}
    >
      <DialogContent sx={{ p: 0 }}>
        <Box
          sx={{
            px: { xs: 2, sm: 3 },
            py: { xs: 2.5, sm: 3 },
            background:
              "linear-gradient(135deg, rgba(122, 31, 43, 0.95) 0%, rgba(101, 22, 34, 0.96) 58%, rgba(140, 106, 90, 0.9) 100%)",
            color: "common.white",
          }}
        >
          <Stack spacing={2}>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="flex-start"
              spacing={2}
            >
              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={2}
                alignItems={{ xs: "flex-start", sm: "center" }}
              >
                <Avatar
                  src={imageSrc}
                  alt={user.name || "User"}
                  variant="rounded"
                  sx={{
                    width: { xs: 78, sm: 92 },
                    height: { xs: 78, sm: 92 },
                    borderRadius: 4,
                    bgcolor: "rgba(255,255,255,0.18)",
                    border: "1px solid rgba(255,255,255,0.22)",
                  }}
                >
                  {user.name?.[0] || "U"}
                </Avatar>

                <Box>
                  <Typography
                    variant="overline"
                    sx={{ letterSpacing: "0.12em", opacity: 0.82 }}
                  >
                    User overview
                  </Typography>
                  <Typography
                    variant="h5"
                    sx={{ fontWeight: 800, lineHeight: 1.1, mb: 0.6 }}
                  >
                    {user.name || "Unknown User"}
                  </Typography>
                  <Typography sx={{ opacity: 0.88, mb: 1 }}>
                    GR No: {user.grNo || "-"}
                  </Typography>
                  <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
                    <Chip
                      label={isInitiated ? "Initiated" : "Not initiated"}
                      size="small"
                      sx={{
                        bgcolor: isInitiated
                          ? "rgba(219, 245, 201, 0.18)"
                          : "rgba(255,255,255,0.14)",
                        color: "common.white",
                        border: "1px solid rgba(255,255,255,0.18)",
                      }}
                    />
                    <Chip
                      label={`${user.totalAttendance ?? "-"} attendance`}
                      size="small"
                      sx={{
                        bgcolor: "rgba(255,255,255,0.14)",
                        color: "common.white",
                        border: "1px solid rgba(255,255,255,0.18)",
                      }}
                    />
                  </Stack>
                </Box>
              </Stack>

              <IconButton
                onClick={onClose}
                sx={{
                  color: "common.white",
                  bgcolor: "rgba(255,255,255,0.08)",
                  "&:hover": {
                    bgcolor: "rgba(255,255,255,0.16)",
                  },
                }}
              >
                <CloseRoundedIcon />
              </IconButton>
            </Stack>

            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={1.25}
              justifyContent="space-between"
              alignItems={{ xs: "stretch", sm: "center" }}
            >
              <Typography sx={{ opacity: 0.85 }}>
                Clean profile view with the most important user details in one place.
              </Typography>
              <Button
                variant="contained"
                startIcon={<EditRoundedIcon />}
                onClick={onEdit}
                sx={{
                  bgcolor: "common.white",
                  color: "primary.main",
                  minWidth: { xs: "100%", sm: 160 },
                  "&:hover": {
                    bgcolor: "rgba(255,255,255,0.92)",
                  },
                }}
              >
                Edit user
              </Button>
            </Stack>
          </Stack>
        </Box>

        <Box sx={{ px: { xs: 2, sm: 3 }, py: { xs: 2, sm: 3 } }}>
          <Stack spacing={2.25}>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "repeat(2, minmax(0, 1fr))",
                },
                gap: 1.5,
              }}
            >
              <DetailBlock label="Department" value={user.department} />
              <DetailBlock label="Sub department" value={user.subDepartment} />
              <DetailBlock label="Mobile number" value={user.mobileNumber} />
              <DetailBlock label="Email" value={user.email} />
              <DetailBlock label="Area" value={user.area} />
              <DetailBlock label="Age" value={user.age} />
            </Box>

            <Paper
              elevation={0}
              sx={{
                p: 2,
                borderRadius: 3,
                border: "1px solid",
                borderColor: "rgba(122, 31, 43, 0.12)",
                bgcolor: "rgba(122, 31, 43, 0.04)",
              }}
            >
              <Typography
                variant="caption"
                sx={{ color: "text.secondary", display: "block", mb: 0.8 }}
              >
                Remarks
              </Typography>
              <Typography sx={{ lineHeight: 1.6 }}>
                {user.remarks || "No remarks added for this user."}
              </Typography>
            </Paper>
          </Stack>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default ViewUserDialog;
