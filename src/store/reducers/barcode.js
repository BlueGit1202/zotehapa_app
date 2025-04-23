const initialState = { lists: [], pagination: {} };

export const barcodeReducer = (state = initialState, action) => {
  switch (action.type) {
    case "BARCODE_SET_LIST":
      return {
        ...state,
        lists: action.payload.data,
        pagination: action.payload.meta
      };
    default:
      return state;
  }
};
