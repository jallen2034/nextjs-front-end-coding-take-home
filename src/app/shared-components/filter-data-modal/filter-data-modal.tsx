import React, { ChangeEvent, useState } from "react";
import { Box, Modal, Switch } from "@mui/material";
import {
  FilterDataModalProps,
  ValidateModalInputReturnVals,
} from "@/app/shared-components/filter-data-modal/types";
import { validateModalInput } from "@/app/shared-components/filter-data-modal/helpers";
import ModalForm from "@/app/shared-components/modal-form/modal-form";
import Typography from "@mui/material/Typography";
import "./filter-data-modal.scss";

export const FilterDataModal = ({
  handleOpenCloseFilterModal,
  openFilterModal,
  handleApplyFilters,
  handleInputChange,
  handleSelectChange,
  filters,
  enableFilters,
  handleChangeEnableFilters,
}: FilterDataModalProps) => {
  // Will store any validation error messages that validateModalInput has on form submission.
  const [filterErrors, setFilterErrors] = useState<any>(null);

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
        onClose={(): void => handleOpenCloseFilterModal(false)}
      >
        <Box className="modal-container">
          <Typography
            id="modal-modal-title"
            className="header-text-modal-toggle"
            variant="h6"
            component="h2"
          >
            Enable Filters:
          </Typography>
          <Switch
            checked={enableFilters}
            onChange={(event: ChangeEvent<HTMLInputElement>): any =>
              handleChangeEnableFilters(event)
            }
          />
          {enableFilters && (
            <ModalForm
              handleOpenCloseFilterModal={handleOpenCloseFilterModal}
              handleInputChange={handleInputChange}
              handleSelectChange={handleSelectChange}
              filters={filters}
              filterErrors={filterErrors}
              handleSubmitButtonAction={handleSubmitButtonAction}
            />
          )}
        </Box>
      </Modal>
    </div>
  );
};
