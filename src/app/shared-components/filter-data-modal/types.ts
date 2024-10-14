import { ChangeFilterModalCB } from "@/app/shared-components/react-mapbox/types";

interface FilterData {
  squareFeet: { min: string; max: string };
  bedrooms: { min: number; max: number };
  bathrooms: { min: number; max: number };
  price: { min: string; max: string };
}

interface FilterDataErrors {
  squareFeet: { min: string; max: string };
  bedrooms: { min: string; max: string };
  bathrooms: { min: string; max: string };
  price: { min: string; max: string };
}

interface ValidateModalInputReturnVals {
  errors: FilterDataErrors,
  hasErrors: boolean
}

interface FilterDataModalProps {
  handleOpenCloseFilterModal: ChangeFilterModalCB;
  openFilterModal: boolean;
  handleApplyFilters: () => any;
}

export type {
  FilterData,
  FilterDataModalProps,
  FilterDataErrors,
  ValidateModalInputReturnVals
}
