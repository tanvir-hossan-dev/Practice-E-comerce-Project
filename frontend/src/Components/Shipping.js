import React, { useContext, useState, useEffect } from "react";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { Store } from "../Store";
import CheckOutStep from "./CheckOutStep";

const Shipping = () => {
  let navigate = useNavigate();
  const { state4, dispatch4 } = useContext(Store);
  const { state3, dispatch3 } = useContext(Store);
  const { userInfo } = state3;
  const [name, setName] = useState(state4.shipping.name || "");
  const [address, setAddress] = useState(state4.shipping.address || "");
  const [postCode, setPostCode] = useState(state4.shipping.postCode || "");
  const [city, setCity] = useState(state4.shipping.city || "");

  useEffect(() => {
    if (!userInfo) {
      console.log("ami nai");
      navigate("/signin?redirect=/shipping");
    }
  }, []);

  let handleSubmit = (e) => {
    e.preventDefault();
    dispatch4({ type: "SHIPPING_ADDRESS", payload: { name, address, postCode, city } });
    navigate("/payment");
  };

  return (
    <>
      <CheckOutStep step1={true} step2={true} />
      <Container className="w-25 border mt-5 p-3" style={{ borderRadius: "5px" }}>
        <Helmet>
          <title>Shipping</title>
        </Helmet>

        <Row>
          <Col>
            <h1>Shipping</h1>
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>Full Name</Form.Label>
                <Form.Control
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  type="text"
                  placeholder="Full Name"
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>Address</Form.Label>
                <Form.Control
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  type="text"
                  placeholder="Address"
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>Post Code</Form.Label>
                <Form.Control
                  value={postCode}
                  onChange={(e) => setPostCode(e.target.value)}
                  type="number"
                  placeholder="Post Code"
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>City</Form.Label>
                <Form.Control
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  type="text"
                  placeholder="City"
                />
              </Form.Group>
              <Button variant="primary" type="submit" onClick={handleSubmit}>
                Submit
              </Button>
            </Form>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Shipping;
