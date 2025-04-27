import {
  Box,
  Button,
  CircularProgress,
  InputBase,
  MenuItem,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { getQueryParam, request } from "../utils";
import { ChevronRight } from "@mui/icons-material";

export const ScrapeAndStopWords = ({ onSetError, onComplete }) => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [range, setRange] = useState(10);
  const [workFrequency, setWorkFrequency] = useState({});
  const [totalWords, setTotalWords] = useState(0);
  const [stopWords, setStopWords] = useState("");
  const [stopWordFile, setStopWordFile] = useState(null);

  useEffect(() => {
    async function fetchScrappedWords(range) {
      setLoading(true);
      try {
        const response = await request("scrape-words", {
          resource_id: getQueryParam("resource_id"),
          range,
        });
        const { data } = response;
        if (data.message) {
            alert(data.message);
        }
        setWorkFrequency(data?.word_frequency || {});
        setTotalWords(data.total_words);
      } catch (error) {
        alert(error.data.message || "Something went wrong");
      }
      setLoading(false);
    }
    fetchScrappedWords(range);
  }, [range]);

  const handleFileUpload = (event) => {
    const selectedFile = event.target.files[0];
    const validType = "text/plain";
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes

    if (selectedFile) {
      // Check file type
      if (selectedFile.type !== validType) {
        setError("Invalid file type. Please upload a text file.");
        onSetError(true);
        return;
      }

      // Check file size
      if (selectedFile.size > maxSize) {
        setError("File is too large. Please upload a file smaller than 5MB.");
        onSetError(true);
        return;
      }

      // If both checks pass, set the file
      setError("");
      onSetError(false);
      const reader = new FileReader();
      reader.readAsText(selectedFile);
      reader.onload = (e) => {
        // setStopWordFile()
        const { result } = e.target;
        const words = result
          .replace(/[^\w\s]/g, "")
          .split(/\s+/)
          .filter(Boolean);
        setStopWordFile(words);
      };
    } else {
      setError("");
      onSetError(false);
    }
  };

  const handleNextStep = async () => {
    setLoading(true);
    try {
      const response = await request(
        "filter-words",
        { resource_id: getQueryParam("resource_id") },
        {
          stop_words: [
            ...stopWords
              .replace(/[^\w\s]/g, "")
              .split(/\s+/)
              .filter(Boolean),
            ...(stopWordFile || []),
          ],
        },
        "POST",
      );
      const { data } = response;
      onComplete(data.message);
    } catch (error) {
      onSetError(true);
      alert(error?.data?.message || "Something went wrong");
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        mt: 4,
        flex: 1,
        display: "flex",
        flexDirection: "column",
        minWidth: "65vw",
      }}
    >
      {loading ? (
        <CircularProgress sx={{ mx: "auto" }} />
      ) : (
        <>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            spacing={4}
          >
            <Typography variant="h6">
              Scraped words:{" "}
              <Typography component="span" variant="h6" color="primary">
                {totalWords}
              </Typography>
            </Typography>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Typography variant="h6">Top</Typography>
              <Select
                labelId="range"
                value={range}
                size="small"
                onChange={(e) => {
                  setRange(e.target.value);
                }}
              >
                {[10, 20, 30].map((input, index) => (
                  <MenuItem key={`range-${index}`} value={input}>
                    {input}
                  </MenuItem>
                ))}
              </Select>
              <Typography variant="h6">Words</Typography>
            </Stack>
          </Stack>
          <Box
            sx={{
              mt: 4,
              border: "1px solid",
              borderColor: "grey.100",
              maxHeight: "30rem",
              overflow: "auto",
            }}
          >
            <Table size="small">
              <TableHead
                sx={{ position: "sticky", top: 0, backgroundColor: "grey.200" }}
              >
                <TableRow>
                  <TableCell>Word</TableCell>
                  <TableCell>Frequency</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Object.keys(workFrequency).map((key) => (
                  <TableRow
                    sx={{
                      cursor: "pointer",
                      transition: "all 0.1s linear",
                      "&:hover": { backgroundColor: "grey.100" },
                    }}
                    key={key}
                    onClick={() => {
                      let words = stopWords.split(" ");
                      if (words.includes(key)) {
                        words = words.filter((word) => word !== key);
                      } else {
                        words.push(key);
                      }
                      setStopWords(words.join(" "));
                    }}
                  >
                    <TableCell>{key}</TableCell>
                    <TableCell>{workFrequency[key]}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
          <Typography sx={{ mt: 4 }} gutterBottom variant="h6">
            Stop words
          </Typography>
          <InputBase
            value={stopWords}
            onChange={(e) => setStopWords(e.target.value)}
            sx={{ backgroundColor: "grey.100", p: 2, borderRadius: 2 }}
          />
          <InputBase
            sx={{ mt: 1 }}
            required
            type="file"
            onChange={handleFileUpload}
          />
          {error && <Typography color="error">{error}</Typography>}
          <Stack sx={{ my: 4 }} direction="row" justifyContent="end">
            <Button
              disabled={!!error || loading}
              variant="outlined"
              endIcon={
                loading ? (
                  <CircularProgress color="grey.100" size="1rem" />
                ) : (
                  <ChevronRight />
                )
              }
              onClick={handleNextStep}
            >
              {loading ? "Uploading" : "Next"}
            </Button>
          </Stack>
        </>
      )}
    </Box>
  );
};
