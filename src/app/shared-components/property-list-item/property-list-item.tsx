import React from "react";
import { Feature } from "@/app/shared-components/react-mapbox/types";
import { Button, Card, CardContent, Typography, IconButton } from "@mui/material";
import FavoriteIcon from '@mui/icons-material/Favorite';
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
      <div className="property-header">
        <Typography variant="h6" className="property-title">
          {`Property ID: ${id}`}
        </Typography>
        <div className="property-icons">
          <IconButton>
            <FavoriteIcon />
          </IconButton>
        </div>
      </div>
      <CardContent>
        <div className="card-content">
          <Typography variant="body1">{`${address}`}</Typography>
          <Typography variant="body2" color="textSecondary">
            {`Area: ${area_sqft} sqft`}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {`Bedrooms: ${bedrooms} | Bathrooms: ${bathrooms}`}
          </Typography>
          <Typography variant="h6" className="property-price">
            {`$${price}`}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {`Date listed: ${date}`}
          </Typography>
          <Button variant="contained" color="primary" className="order-button">
            Locate on Map
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
