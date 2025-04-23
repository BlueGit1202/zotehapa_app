import axios from "axios";

// Product Actions
export const fetchProducts = (searchParams) => async (dispatch) => {
  try {
    dispatch({ type: 'FETCH_PRODUCTS_REQUEST' });
    
    const { data } = await axios.get('/pos/products', { params: searchParams });
    
    dispatch({
      type: 'FETCH_PRODUCTS_SUCCESS',
      payload: data.data
    });
  } catch (error) {
    dispatch({
      type: 'FETCH_PRODUCTS_FAILURE',
      payload: error.response?.data?.message || error.message
    });
  }
};

export const fetchCategories = () => async (dispatch) => {
  try {
    dispatch({ type: 'FETCH_CATEGORIES_REQUEST' });
    
    const { data } = await axios.get('/pos/categories');
    
    dispatch({
      type: 'FETCH_CATEGORIES_SUCCESS',
      payload: data.data
    });
  } catch (error) {
    dispatch({
      type: 'FETCH_CATEGORIES_FAILURE',
      payload: error.response?.data?.message || error.message
    });
  }
};

export const fetchBrands = () => async (dispatch) => {
  try {
    dispatch({ type: 'FETCH_BRANDS_REQUEST' });
    
    const { data } = await axios.get('/pos/brands');
    
    dispatch({
      type: 'FETCH_BRANDS_SUCCESS',
      payload: data.data
    });
  } catch (error) {
    dispatch({
      type: 'FETCH_BRANDS_FAILURE',
      payload: error.response?.data?.message || error.message
    });
  }
};

export const fetchCustomers = () => async (dispatch) => {
  try {
    dispatch({ type: 'FETCH_CUSTOMERS_REQUEST' });
    
    const { data } = await axios.get('/pos/customers');
    
    dispatch({
      type: 'FETCH_CUSTOMERS_SUCCESS',
      payload: data.data
    });
  } catch (error) {
    dispatch({
      type: 'FETCH_CUSTOMERS_FAILURE',
      payload: error.response?.data?.message || error.message
    });
  }
};

// Cart Actions
export const addToCart = (product) => (dispatch, getState) => {
  dispatch({
    type: 'ADD_TO_CART',
    payload: product
  });
  
  // Recalculate totals
  const { items } = getState().posCart;
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const totalTax = items.reduce((sum, item) => {
    if (item.taxes && item.taxes.length > 0) {
      const itemTax = item.taxes.reduce((taxSum, tax) => taxSum + (item.price * tax.percent / 100), 0);
      return sum + (itemTax * item.quantity);
    }
    return sum;
  }, 0);
  
  dispatch({
    type: 'UPDATE_TOTALS',
    payload: { subtotal, totalTax }
  });
};

export const updateCartQuantity = ({ index, quantity }) => (dispatch, getState) => {
  dispatch({
    type: 'UPDATE_CART_QUANTITY',
    payload: { index, quantity }
  });
  
  // Recalculate totals
  const { items } = getState().posCart;
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const totalTax = items.reduce((sum, item) => {
    if (item.taxes && item.taxes.length > 0) {
      const itemTax = item.taxes.reduce((taxSum, tax) => taxSum + (item.price * tax.percent / 100), 0);
      return sum + (itemTax * item.quantity);
    }
    return sum;
  }, 0);
  
  dispatch({
    type: 'UPDATE_TOTALS',
    payload: { subtotal, totalTax }
  });
};

export const incrementQuantity = (index) => (dispatch, getState) => {
  dispatch({
    type: 'INCREMENT_QUANTITY',
    payload: index
  });
  
  // Recalculate totals
  const { items } = getState().posCart;
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const totalTax = items.reduce((sum, item) => {
    if (item.taxes && item.taxes.length > 0) {
      const itemTax = item.taxes.reduce((taxSum, tax) => taxSum + (item.price * tax.percent / 100), 0);
      return sum + (itemTax * item.quantity);
    }
    return sum;
  }, 0);
  
  dispatch({
    type: 'UPDATE_TOTALS',
    payload: { subtotal, totalTax }
  });
};

export const decrementQuantity = (index) => (dispatch, getState) => {
  dispatch({
    type: 'DECREMENT_QUANTITY',
    payload: index
  });
  
  // Recalculate totals
  const { items } = getState().posCart;
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const totalTax = items.reduce((sum, item) => {
    if (item.taxes && item.taxes.length > 0) {
      const itemTax = item.taxes.reduce((taxSum, tax) => taxSum + (item.price * tax.percent / 100), 0);
      return sum + (itemTax * item.quantity);
    }
    return sum;
  }, 0);
  
  dispatch({
    type: 'UPDATE_TOTALS',
    payload: { subtotal, totalTax }
  });
};

export const removeFromCart = (index) => (dispatch, getState) => {
  dispatch({
    type: 'REMOVE_FROM_CART',
    payload: index
  });
  
  // Recalculate totals
  const { items } = getState().posCart;
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const totalTax = items.reduce((sum, item) => {
    if (item.taxes && item.taxes.length > 0) {
      const itemTax = item.taxes.reduce((taxSum, tax) => taxSum + (item.price * tax.percent / 100), 0);
      return sum + (itemTax * item.quantity);
    }
    return sum;
  }, 0);
  
  dispatch({
    type: 'UPDATE_TOTALS',
    payload: { subtotal, totalTax }
  });
};

export const applyDiscount = (discount) => (dispatch) => {
  dispatch({
    type: 'APPLY_DISCOUNT',
    payload: discount
  });
};

export const resetCart = () => (dispatch) => {
  dispatch({ type: 'RESET_CART' });
};

// Order Actions
export const createOrder = (orderData) => async (dispatch) => {
  try {
    dispatch({ type: 'CREATE_ORDER_REQUEST' });
    
    const { data } = await axios.post('/pos/orders', orderData);
    
    dispatch({
      type: 'CREATE_ORDER_SUCCESS',
      payload: data.data
    });
    
    return data.data;
  } catch (error) {
    dispatch({
      type: 'CREATE_ORDER_FAILURE',
      payload: error.response?.data?.message || error.message
    });
    throw error;
  }
};