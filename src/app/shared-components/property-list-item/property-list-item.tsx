import React from "react";
import { Feature } from "@/app/shared-components/react-mapbox/types";
import {
  Button,
  Card,
  CardContent,
  Typography,
  IconButton,
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import "./propert-list-item.scss";

/* Generally, I'm not a fan of passing setState functions down as props like this because it can lead to tightly coupled
 * components and "prop drilling" issues, which make the app harder to maintain, especially as it grows in size and complexity.
 * In larger applications, I prefer more encapsulated state management approaches (e.g., using context or custom hooks)
 * to avoid this kind of spaghetti code.  However, since this app is relatively small, and the component structure is simple,
 * passing setState here is an acceptable trade-off for simplicity sake imo. */
interface PropertyListItemProps {
  feature: Feature;
  setSelectedPropertyToLocateOnMap: React.Dispatch<
    React.SetStateAction<string | null>
  >;
}

export const PropertyListItem = ({
  feature,
  setSelectedPropertyToLocateOnMap,
}: PropertyListItemProps) => {
  const {
    properties: { address, bathrooms, bedrooms, date, price, id, area_sqft },
  }: Feature = feature;

  const handleSelect = (): void => {
    setSelectedPropertyToLocateOnMap(id);
  };

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
          <Button
            variant="contained"
            color="primary"
            className="order-button"
            onClick={handleSelect}
          >
            Locate on Map
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
