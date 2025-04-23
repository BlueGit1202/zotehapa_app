import _ from 'lodash';

const initialState = {
  lists: [],
  subtotal: 0,
  total: 0,
  coupon: {},
  discount: 0,
  orderType: null,
  shippingAddress: {},
  billingAddress: {},
  outletAddress: {},
  paymentMethod: {},
  totalTax: 0,
  shippingCharge: 0,
  isList: false,
};

const frontendCartReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'LIST_CHECKER':
      return {
        ...state,
        isList: state.lists.length > 0
      };
    
    case 'ADD_TO_CART':
      const { payload } = action;
      let newState = { ...state };
      
      if (newState.lists.length === 0) {
        newState.lists.push({
          name: payload.name,
          product_id: payload.product_id,
          image: payload.image,
          variation_names: payload.variation_names,
          variation_id: payload.variation_id,
          sku: payload.sku,
          stock: payload.stock,
          taxes: payload.taxes,
          shipping: payload.shipping,
          quantity: payload.quantity,
          discount: payload.discount,
          price: payload.price,
          old_price: payload.old_price,
          total_tax: 0,
          subtotal: 0,
          total: 0,
          total_price: payload.total_price
        });
      } else {
        let productMatch = false;
        
        newState.lists.forEach((list, listKey) => {
          if (list.product_id === payload.product_id && list.variation_id === payload.variation_id) {
            productMatch = true;
            if ((payload.quantity + list.quantity) <= list.stock) {
              newState.lists[listKey].quantity += payload.quantity;
            }
          }
        });
        
        if (!productMatch) {
          newState.lists.push({
            name: payload.name,
            product_id: payload.product_id,
            image: payload.image,
            variation_names: payload.variation_names,
            variation_id: payload.variation_id,
            sku: payload.sku,
            stock: payload.stock,
            taxes: payload.taxes,
            shipping: payload.shipping,
            quantity: payload.quantity,
            discount: payload.discount,
            price: payload.price,
            old_price: payload.old_price,
            total_tax: 0,
            subtotal: 0,
            total: 0,
            total_price: payload.total_price
          });
        }
      }
      
      // Recalculate taxes, shipping, subtotal
      return calculateCartTotals(newState);
    
    case 'UPDATE_QUANTITY':
      const { id, quantity } = action.payload;
      const updatedState = { ...state };
      
      if (updatedState.lists[id]) {
        updatedState.lists[id].quantity = quantity;
        updatedState.lists[id].total_price = updatedState.lists[id].price * quantity;
        
        return calculateCartTotals(updatedState);
      }
      return state;
    
    case 'REMOVE_FROM_CART':
      const removeState = { ...state };
      removeState.lists.splice(action.payload.id, 1);
      
      if (removeState.lists.length === 0) {
        return initialState;
      }
      
      return calculateCartTotals(removeState);
    
    case 'APPLY_COUPON':
      return {
        ...calculateCartTotals({
          ...state,
          coupon: action.payload,
          discount: action.payload.convert_discount || 0
        }),
        isList: state.lists.length > 0
      };
    
    case 'REMOVE_COUPON':
      return {
        ...calculateCartTotals({
          ...state,
          coupon: {},
          discount: 0
        }),
        isList: state.lists.length > 0
      };
    
    case 'UPDATE_ORDER_TYPE':
      const validTypes = ['delivery', 'pick_up'];
      const updatedOrderType = validTypes.includes(action.payload) ? action.payload : null;
      
      return calculateCartTotals({
        ...state,
        orderType: updatedOrderType
      });
    
    case 'UPDATE_SHIPPING_ADDRESS':
      return {
        ...state,
        shippingAddress: action.payload
      };
    
    case 'UPDATE_BILLING_ADDRESS':
      return {
        ...state,
        billingAddress: action.payload
      };
    
    case 'UPDATE_OUTLET_ADDRESS':
      return {
        ...state,
        outletAddress: action.payload
      };
    
    case 'UPDATE_PAYMENT_METHOD':
      return {
        ...state,
        paymentMethod: action.payload
      };
    
    case 'RESET_CART':
      return initialState;
    
    default:
      return state;
  }
};

const calculateCartTotals = (state) => {
  let subtotal = 0;
  let total = 0;
  let stateTotalTax = 0;
  
  // Calculate taxes and subtotals for each item
  const updatedLists = state.lists.map(list => {
    let itemSubtotal = list.price * list.quantity;
    let itemTotalTax = 0;
    
    if (list.taxes.length > 0) {
      itemTotalTax = list.taxes.reduce((sum, tax) => {
        if (tax.tax_rate > 0) {
          return sum + ((list.price / 100) * parseFloat(tax.tax_rate)) * list.quantity;
        }
        return sum;
      }, 0);
    }
    
    subtotal += itemSubtotal;
    stateTotalTax += itemTotalTax;
    total += (itemSubtotal + itemTotalTax) - list.discount;
    
    return {
      ...list,
      subtotal: itemSubtotal,
      total_tax: itemTotalTax,
      total: (itemSubtotal + itemTotalTax) - list.discount
    };
  });
  
  // Add shipping charge
  if (state.shippingCharge > 0) {
    total += state.shippingCharge;
  }
  
  // Apply coupon discount
  if (Object.keys(state.coupon).length > 0) {
    total -= state.coupon.convert_discount;
  }
  
  return {
    ...state,
    lists: updatedLists,
    subtotal,
    totalTax: stateTotalTax,
    total,
    isList: updatedLists.length > 0
  };
};

export default frontendCartReducer;