// Initial state
const initialState = {
  products: [],
  categories: [],
  brands: [],
  customers: [],
  loading: false,
  error: null
};

export const posProductReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'FETCH_PRODUCTS_REQUEST':
    case 'FETCH_CATEGORIES_REQUEST':
    case 'FETCH_BRANDS_REQUEST':
    case 'FETCH_CUSTOMERS_REQUEST':
      return { ...state, loading: true, error: null };

    case 'FETCH_PRODUCTS_SUCCESS':
      return { ...state, loading: false, products: action.payload };
    
    case 'FETCH_CATEGORIES_SUCCESS':
      return { ...state, loading: false, categories: action.payload };
    
    case 'FETCH_BRANDS_SUCCESS':
      return { ...state, loading: false, brands: action.payload };
    
    case 'FETCH_CUSTOMERS_SUCCESS':
      return { ...state, loading: false, customers: action.payload };

    case 'FETCH_PRODUCTS_FAILURE':
    case 'FETCH_CATEGORIES_FAILURE':
    case 'FETCH_BRANDS_FAILURE':
    case 'FETCH_CUSTOMERS_FAILURE':
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};

// Cart reducer
const initialCartState = {
  items: [],
  subtotal: 0,
  totalTax: 0,
  discount: 0,
  loading: false,
  error: null
};

export const posCartReducer = (state = initialCartState, action) => {
  switch (action.type) {
    case 'ADD_TO_CART':
      // Check if item already exists in cart
      const existingIndex = state.items.findIndex(
        item => item.product_id === action.payload.product_id && 
               item.variation_id === action.payload.variation_id
      );

      if (existingIndex >= 0) {
        // Update quantity if exists
        const updatedItems = [...state.items];
        updatedItems[existingIndex].quantity += action.payload.quantity || 1;
        
        return { 
          ...state, 
          items: updatedItems,
          subtotal: updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0),
          totalTax: updatedItems.reduce((sum, item) => {
            if (item.taxes && item.taxes.length > 0) {
              const itemTax = item.taxes.reduce((taxSum, tax) => taxSum + (item.price * tax.percent / 100), 0);
              return sum + (itemTax * item.quantity);
            }
            return sum;
          }, 0)
        };
      } else {
        // Add new item
        const newItem = {
          ...action.payload,
          quantity: action.payload.quantity || 1
        };
        
        return { 
          ...state, 
          items: [...state.items, newItem],
          subtotal: state.subtotal + (newItem.price * newItem.quantity),
          totalTax: state.totalTax + (newItem.taxes?.reduce((sum, tax) => sum + (newItem.price * tax.percent / 100), 0) * newItem.quantity || 0)
        };
      }

    case 'UPDATE_CART_QUANTITY':
      const updatedItems = state.items.map((item, index) => 
        index === action.payload.index ? { ...item, quantity: action.payload.quantity } : item
      );
      
      return {
        ...state,
        items: updatedItems,
        subtotal: updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        totalTax: updatedItems.reduce((sum, item) => {
          if (item.taxes && item.taxes.length > 0) {
            const itemTax = item.taxes.reduce((taxSum, tax) => taxSum + (item.price * tax.percent / 100), 0);
            return sum + (itemTax * item.quantity);
          }
          return sum;
        }, 0)
      };

    case 'INCREMENT_QUANTITY':
      const incrementedItems = state.items.map((item, index) => 
        index === action.payload ? { ...item, quantity: item.quantity + 1 } : item
      );
      
      return {
        ...state,
        items: incrementedItems,
        subtotal: incrementedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        totalTax: incrementedItems.reduce((sum, item) => {
          if (item.taxes && item.taxes.length > 0) {
            const itemTax = item.taxes.reduce((taxSum, tax) => taxSum + (item.price * tax.percent / 100), 0);
            return sum + (itemTax * item.quantity);
          }
          return sum;
        }, 0)
      };

    case 'DECREMENT_QUANTITY':
      const decrementedItems = state.items.map((item, index) => 
        index === action.payload ? { ...item, quantity: Math.max(1, item.quantity - 1) } : item
      );
      
      return {
        ...state,
        items: decrementedItems,
        subtotal: decrementedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        totalTax: decrementedItems.reduce((sum, item) => {
          if (item.taxes && item.taxes.length > 0) {
            const itemTax = item.taxes.reduce((taxSum, tax) => taxSum + (item.price * tax.percent / 100), 0);
            return sum + (itemTax * item.quantity);
          }
          return sum;
        }, 0)
      };

    case 'REMOVE_FROM_CART':
      const filteredItems = state.items.filter((_, index) => index !== action.payload);
      
      return {
        ...state,
        items: filteredItems,
        subtotal: filteredItems.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        totalTax: filteredItems.reduce((sum, item) => {
          if (item.taxes && item.taxes.length > 0) {
            const itemTax = item.taxes.reduce((taxSum, tax) => taxSum + (item.price * tax.percent / 100), 0);
            return sum + (itemTax * item.quantity);
          }
          return sum;
        }, 0)
      };

    case 'APPLY_DISCOUNT':
      return {
        ...state,
        discount: parseFloat(action.payload)
      };

    case 'RESET_CART':
      return initialCartState;

    case 'UPDATE_TOTALS':
      return {
        ...state,
        subtotal: action.payload.subtotal,
        totalTax: action.payload.totalTax
      };

    default:
      return state;
  }
};

// Order reducer
const initialOrderState = {
  loading: false,
  order: null,
  error: null
};

export const posOrderReducer = (state = initialOrderState, action) => {
  switch (action.type) {
    case 'CREATE_ORDER_REQUEST':
      return { ...state, loading: true, error: null };
    
    case 'CREATE_ORDER_SUCCESS':
      return { ...state, loading: false, order: action.payload };
    
    case 'CREATE_ORDER_FAILURE':
      return { ...state, loading: false, error: action.payload };
    
    default:
      return state;
  }
};