import React from 'react';
import Typography from "@mui/material/Typography";
import { Button, FormControl, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import { BATHROOM_OPTIONS, BEDROOM_OPTIONS } from "@/app/shared-components/filter-data-modal/contants";
import { ChangeFilterModalCB } from "@/app/shared-components/react-mapbox/types";
import { FilterData } from "@/app/shared-components/filter-data-modal/types";
import "./modal-form.scss";

interface ModalFormProps {
  handleOpenCloseFilterModal: ChangeFilterModalCB;
  handleInputChange: any;
  handleSelectChange: any;
  filters: FilterData;
  filterErrors: any;
  handleSubmitButtonAction: any
}

const ModalForm = ({
  handleOpenCloseFilterModal,
  handleInputChange,
  handleSelectChange,
  filters,
  filterErrors,
  handleSubmitButtonAction
}: ModalFormProps) => {
  return (
    <div className="modal-form-container">
      {/* Square Feet Filter */}
      <Typography variant="body1" className="modal-font">
        Square Feet
      </Typography>
      <div className="filter-inputs">
        <TextField
          label="Min Square Feet"
          value={filters.squareFeet.min}
          onChange={handleInputChange("squareFeet", "min")}
          margin="normal"
          fullWidth
          error={!!filterErrors?.squareFeet?.min} // Show error if exists.
          helperText={filterErrors?.squareFeet?.min} // Display error message.
        />
        <TextField
          label="Max Square Feet"
          value={filters.squareFeet.max}
          onChange={handleInputChange("squareFeet", "max")}
          margin="normal"
          fullWidth
          error={!!filterErrors?.squareFeet?.max} // Show error if exists.
          helperText={filterErrors?.squareFeet?.max} // Display error message.
        />
      </div>
      {/* Bedrooms Filter */}
      <Typography gutterBottom className="modal-font">
        Bedrooms
      </Typography>
      <div className="filter-inputs">
        <FormControl
          margin="normal"
          fullWidth
          error={!!filterErrors?.bedrooms?.min}
        >
          <InputLabel id="min-bedrooms-label">Min</InputLabel>
          <Select
            labelId="min-bedrooms-label"
            value={filters.bedrooms.min}
            onChange={handleSelectChange("bedrooms", true)}
            label="Min"
            displayEmpty
          >
            {BEDROOM_OPTIONS.map((num: number) => (
              <MenuItem key={num} value={num}>
                {num}
              </MenuItem>
            ))}
          </Select>
          {filterErrors?.bedrooms?.min && (
            <Typography variant="caption" color="error">
              {filterErrors.bedrooms.min}
            </Typography>
          )}
        </FormControl>
        <FormControl
          margin="normal"
          fullWidth
          error={!!filterErrors?.bedrooms?.max}
        >
          <InputLabel id="max-bedrooms-label">Max</InputLabel>
          <Select
            labelId="max-bedrooms-label"
            value={filters.bedrooms.max}
            onChange={handleSelectChange("bedrooms", false)}
            label="Max"
            displayEmpty
          >
            {BEDROOM_OPTIONS.map((num: number) => (
              <MenuItem key={num} value={num}>
                {num}
              </MenuItem>
            ))}
          </Select>
          {filterErrors?.bedrooms?.max && (
            <Typography variant="caption" color="error">
              {filterErrors.bedrooms.max}
            </Typography>
          )}
        </FormControl>
      </div>
      {/* Bathrooms Filter */}
      <Typography gutterBottom className="modal-font">
        Bathrooms
      </Typography>
      <div className="filter-inputs">
        <FormControl
          margin="normal"
          fullWidth
          error={!!filterErrors?.bathrooms?.min}
        >
          <InputLabel id="min-bathrooms-label">Min</InputLabel>
          <Select
            labelId="min-bathrooms-label"
            value={filters.bathrooms.min}
            onChange={handleSelectChange("bathrooms", true)}
            label="Min"
            displayEmpty
          >
            {BATHROOM_OPTIONS.map((num: number) => (
              <MenuItem key={num} value={num}>
                {num}
              </MenuItem>
            ))}
          </Select>
          {filterErrors?.bathrooms?.min && (
            <Typography variant="caption" color="error">
              {filterErrors.bathrooms.min}
            </Typography>
          )}
        </FormControl>
        <FormControl
          margin="normal"
          fullWidth
          error={!!filterErrors?.bathrooms?.max}
        >
          <InputLabel id="max-bathrooms-label">Max</InputLabel>
          <Select
            labelId="max-bathrooms-label"
            value={filters.bathrooms.max}
            onChange={handleSelectChange("bathrooms", false)}
            label="Max"
            displayEmpty
          >
            {BATHROOM_OPTIONS.map((num: number) => (
              <MenuItem key={num} value={num}>
                {num}
              </MenuItem>
            ))}
          </Select>
          {filterErrors?.bathrooms?.max && (
            <Typography variant="caption" color="error">
              {filterErrors.bathrooms.max}
            </Typography>
          )}
        </FormControl>
      </div>
      {/* Price Filter */}
      <Typography gutterBottom className="modal-font">
        Price
      </Typography>
      <div className="filter-inputs">
        <TextField
          label="Min Price"
          value={filters.price.min}
          onChange={handleInputChange("price", "min")}
          margin="normal"
          fullWidth
          error={!!filterErrors?.price?.min}
          helperText={filterErrors?.price?.min}
        />
        <TextField
          label="Max Price"
          value={filters.price.max}
          onChange={handleInputChange("price", "max")}
          margin="normal"
          fullWidth
          error={!!filterErrors?.price?.max}
          helperText={filterErrors?.price?.max}
        />
      </div>
      <div className="modal-actions">
        <Button
          className="cancel-modal-button"
          variant="outlined"
          onClick={(): void => handleOpenCloseFilterModal(false)}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          className="apply-changes-modal-button"
          color="primary"
          onClick={(): void => handleSubmitButtonAction()}
        >
          Apply Changes
        </Button>
      </div>
    </div>
  );
};

export default ModalForm;