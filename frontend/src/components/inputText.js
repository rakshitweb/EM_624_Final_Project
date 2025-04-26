import { ChevronRight } from "@mui/icons-material";
import {
  Button,
  CircularProgress,
  FormControl,
  InputBase,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  styled,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { request } from "../utils";

const Form = styled("form")(() => ({
  flex: 1,
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  minWidth: "65vw",
}));

const INPUT_TYPES = [
  {
    id: "text",
    label: "Text",
  },
  {
    id: "url",
    label: "Website Link",
  },
];

export const InputText = ({ onSetError, onComplete }) => {
  const [inputType, setInputType] = useState(INPUT_TYPES[0].id);
  const [error, setError] = useState(null);
  const [input, setInput] = useState({ type: INPUT_TYPES[0].id, payload: "" });
  const [loading, setLoading] = useState(false);

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
      setInput({ type: inputType, payload: selectedFile });
    }
  };

  const handleLink = (event) => {
    const { value } = event.target;
    setInput({ type: inputType, payload: value });
    const urlPattern = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;
    if (!urlPattern.test(value)) {
      setError("Invalid URL. Please provide a valid URL.");
    } else {
      setError(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await request(
        "upload-input",
        { type: input.type },
        { payload: input.payload },
        "POST",
      );
      const { resource_id, message } = response.data;
      const url = new URL(window.location);
      url.searchParams.set("resource_id", resource_id);
      window.history.pushState({}, "", url);
      onComplete(message);
    } catch (error) {
      setError(error?.response?.data?.detail || "Something went wrong");
    }
    setLoading(false);
  };

  useEffect(() => {
    onSetError(null);
    setError(null);
    setInput({ type: INPUT_TYPES[0].id, payload: "" });
  }, [inputType, onSetError, setInput, setError]);

  return (
    <Form onSubmit={handleSubmit}>
      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel id="input_type">Type</InputLabel>
        <Select
          labelId="input_type"
          value={inputType}
          label="Age"
          onChange={(e) => {
            setInputType(e.target.value);
          }}
        >
          {INPUT_TYPES.map((input) => (
            <MenuItem key={input.id} value={input.id}>
              {input.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      {inputType === "file" && (
        <InputBase required type="file" onChange={handleFileUpload} />
      )}
      {inputType === "text" && (
        <InputBase
          sx={{ backgroundColor: "grey.100", p: 2, borderRadius: 2 }}
          multiline
          rows={10}
          value={input.payload}
          onChange={(e) => {
            setInput({ type: inputType, payload: e.target.value });
            setError(null);
          }}
        />
      )}
      {inputType === "url" && (
        <InputBase
          sx={{ backgroundColor: "grey.100", p: 2, borderRadius: 2 }}
          value={input.payload}
          onChange={handleLink}
        />
      )}
      {error && (
        <Typography sx={{ mt: 2 }} color="error">
          {error.toString()}
        </Typography>
      )}
      <Stack sx={{ mt: 4 }} direction="row" justifyContent="end">
        <Button
          disabled={!!error || !input.payload || loading}
          variant="outlined"
          endIcon={
            loading ? (
              <CircularProgress color="grey.100" size="1rem" />
            ) : (
              <ChevronRight />
            )
          }
          type="submit"
        >
          {loading ? "Uploading" : "Next"}
        </Button>
      </Stack>
    </Form>
  );
};
