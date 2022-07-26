import React from "react";
import { Col, Container, Row } from "react-bootstrap";

const CheckOutStep = (props) => {
  return (
    <Container className="step mt-3">
      <Row>
        <Col lg="3">
          <h3 className={props.step1 ? "stepactive" : ""}>SignIn</h3>
        </Col>
        <Col lg="3">
          <h3 className={props.step2 ? "stepactive" : ""}>Shipping Address</h3>
        </Col>
        <Col lg="3">
          <h3 className={props.step3 ? "stepactive" : ""}>Payment</h3>
        </Col>
        <Col lg="3">
          <h3 className={props.step4 ? "stepactive" : ""}>Placeorder</h3>
        </Col>
      </Row>
    </Container>
  );
};

export default CheckOutStep;
