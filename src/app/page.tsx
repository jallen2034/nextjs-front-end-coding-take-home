"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { Button, Typography, Box } from "@mui/material";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import "./app.scss";

export default function Home() {
  const router: AppRouterInstance = useRouter();

  // Navigate to the /calculator route when the button is clicked.
  const handleMapButtonClick = (): void => {
    router.push("/map");
  };

  const handlePaginationButtonClick = () => {
    router.push('/pagination');
  };

  return (
    <main className="main">
      <div className="description">
        <Typography variant="h4" className="homepageHeading" gutterBottom>
          Real Estate Data Visualization.
        </Typography>
        <Typography variant="body1" className="descriptionText" paragraph>
          Explore and interact with the provided Vancouver resale data on an
          interactive map. Use filters to dive deeper into the trends and
          insights from the dataset.
        </Typography>
        <Box className="buttonWrapper" sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="contained"
            color="primary"
            className="calculatorButton"
            onClick={handleMapButtonClick}
          >
            Launch Map
          </Button>
          <Button
            variant="contained"
            color="secondary"
            className="calculatorButton"
            onClick={handlePaginationButtonClick}
          >
            Launch Paginated Data Demo
          </Button>
        </Box>
      </div>
    </main>
  );
}
