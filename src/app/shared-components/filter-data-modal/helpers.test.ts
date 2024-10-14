import {
  FilterData,
  ValidateModalInputReturnVals,
} from "@/app/shared-components/filter-data-modal/types";
import { validateModalInput } from "@/app/shared-components/filter-data-modal/helpers";

describe("validateModalInput", (): void => {
  it("should return no errors for valid input", (): void => {
    const filters: FilterData = {
      squareFeet: { min: "100", max: "550" },
      bedrooms: { min: 1, max: 3 },
      bathrooms: { min: 1, max: 2 },
      price: { min: "100000", max: "500000" },
    };

    const result: ValidateModalInputReturnVals = validateModalInput(filters);
    expect(result.errors).toEqual({
      squareFeet: { min: "", max: "" },
      bedrooms: { min: "", max: "" },
      bathrooms: { min: "", max: "" },
      price: { min: "", max: "" },
    });

    expect(result.hasErrors).toBe(false);
  });

  it("should return error for invalid square feet input", (): void => {
    const filters: FilterData = {
      squareFeet: { min: "-100", max: "0" },
      bedrooms: { min: 1, max: 3 },
      bathrooms: { min: 1, max: 2 },
      price: { min: "100000", max: "500000" },
    };

    const result: ValidateModalInputReturnVals = validateModalInput(filters);
    expect(result.errors.squareFeet).toEqual({
      min: "Min square feet cannot be negative or less than 1.",
      max: "Max square feet cannot be negative or less than 1.",
    });
    expect(result.hasErrors).toBe(true);
  });

  it("should return error if max square feet is less than min", (): void => {
    const filters: FilterData = {
      squareFeet: { min: "300", max: "200" },
      bedrooms: { min: 1, max: 3 },
      bathrooms: { min: 1, max: 2 },
      price: { min: "100000", max: "500000" },
    };

    const result: ValidateModalInputReturnVals = validateModalInput(filters);
    expect(result.errors.squareFeet.max).toBe(
      "Max square feet must be greater than Min square feet.",
    );
    expect(result.hasErrors).toBe(true);
  });

  it("should return error for invalid bedrooms input", (): void => {
    const filters: FilterData = {
      squareFeet: { min: "100", max: "500" },
      bedrooms: { min: 4, max: 2 },
      bathrooms: { min: 1, max: 2 },
      price: { min: "100000", max: "500000" },
    };

    const result: ValidateModalInputReturnVals = validateModalInput(filters);
    expect(result.errors.bedrooms.max).toBe(
      "Max bedrooms must be greater than Min bedrooms.",
    );
    expect(result.hasErrors).toBe(true);
  });

  it("should return error for invalid bathrooms input", (): void => {
    const filters: FilterData = {
      squareFeet: { min: "100", max: "500" },
      bedrooms: { min: 1, max: 3 },
      bathrooms: { min: 3, max: 2 },
      price: { min: "100000", max: "500000" },
    };

    const result: ValidateModalInputReturnVals = validateModalInput(filters);
    expect(result.errors.bathrooms.max).toBe(
      "Max bathrooms must be greater than Min bathrooms.",
    );
    expect(result.hasErrors).toBe(true);
  });

  it("should return error for invalid price input", (): void => {
    const filters: FilterData = {
      squareFeet: { min: "100", max: "500" },
      bedrooms: { min: 1, max: 3 },
      bathrooms: { min: 1, max: 2 },
      price: { min: "-1000", max: "0" },
    };

    const result: ValidateModalInputReturnVals = validateModalInput(filters);
    expect(result.errors.price).toEqual({
      min: "Min price cannot be a negative number or 0.",
      max: "Max price cannot be a negative number or 0.",
    });
    expect(result.hasErrors).toBe(true);
  });

  it("should return error if max price is less than min price", (): void => {
    const filters: FilterData = {
      squareFeet: { min: "100", max: "500" },
      bedrooms: { min: 1, max: 3 },
      bathrooms: { min: 1, max: 2 },
      price: { min: "300000", max: "200000" },
    };

    const result: ValidateModalInputReturnVals = validateModalInput(filters);
    expect(result.errors.price.max).toBe(
      "Max price must be greater than Min price.",
    );
    expect(result.hasErrors).toBe(true);
  });
});
