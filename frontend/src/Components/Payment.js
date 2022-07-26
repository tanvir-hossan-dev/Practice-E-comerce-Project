import React, { useContext, useState } from "react";
import { Container, Alert, Form, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { Store } from "../Store";
import CheckOutStep from "./CheckOutStep";

const Payment = () => {
  let navigate = useNavigate();
  const { state5, dispatch5 } = useContext(Store);
  const [payment, setPayment] = useState(state5.payment ? state5.payment : "");

  let handleSubmit = (e) => {
    dispatch5({ type: "PAYMENT_METHOD", payload: payment });
    navigate("/placeholder");
  };
  return (
    <>
      <CheckOutStep step1={true} step2={true} step3={true} />
      <Container className="w-50 border mt-5 p-3">
        <Link to="/shipping">Go to shipping page</Link>
        <Alert className="text-center">
          <h5>Payment</h5>
        </Alert>
        <Form onSubmit={handleSubmit}>
          <Form.Check
            type="radio"
            label="PayPal"
            id="paypal"
            value="PayPal"
            onChange={(e) => setPayment(e.target.value)}
            checked={"PayPal" === payment}
          />
          <Form.Check
            type="radio"
            label="Strip"
            id="strip"
            value="Strip"
            onChange={(e) => setPayment(e.target.value)}
            checked={"Strip" === payment}
          />
          <Form.Check
            type="radio"
            label="Nagod"
            id="nagod"
            value="nagod"
            onChange={(e) => setPayment(e.target.value)}
            checked={"nagod" === payment}
          />

          <Button variant="primary" type="submit" className="mt-3">
            Submit
          </Button>
        </Form>
      </Container>
    </>
  );
};

export default Payment;
