import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import "bootstrap/dist/css/bootstrap.min.css";
import { HelmetProvider } from "react-helmet-async";
import { StoreProvider } from "./Store";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";

ReactDOM.render(
  <StoreProvider>
    <HelmetProvider>
      <PayPalScriptProvider deferLoading={true}>
        <App />
      </PayPalScriptProvider>
    </HelmetProvider>
  </StoreProvider>,
  document.getElementById("root")
);
