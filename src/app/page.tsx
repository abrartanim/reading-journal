"use client";

import { signInWithPopup } from "firebase/auth";
import { GoogleAuthProvider } from "firebase/auth/web-extension";
import React from "react";
import { auth } from "./firebase/config";
import { Box, Button, Typography } from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";

export default function Home() {
  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      console.log("Successfully signed in user", user);

      alert(`Welcome ${user.displayName}!`);
    } catch (error: any) {
      const errorCode = error.code;
      const errorMessage = error.message;
      const email = error.customData?.email;
      const credential = GoogleAuthProvider.credentialFromError(error);
      console.error(
        "Error during sign in",
        errorCode,
        errorMessage,
        email,
        credential
      );
      alert(`Sign in failed ${errorMessage}`);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        padding: 4,
        // border: "2px solid red",
      }}
    >
      {/* <h1>Hello there</h1> */}

      <Typography variant="h4" gutterBottom>
        Welcome to Reading Journey
      </Typography>

      <Typography variant="body1" sx={{ mb: 4 }}>
        Please sign in to continue
      </Typography>
      <Button
        variant="contained"
        startIcon={<GoogleIcon />}
        onClick={handleGoogleSignIn}
        size="large"
      >
        Sign in with Google
      </Button>
    </Box>
  );
}
