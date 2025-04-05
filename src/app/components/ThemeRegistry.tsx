// src/components/ThemeRegistry.tsx
"use client"; // This component also needs to be a Client Component

import * as React from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles"; // Import theme functions from MUI
import CssBaseline from "@mui/material/CssBaseline"; // Import the CssBaseline component
import NextAppDirEmotionCacheProvider from "./EmotionCache"; // Import the cache provider we just created

// Function to create our theme instance.
// We start with a basic dark theme based on your initial UI design.
const darkTheme = createTheme({
  palette: {
    mode: "dark", // This is the key setting for dark mode!
    // --- Optional Customization ---
    // You can uncomment and customize these later if you want specific colors:
    // primary: {
    //   main: '#90caf9', // Example: A light blue primary color
    // },
    // background: {
    //   default: '#121212', // Standard dark background
    //   paper: '#1e1e1e', // Slightly lighter background for elements like Cards, Paper
    // },
    // text: {
    //   primary: '#ffffff',
    //   secondary: 'rgba(255, 255, 255, 0.7)',
    // }
  },
  // --- Optional Typography Customization ---
  // typography: {
  //   fontFamily: 'Roboto, Arial, sans-serif', // Example: Set default font
  //   h1: {
  //      fontSize: '2.5rem',
  //   }
  // },
  // --- Optional Spacing/Breakpoints Customization ---
  // spacing: 8, // Default spacing unit (8px)
});

// This is the main ThemeRegistry component
export default function ThemeRegistry({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // 1. Provide the Emotion cache using the component we created
    <NextAppDirEmotionCacheProvider options={{ key: "mui" }}>
      {/* 2. Provide the theme instance to MUI components */}
      <ThemeProvider theme={darkTheme}>
        {/* 3. Apply CssBaseline for consistent styling */}
        {/* CssBaseline kickstarts an elegant, consistent, and simple baseline to build upon. */}
        <CssBaseline />
        {/* 4. Render the rest of the application */}
        {children}
      </ThemeProvider>
    </NextAppDirEmotionCacheProvider>
  );
}
