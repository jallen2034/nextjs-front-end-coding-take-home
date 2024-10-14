import { ChangeFilterModalCB } from "@/app/shared-components/react-mapbox/types";

interface StringFilterFieldData { min: string; max: string }

interface NumberFilterFieldData { min: number; max: number }

interface FilterData {
  squareFeet: StringFilterFieldData;
  bedrooms: NumberFilterFieldData;
  bathrooms: NumberFilterFieldData;
  price: StringFilterFieldData;
}

interface FilterDataErrors {
  squareFeet: { min: string; max: string };
  bedrooms: { min: string; max: string };
  bathrooms: { min: string; max: string };
  price: { min: string; max: string };
}

interface ValidateModalInputReturnVals {
  errors: FilterDataErrors;
  hasErrors: boolean;
}

interface FilterDataModalProps {
  handleOpenCloseFilterModal: ChangeFilterModalCB;
  openFilterModal: boolean;
  handleApplyFilters: () => any;
  handleInputChange: any;
  handleSelectChange: any;
  filters: FilterData;
  enableFilters: boolean;
  handleChangeEnableFilters: any
}

export type {
  FilterData,
  FilterDataModalProps,
  FilterDataErrors,
  ValidateModalInputReturnVals,
  StringFilterFieldData,
  NumberFilterFieldData
};
