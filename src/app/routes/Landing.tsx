import { useNavigate } from "react-router";

import { useEffect, useState } from "react";
import BungieLogin from "../../features/auth/BungieLogin";
import { regenerateTokens } from "../../lib/bungie_api/TokenService";
import { isAuthenticated } from "../../lib/bungie_api/Authorization";
import { Container, Grid, Paper } from "@mui/material";

export const LandingRoute = () => {
  const navigate = useNavigate();

  const [hidden, setHidden] = useState(true);

  useEffect(() => {
    setTimeout(async () => {
      if (isAuthenticated()) {
        console.log("Already authenticated");

        navigate("/app");
      } else if (await regenerateTokens()) {
        console.log("Tokens regenerated and authenticated");

        navigate("/app");
      } else {
        console.log("Not authenticated");
      }

      setHidden(false);
    }, 300);
  }, []);

  return !hidden ? (
    <div>
      <Container maxWidth="md">
        <Paper
          elevation={8}
          square={false}
          sx={{ bgcolor: "#375873", marginTop: 10 }}
        >
          <Grid
            container
            spacing={3}
            direction={"column"}
            justifyContent={"space-around"}
            alignItems={"center"}
            padding={6}
          >
            <Grid item md={12} marginBottom={12}>
              <h1>D2Loadouts</h1>
            </Grid>
            <Grid item md={12}>
              D2Loadouts requires permission to read your Destiny 2 information
            </Grid>
            <Grid item md={3}>
              <BungieLogin />
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </div>
  ) : (
    false
  );
};
