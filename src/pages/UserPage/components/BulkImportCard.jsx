import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";
import FileUploadRoundedIcon from "@mui/icons-material/FileUploadRounded";
import UploadFileRoundedIcon from "@mui/icons-material/UploadFileRounded";
import {
  buildBulkImportCsvTemplate,
  BULK_IMPORT_ACCEPTED_FILE_TYPES,
  BULK_IMPORT_ALL_COLUMNS,
  BULK_IMPORT_OPTIONAL_COLUMNS,
  BULK_IMPORT_REQUIRED_COLUMNS,
} from "../bulkImportConfig";

const downloadTextFile = (content, fileName, mimeType) => {
  const fileBlob = new Blob([content], { type: mimeType });
  const objectUrl = URL.createObjectURL(fileBlob);
  const link = document.createElement("a");

  link.href = objectUrl;
  link.download = fileName;
  link.click();

  URL.revokeObjectURL(objectUrl);
};

const BulkImportCard = ({ onImport, importing, importSummary }) => {
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    if (importSummary?.importedCount) {
      setSelectedFile(null);
    }
  }, [importSummary]);

  const importedUsersPreview = useMemo(() => {
    const importedGrNos = importSummary?.importedGrNos || [];

    if (importedGrNos.length <= 6) {
      return importedGrNos;
    }

    return [...importedGrNos.slice(0, 6), `+${importedGrNos.length - 6} more`];
  }, [importSummary]);

  const handleTemplateDownload = () => {
    downloadTextFile(
      buildBulkImportCsvTemplate(),
      "bulk-user-import-template.csv",
      "text/csv;charset=utf-8"
    );
  };

  const handleImport = async () => {
    if (!selectedFile || importing) {
      return;
    }

    const wasImported = await onImport(selectedFile);

    if (wasImported) {
      setSelectedFile(null);
    }
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 2, md: 2.5 },
        borderRadius: 4,
        border: "1px solid",
        borderColor: "rgba(122, 31, 43, 0.12)",
        background:
          "linear-gradient(135deg, rgba(122, 31, 43, 0.06) 0%, rgba(255, 251, 249, 0.97) 58%, rgba(140, 106, 90, 0.08) 100%)",
      }}
    >
      <Stack spacing={2.5}>
        <Stack
          direction={{ xs: "column", lg: "row" }}
          spacing={2}
          justifyContent="space-between"
          alignItems={{ xs: "stretch", lg: "flex-start" }}
        >
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 800, mb: 0.5 }}>
              Bulk import users
            </Typography>
            <Typography color="text.secondary">
              Upload a CSV or Excel file and the app will create all valid user
              records in one go.
            </Typography>
          </Box>

          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={1.25}
            width={{ xs: "100%", lg: "auto" }}
          >
            <Button
              variant="outlined"
              startIcon={<DownloadRoundedIcon />}
              onClick={handleTemplateDownload}
              fullWidth
            >
              Download CSV template
            </Button>
            <Button
              component="label"
              variant="outlined"
              startIcon={<UploadFileRoundedIcon />}
              fullWidth
            >
              {selectedFile ? "Change file" : "Choose file"}
              <input
                hidden
                type="file"
                accept={BULK_IMPORT_ACCEPTED_FILE_TYPES}
                onChange={(event) =>
                  setSelectedFile(event.target.files?.[0] || null)
                }
              />
            </Button>
            <Button
              variant="contained"
              startIcon={
                importing ? (
                  <CircularProgress size={16} color="inherit" />
                ) : (
                  <FileUploadRoundedIcon />
                )
              }
              onClick={handleImport}
              disabled={!selectedFile || importing}
              fullWidth
            >
              {importing ? "Importing" : "Import users"}
            </Button>
          </Stack>
        </Stack>

        <Alert
          severity="info"
          sx={{
            alignItems: "center",
            color: "primary.dark",
            backgroundColor: "rgba(122, 31, 43, 0.07)",
            "& .MuiAlert-icon": {
              color: "primary.main",
            },
          }}
        >
          Keep the header names exactly as expected. Do not add spaces in the
          column names.
        </Alert>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              md: "repeat(2, minmax(0, 1fr))",
            },
            gap: 1.5,
          }}
        >
          <Paper
            elevation={0}
            sx={{
              p: 2,
              borderRadius: 3,
              border: "1px solid",
              borderColor: "rgba(122, 31, 43, 0.12)",
              bgcolor: "rgba(255, 251, 249, 0.9)",
            }}
          >
            <Typography sx={{ fontWeight: 700, mb: 1 }}>
              Required columns
            </Typography>
            <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
              {BULK_IMPORT_REQUIRED_COLUMNS.map((column) => (
                <Chip key={column} label={column} color="primary" variant="outlined" />
              ))}
            </Stack>
          </Paper>

          <Paper
            elevation={0}
            sx={{
              p: 2,
              borderRadius: 3,
              border: "1px solid",
              borderColor: "rgba(122, 31, 43, 0.12)",
              bgcolor: "rgba(255, 251, 249, 0.9)",
            }}
          >
            <Typography sx={{ fontWeight: 700, mb: 1 }}>
              Optional columns
            </Typography>
            <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
              {BULK_IMPORT_OPTIONAL_COLUMNS.map((column) => (
                <Chip key={column} label={column} variant="outlined" />
              ))}
            </Stack>
          </Paper>
        </Box>

        <Box
          sx={{
            p: 1.5,
            borderRadius: 3,
            bgcolor: "rgba(122, 31, 43, 0.04)",
            border: "1px dashed",
            borderColor: "rgba(122, 31, 43, 0.16)",
            overflowX: "auto",
          }}
        >
          <Typography
            component="pre"
            sx={{
              m: 0,
              fontSize: "0.85rem",
              lineHeight: 1.7,
              fontFamily:
                '"SFMono-Regular", ui-monospace, "Cascadia Code", "Source Code Pro", Menlo, monospace',
            }}
          >
            {BULK_IMPORT_ALL_COLUMNS.join(", ")}
          </Typography>
        </Box>

        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={2}
          alignItems={{ xs: "flex-start", md: "center" }}
          justifyContent="space-between"
        >
          <Typography color="text.secondary">
            Accepted file types: CSV, XLSX, XLS
            {selectedFile ? ` | Selected: ${selectedFile.name}` : ""}
          </Typography>
          <Typography color="text.secondary">
            Use true, false, yes, no, 1, or 0 for isInitiated.
          </Typography>
        </Stack>

        <Paper
          elevation={0}
          sx={{
            p: 2,
            borderRadius: 3,
            border: "1px solid",
            borderColor: "rgba(122, 31, 43, 0.12)",
            bgcolor: "rgba(255, 251, 249, 0.9)",
          }}
        >
          <Stack spacing={0.75}>
            <Typography sx={{ fontWeight: 700 }}>How to avoid errors</Typography>
            <Typography color="text.secondary">
              1. Download the template and keep the same headers.
            </Typography>
            <Typography color="text.secondary">
              2. Fill every required column for each user.
            </Typography>
            <Typography color="text.secondary">
              3. Leave photo, remarks, and email blank if you do not need them.
            </Typography>
            <Typography color="text.secondary">
              4. Do not repeat the same GR number in the same file.
            </Typography>
          </Stack>
        </Paper>

        {importSummary ? (
          <Paper
            elevation={0}
            sx={{
              p: 2,
              borderRadius: 3,
              border: "1px solid",
              borderColor: "success.light",
              bgcolor: "rgba(29, 131, 72, 0.06)",
            }}
          >
            <Stack spacing={1}>
              <Typography sx={{ fontWeight: 700 }}>
                {importSummary.message}
              </Typography>
              <Typography color="text.secondary">
                Imported count: {importSummary.importedCount}
              </Typography>
              {!!importedUsersPreview.length && (
                <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
                  {importedUsersPreview.map((entry) => (
                    <Chip key={entry} label={entry} size="small" color="success" />
                  ))}
                </Stack>
              )}
            </Stack>
          </Paper>
        ) : null}
      </Stack>
    </Paper>
  );
};

export default BulkImportCard;
