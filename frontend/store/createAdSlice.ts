import { AdImage } from "@/types/ad";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CreateAdState {
  step: number;

  categoryId: string;
  subCategoryId: string;
  typeId: string;

  title: string;
  description: string;
  price: string;

  cityId: string;
  areaId: string;

  images: AdImage[];
}

const initialState: CreateAdState = {
  step: 1,

  categoryId: "",
  subCategoryId: "",
  typeId: "",

  title: "",
  description: "",
  price: "",

  cityId: "",
  areaId: "",

  images: [],
};

const createAdSlice = createSlice({
  name: "createAd",
  initialState,

  reducers: {
    setStep: (state, action: PayloadAction<number>) => {
      state.step = action.payload;
    },

    setCategory: (state, action: PayloadAction<string>) => {
      state.categoryId = action.payload;

      // Reset dependent selections
      state.subCategoryId = "";
      state.typeId = "";
    },

    setSubCategory: (state, action: PayloadAction<string>) => {
      state.subCategoryId = action.payload;

      // Reset dependent selection
      state.typeId = "";
    },

    setType: (state, action: PayloadAction<string>) => {
      state.typeId = action.payload;
    },

    setAdDetails: (
      state,
      action: PayloadAction<{
        title: string;
        description: string;
        price: string;
      }>,
    ) => {
      state.title = action.payload.title;
      state.description = action.payload.description;
      state.price = action.payload.price;
    },

    setLocation: (
      state,
      action: PayloadAction<{
        cityId: string;
        areaId: string;
      }>,
    ) => {
      state.cityId = action.payload.cityId;
      state.areaId = action.payload.areaId;
    },

   setImages: (
    state,
    action: PayloadAction<AdImage[]>
) => {
    state.images = action.payload;
},

    setEditAdData: (
      state,
      action: PayloadAction<{
        categoryId: string;
        subCategoryId: string;
        typeId: string;
        title: string;
        description: string;
        price: string;
        cityId: string;
        areaId: string;
        images: AdImage[];
      }>,
    ) => {
      state.categoryId = action.payload.categoryId;
      state.subCategoryId = action.payload.subCategoryId;
      state.typeId = action.payload.typeId;
      state.title = action.payload.title;
      state.description = action.payload.description;
      state.price = action.payload.price;
      state.cityId = action.payload.cityId;
      state.areaId = action.payload.areaId;
      state.images = action.payload.images;
      state.step = 1;
    },

    resetCreateAd: () => initialState,
  },
});

export const {
  setStep,
  setCategory,
  setSubCategory,
  setType,
  setAdDetails,
  setLocation,
  setImages,
  setEditAdData,
  resetCreateAd,
} = createAdSlice.actions;

export default createAdSlice.reducer;
