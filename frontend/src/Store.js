import { createContext, useReducer } from "react";

export const Store = createContext();

const initialState = {
  cart: {
    cartItems: localStorage.getItem("carItem") ? JSON.parse(localStorage.getItem("carItem")) : [],
  },
};

const reducer = (state, action) => {
  switch (action.type) {
    case "ADD_TO_CART":
      const newItem = action.payload;
      const existingItem = state.cart.cartItems.find((item) => newItem._id === item._id);
      const cartItems = existingItem
        ? state.cart.cartItems.map((item) => (item._id === existingItem._id ? newItem : item))
        : [...state.cart.cartItems, newItem];
      localStorage.setItem("carItem", JSON.stringify(cartItems));
      return {
        ...state,
        cart: {
          ...state.cart,
          cartItems,
        },
      };

    case "REMOVE_TO_CART": {
      const cartItems = state.cart.cartItems.filter((item) => item._id !== action.payload._id);
      localStorage.setItem("carItem", JSON.stringify(cartItems));
      return {
        ...state,
        cart: {
          ...state.cart,
          cartItems,
        },
      };
    }

    case "CLEAR_TO_CART": {
      localStorage.removeItem("cartItem");
      return { ...state, cart: { ...state.cart, cartItems: [] } };
    }

    default:
      return state;
  }
};

const initialState2 = {
  wish: {
    wishItems: localStorage.getItem("wishItem") ? JSON.parse(localStorage.getItem("wishItem")) : [],
  },
};

const reducer2 = (state, action) => {
  switch (action.type) {
    case "WISH_TO_CART":
      const newItem = action.payload;
      const existingItem = state.wish.wishItems.find((item) => newItem._id === item._id);
      const wishItems = existingItem
        ? state.wish.wishItems.map((item) => (item._id === existingItem._id ? newItem : item))
        : [...state.wish.wishItems, newItem];
      localStorage.setItem("wishItem", JSON.stringify(wishItems));
      return {
        ...state,
        wish: {
          ...state.cart,
          wishItems,
        },
      };

    case "REMOVEWISH_TO_CART": {
      const wishItems = state.wish.wishItems.filter((item) => item._id !== action.payload._id);
      localStorage.setItem("wishItem", JSON.stringify(wishItems));
      return {
        ...state,
        wish: {
          ...state.wish,
          wishItems,
        },
      };
    }

    default:
      return state;
  }
};

// this is for user

const userInitialState = {
  userInfo: localStorage.getItem("userInfo") ? JSON.parse(localStorage.getItem("userInfo")) : null,
};

const userReducer = (state, action) => {
  switch (action.type) {
    case "USER_SIGN_IN":
      localStorage.setItem("userInfo", JSON.stringify(action.payload));
      return { ...state, userInfo: action.payload };

    case "USER_LOGOUT":
      localStorage.removeItem("userInfo");
      return { ...state, userInfo: null };

    default:
      return state;
  }
};

// this is for Shipping

const shippingInitialState = {
  shipping: localStorage.getItem("shipping") ? JSON.parse(localStorage.getItem("shipping")) : {},
};

const shippingReducer = (state, action) => {
  switch (action.type) {
    case "SHIPPING_ADDRESS":
      localStorage.setItem("shipping", JSON.stringify(action.payload));
      return { ...state, shipping: action.payload };

    default:
      return state;
  }
};

// this is for payment

const paymentInitialState = {
  payment: localStorage.getItem("payment") ? JSON.parse(localStorage.getItem("payment")) : "",
};

const paymentReducer = (state, action) => {
  switch (action.type) {
    case "PAYMENT_METHOD":
      localStorage.setItem("payment", JSON.stringify(action.payload));
      return { ...state, payment: action.payload };

    default:
      return state;
  }
};

export const StoreProvider = (props) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [state2, dispatch2] = useReducer(reducer2, initialState2);
  const [state3, dispatch3] = useReducer(userReducer, userInitialState);
  const [state4, dispatch4] = useReducer(shippingReducer, shippingInitialState);
  const [state5, dispatch5] = useReducer(paymentReducer, paymentInitialState);
  const value = {
    state,
    dispatch,
    state2,
    dispatch2,
    state3,
    dispatch3,
    state4,
    dispatch4,
    state5,
    dispatch5,
  };
  return <Store.Provider value={value}>{props.children}</Store.Provider>;
};
