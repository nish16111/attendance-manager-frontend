import { Avatar, Box, Button, Chip, Paper, Stack, Typography } from "@mui/material";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import { toImageSrc } from "../userFormConfig";

const labelStyle = {
  fontSize: "0.85rem",
  color: "text.secondary",
};

const valueStyle = {
  fontWeight: 600,
  color: "text.primary",
};

const InfoPair = ({ label, value }) => (
  <Box
    sx={{
      minWidth: 0,
      p: 1.5,
      borderRadius: 3,
      bgcolor: "rgba(255,255,255,0.62)",
      border: "1px solid",
      borderColor: "rgba(18,35,56,0.08)",
    }}
  >
    <Typography sx={labelStyle}>{label}</Typography>
    <Typography sx={valueStyle}>{value || "-"}</Typography>
  </Box>
);

const UserDetailsCard = ({ user, onEdit }) => {
  const imageSrc = toImageSrc(user.photoBase64);

  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 2, md: 3 },
        borderRadius: 4,
        border: "1px solid",
        borderColor: "divider",
        background:
          "linear-gradient(135deg, rgba(244,250,255,0.92) 0%, rgba(250,255,249,0.95) 100%)",
      }}
    >
      <Stack spacing={2}>
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={2}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", md: "center" }}
        >
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            alignItems={{ xs: "flex-start", sm: "center" }}
          >
            <Avatar
              src={imageSrc}
              alt={user.name}
              variant="rounded"
              sx={{ width: 88, height: 88, borderRadius: 3 }}
            />
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                {user.name || "Unknown User"}
              </Typography>
              <Typography color="text.secondary">GR No: {user.grNo || "-"}</Typography>
            </Box>
          </Stack>

          <Button
            variant="contained"
            startIcon={<EditRoundedIcon />}
            onClick={onEdit}
            sx={{ width: { xs: "100%", md: "auto" } }}
          >
            Edit User
          </Button>
        </Stack>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, minmax(0, 1fr))",
              lg: "repeat(4, minmax(0, 1fr))",
            },
            gap: 1.5,
          }}
        >
          <InfoPair label="Department" value={user.department} />
          <InfoPair label="Sub Department" value={user.subDepartment} />
          <InfoPair label="Attendance" value={user.totalAttendance} />
          <InfoPair label="Mobile" value={user.mobileNumber} />
          <InfoPair label="Email" value={user.email} />
          <InfoPair label="Address" value={user.area} />
          <InfoPair label="Age" value={user.age} />
        </Box>

        <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
          <Typography sx={labelStyle}>Status:</Typography>
          <Chip
            size="small"
            color={user.initiated || user.isInitiated ? "success" : "default"}
            label={user.initiated || user.isInitiated ? "Initiated" : "Not initiated"}
          />
          {user.remarks ? (
            <Typography sx={{ ...labelStyle, ml: 1 }}>
              Remarks: <span style={{ color: "#1f2a37" }}>{user.remarks}</span>
            </Typography>
          ) : null}
        </Stack>
      </Stack>
    </Paper>
  );
};

export default UserDetailsCard;
