import { useNavigate } from "react-router";

import React, { useEffect, useState } from "react";
import BungieLogin from "../../features/auth/BungieLogin";
import { regenerateTokens } from "../../lib/bungie_api/TokenService";
import { isAuthenticated } from "../../lib/bungie_api/AuthService";
import { Container, Grid, Paper } from "@mui/material";
import { useDispatch } from "react-redux";
import { updateMembershipId } from "../../store/MembershipReducer";
import { getDestinyMembershipId } from "../../features/membership/BungieAccount";

export const LandingRoute = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    setTimeout(async () => {
      if (isAuthenticated()) {
        console.log("Already authenticated");
        var destinyMembershipId = await getDestinyMembershipId();
        dispatch(updateMembershipId(destinyMembershipId));

        navigate("/app");
      } else if (regenerateTokens()) {
        console.log("Tokens regenerated and authenticated");
        var destinyMembershipId = await getDestinyMembershipId();
        dispatch(updateMembershipId(destinyMembershipId));
        navigate("/app");
      } else {
        console.log("Not authenticated");
      }
    }, 300);
  }, []);

  return (
    <React.Fragment>
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
    </React.Fragment>
  );
};
