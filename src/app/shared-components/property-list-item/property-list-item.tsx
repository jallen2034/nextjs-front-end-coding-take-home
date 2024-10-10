import React from "react";
import { Feature } from "@/app/shared-components/react-mapbox/types";
import { Button, Card, CardContent, Typography } from "@mui/material";
import "./propert-list-item.scss";

interface PropertyListItemProps {
  feature: Feature;
}

export const PropertyListItem = ({ feature }: PropertyListItemProps) => {
  const {
    properties: { address, bathrooms, bedrooms, date, price, id, area_sqft },
  }: Feature = feature;

  return (
    <Card className="property-card">
      <CardContent>
        <Typography variant="h6" className="property-title">
          {`Property ID: ${id}`}
        </Typography>
        <Typography variant="body1">{`${address}`}</Typography>
        <Typography variant="body2" color="textSecondary">
          {`Area: ${area_sqft} sqft`}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          {`Bedrooms: ${bedrooms} | Bathrooms: ${bathrooms}`}
        </Typography>
        <Typography variant="h6" className="property-price">
          {`Price: $${price}`}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          {`Date listed: ${date}`}
        </Typography>
        <div className="button-container">
          <Button variant="contained" color="primary">
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
