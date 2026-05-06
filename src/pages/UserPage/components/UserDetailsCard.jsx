import { Avatar, Box, Button, Chip, Paper, Stack, Typography } from "@mui/material";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import { toImageSrc } from "../userFormConfig";

const DetailPanel = ({ label, value }) => (
  <Paper
    elevation={0}
    sx={{
      p: 1.6,
      borderRadius: 3,
      border: "1px solid",
      borderColor: "rgba(122, 31, 43, 0.1)",
      bgcolor: "rgba(255, 251, 249, 0.92)",
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

const UserDetailsCard = ({ user, onEdit, onClose }) => {
  const imageSrc = toImageSrc(user.photoBase64);
  const isInitiated = user.initiated || user.isInitiated;

  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 2, md: 3 },
        borderRadius: 4,
        border: "1px solid",
        borderColor: "rgba(122, 31, 43, 0.14)",
        background:
          "linear-gradient(135deg, rgba(122, 31, 43, 0.08) 0%, rgba(255, 251, 249, 0.99) 58%, rgba(140, 106, 90, 0.08) 100%)",
      }}
    >
      <Stack spacing={2.5}>
        <Stack
          direction={{ xs: "column", lg: "row" }}
          spacing={2}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", lg: "center" }}
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
                width: { xs: 82, sm: 96 },
                height: { xs: 82, sm: 96 },
                borderRadius: 4,
                bgcolor: "primary.main",
                boxShadow: "0 14px 32px rgba(122, 31, 43, 0.18)",
              }}
            >
              {user.name?.[0] || "U"}
            </Avatar>

            <Box>
              <Stack
                direction="row"
                spacing={1}
                alignItems="center"
                useFlexGap
                flexWrap="wrap"
                sx={{ mb: 0.8 }}
              >
                <Chip
                  icon={<SearchRoundedIcon />}
                  label="Quick lookup result"
                  size="small"
                  sx={{
                    bgcolor: "rgba(122, 31, 43, 0.1)",
                    color: "primary.main",
                  }}
                />
                <Chip
                  label={isInitiated ? "Initiated" : "Not initiated"}
                  size="small"
                  color={isInitiated ? "success" : "default"}
                />
              </Stack>

              <Typography variant="h5" sx={{ fontWeight: 800, lineHeight: 1.1 }}>
                {user.name || "Unknown User"}
              </Typography>
              <Typography color="text.secondary" sx={{ mt: 0.5 }}>
                GR No: {user.grNo || "-"}
              </Typography>
            </Box>
          </Stack>

          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={1}
            sx={{ width: { xs: "100%", lg: "auto" } }}
          >
            <Button
              variant="contained"
              startIcon={<EditRoundedIcon />}
              onClick={onEdit}
              sx={{ width: { xs: "100%", sm: "auto" } }}
            >
              Edit user
            </Button>
            <Button
              variant="text"
              color="secondary"
              startIcon={<CloseRoundedIcon />}
              onClick={onClose}
              sx={{ width: { xs: "100%", sm: "auto" } }}
            >
              Clear lookup
            </Button>
          </Stack>
        </Stack>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, minmax(0, 1fr))",
              xl: "repeat(4, minmax(0, 1fr))",
            },
            gap: 1.5,
          }}
        >
          <DetailPanel label="Department" value={user.department} />
          <DetailPanel label="Sub department" value={user.subDepartment} />
          <DetailPanel label="Attendance" value={user.totalAttendance} />
          <DetailPanel label="Mobile number" value={user.mobileNumber} />
          <DetailPanel label="Email" value={user.email} />
          <DetailPanel label="Area" value={user.area} />
          <DetailPanel label="Age" value={user.age} />
          <DetailPanel label="Status" value={isInitiated ? "Initiated" : "Not initiated"} />
        </Box>

        <Paper
          elevation={0}
          sx={{
            p: 2,
            borderRadius: 3,
            border: "1px solid",
            borderColor: "rgba(122, 31, 43, 0.1)",
            bgcolor: "rgba(255, 251, 249, 0.92)",
          }}
        >
          <Typography
            variant="caption"
            sx={{ color: "text.secondary", display: "block", mb: 0.8 }}
          >
            Remarks
          </Typography>
          <Typography sx={{ lineHeight: 1.65 }}>
            {user.remarks || "No remarks added for this user."}
          </Typography>
        </Paper>
      </Stack>
    </Paper>
  );
};

export default UserDetailsCard;
