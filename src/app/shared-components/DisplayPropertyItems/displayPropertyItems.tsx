import {Property} from "@/app/map/types";
import {Typography} from "@mui/material";
import "./display-property-item.scss";

interface PropertyItemProps {
  property: Property;
}

export const PropertyItem = ({ property }: PropertyItemProps) => {
  return (
    <div className="property-item">
      <Typography variant="h6" component="div">
        Property ID: {property.id}
      </Typography>
      <Typography variant="body2" color="textSecondary">
        Price: ${property.price} | {property.bedrooms} beds | {property.bathrooms} baths
      </Typography>
    </div>
  );
};