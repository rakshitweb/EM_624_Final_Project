import { Box } from "@mui/material";
import { useEffect, useRef } from "react";

export const ScrapeWords = () => {
  const resourceIdRef = useRef();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    resourceIdRef.current = params.get("resource_id");
  }, []);

  return <Box></Box>;
};
