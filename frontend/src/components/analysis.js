import { Box, CircularProgress, Stack, Typography } from "@mui/material";
import { BASE_URL, getQueryParam, request } from "../utils";
import { useEffect, useState } from "react";

export const Analysis = () => {
  const [loading, setLoading] = useState(false);
  const resource_id = getQueryParam("resource_id");
  const [stats, setStats] = useState(null);

  useEffect(() => {
    async function getSentimentScore() {
      setLoading(true);
      try {
        const response = await request("output", {
          resource_id: getQueryParam("resource_id"),
        });
        const { stats } = response.data;
        setStats(stats);
      } catch (error) {
        alert(error.data.message || "Something went wrong");
      }
      setLoading(false);
    }
    getSentimentScore();
  }, []);

  return (
    <Box sx={{ flex: 1, my: 4 }}>
      {loading ? (
        <CircularProgress />
      ) : (
        <>
          <Stack spacing={1} alignItems="center">
            <Typography variant="h5">Word Cloud</Typography>
            <Box
              sx={{
                maxWidth: "30rem",
                border: "1px solid",
                borderColor: "grey.200",
              }}
            >
              <img
                style={{ width: "100%", height: "auto" }}
                src={`${BASE_URL}output-image?resource_id=${resource_id}`}
                alt="Word Cloud"
              />
            </Box>
          </Stack>
          <Stack sx={{ mt: 2 }} spacing={2}>
            <Box>
              <Typography variant="h5">Sentiment Score</Typography>
              <Typography variant="h5">
                Positive:{" "}
                <Typography sx={{ display: "inline-block" }} color="primary">
                  {stats?.sentiment_score?.pos}
                </Typography>
              </Typography>
              <Typography variant="h5">
                Negative:{" "}
                <Typography sx={{ display: "inline-block" }} color="primary">
                  {stats?.sentiment_score?.neg}
                </Typography>
              </Typography>
              <Typography variant="h5">
                Neutral:{" "}
                <Typography sx={{ display: "inline-block" }} color="primary">
                  {stats?.sentiment_score?.neu}
                </Typography>
              </Typography>
              <Typography variant="h5">
                Compound:{" "}
                <Typography sx={{ display: "inline-block" }} color="primary">
                  {stats?.sentiment_score?.compound}
                </Typography>
              </Typography>
            </Box>
            <Box>
              <Typography variant="h5">
                Lexical Score:{" "}
                <Typography sx={{ display: "inline-block" }} color="primary">
                  {stats?.lexical_score?.toFixed(2)}
                </Typography>
              </Typography>
            </Box>
            <Box>
              <Typography variant="h5">Frequent Bigrams</Typography>
              {stats?.bigrams?.map((bigram, index) => (
                <Typography key={`bigram-${index}`}>
                  (
                  <Typography component="span" variant="h6" color="primary">
                    {bigram[0][0]}
                  </Typography>
                  ,{" "}
                  <Typography component="span" variant="h6" color="primary">
                    {bigram[0][1]}
                  </Typography>
                  ):{" "}
                  <Typography component="span" variant="h6" color="primary">
                    {bigram[1]}
                  </Typography>
                </Typography>
              ))}
            </Box>
          </Stack>
        </>
      )}
    </Box>
  );
};
