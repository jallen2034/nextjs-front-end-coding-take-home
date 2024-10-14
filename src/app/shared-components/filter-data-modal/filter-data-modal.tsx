import React, { useState } from "react";
import {
  Box,
  Button,
  Modal,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  SelectChangeEvent,
} from "@mui/material";
import Typography from "@mui/material/Typography";
import {
  FilterData,
  FilterDataModalProps,
  ValidateModalInputReturnVals,
} from "@/app/shared-components/filter-data-modal/types";
import { validateModalInput } from "@/app/shared-components/filter-data-modal/helpers";
import { BATHROOM_OPTIONS, BEDROOM_OPTIONS, MAX_SQUARE_FEET } from "@/app/shared-components/filter-data-modal/contants";
import "./filter-data-modal.scss";

export const FilterDataModal = ({
  handleOpenCloseFilterModal,
  openFilterModal,
  handleApplyFilters,
}: FilterDataModalProps) => {
  // Sta eto keep track fo the current filters set in the modal.
  const [filters, setFilters] = useState<FilterData>({
    squareFeet: { min: "0", max: MAX_SQUARE_FEET.toString() },
    bedrooms: { min: 0, max: 0 },
    bathrooms: { min: 1, max: 1 },
    price: { min: "50000", max: "5000000" },
  });

  // Will store any validation error messages that validateModalInput has on form submission.
  const [filterErrors, setFilterErrors] = useState<any>(null);

  const handleInputChange =
    (key: keyof FilterData) =>
    (event: React.ChangeEvent<HTMLInputElement>): void => {
      const value: string = event.target.value;
      setFilters({ ...filters, [key]: { ...filters[key], min: value } });
    };

  const handleMaxInputChange =
    (key: keyof FilterData) =>
    (event: React.ChangeEvent<HTMLInputElement>): void => {
      const value: string = event.target.value;
      setFilters({ ...filters, [key]: { ...filters[key], max: value } });
    };

  const handleSelectChange =
    (key: keyof FilterData, isMin: boolean) =>
    (event: SelectChangeEvent<number>): void => {
      const value = event.target.value as number;
      setFilters({
        ...filters,
        [key]: { ...filters[key], [isMin ? "min" : "max"]: value },
      });
    };

  const handleSubmitButtonAction = (): void => {
    const { errors, hasErrors }: ValidateModalInputReturnVals =
      validateModalInput(filters);

    // Validate error messages in the modal on submit.
    if (hasErrors) {
      setFilterErrors(errors);
    } else {
      handleApplyFilters();
      setFilterErrors(null); // Clear errors if submission is successful
    }
  };

  return (
    <div>
      <Modal
        open={openFilterModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box className="modal-container">
          <Typography
            id="modal-modal-title"
            className="header-text-modal"
            variant="h6"
            component="h2"
          >
            Property Filters:
          </Typography>
          {/* Square Feet Filter */}
          <Typography variant="body1" className="modal-font">
            Square Feet
          </Typography>
          <div className="filter-inputs">
            <TextField
              label="Min Square Feet"
              value={filters.squareFeet.min}
              onChange={handleInputChange("squareFeet")}
              margin="normal"
              fullWidth
              error={!!filterErrors?.squareFeet?.min} // Show error if exists.
              helperText={filterErrors?.squareFeet?.min} // Display error message.
            />
            <TextField
              label="Max Square Feet"
              value={filters.squareFeet.max}
              onChange={handleMaxInputChange("squareFeet")}
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
              onChange={handleInputChange("price")}
              margin="normal"
              fullWidth
              error={!!filterErrors?.price?.min}
              helperText={filterErrors?.price?.min}
            />
            <TextField
              label="Max Price"
              value={filters.price.max}
              onChange={handleMaxInputChange("price")}
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
        </Box>
      </Modal>
    </div>
  );
};
