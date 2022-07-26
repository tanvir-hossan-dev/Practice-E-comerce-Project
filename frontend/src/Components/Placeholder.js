import React, { useContext, useReducer } from "react";
import { Col, Container, Row, Card, Button, ListGroup } from "react-bootstrap";
import { Store } from "../Store";
import CheckOutStep from "./CheckOutStep";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const reducer = (state, action) => {
  switch (action.type) {
    case "CREATE-REQUEST":
      return {
        ...state,
        loading: true,
      };
    case "CREATE-SUCCESS":
      return {
        ...state,
        loading: false,
      };

    case "CREATE-FAIL":
      return {
        ...state,
        loading: false,
      };

    default:
      return state;
  }
};

const Placeholder = () => {
  let navigate = useNavigate();
  const { state, state3, state4, state5, dispatch: ctxDispatch } = useContext(Store);
  const [{ loading }, dispatch] = useReducer(reducer, { loading: false });
  let total = state.cart.cartItems.reduce(
    (accumulator, current) => accumulator + current.quantity * current.price,
    0
  );
  let taxt = total > 500 ? (total * 6) / 100 : 0;
  const handlePlaceOrder = async () => {
    try {
      let { data } = await axios.post(
        "http://localhost:8000/api/order",
        {
          orderItems: state.cart.cartItems,
          shippingAddress: state4.shipping,
          paymentMethod: state5.payment,
          productPrice: total,
          shippingPrice: 0,
          taxPrice: taxt,
          totalPrice: total + taxt,
        },
        {
          headers: {
            authorization: `Bearer ${state3.userInfo.token}`,
          },
        }
      );
      ctxDispatch({ type: "CLEAR_TO_CART" });
      dispatch({ type: "CREATE-SUCCESS" });
      navigate(`/order/${data.order._id}`);
    } catch (err) {
      dispatch({ type: "CREATE_FAIL" });
      toast.error(err);
    }
  };

  return (
    <>
      <CheckOutStep step1={true} step2={true} step3={true} step4={true} />
      <Container>
        <Row className="mt-5">
          <Col lg="8">
            <h2>Preview Order</h2>
            <Card>
              <Card.Body>
                <Card.Title>Shipping Address</Card.Title>
                <hr />
                <Card.Text>
                  <b>Name : </b> {state4.shipping.name} <br />
                  <b>PostCode : </b> {state4.shipping.postCode} <br />
                  <b>Address : </b> {state4.shipping.address} <br />
                  <b>City : </b> {state4.shipping.city} <br />
                </Card.Text>
                <Button variant="primary">Edit</Button>
              </Card.Body>
            </Card>
          </Col>
          <Col lg="4" className="mt-5">
            <Card>
              <Card.Body>
                <Card.Title>Payment Summary</Card.Title>
                <hr />
                <Card.Text>
                  <ListGroup className="mt-4">
                    <ListGroup.Item>
                      <b>Product Price : </b>${total} <br />
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <b>Delivary Charge : </b> $0 <br />
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <b>Text : </b> ${taxt} <br />
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <b>Total Price : </b> ${total + taxt} <br />
                    </ListGroup.Item>
                  </ListGroup>
                </Card.Text>
                <Button variant="primary" onClick={handlePlaceOrder}>
                  Place Order Yeap
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <Row className="mt-2">
          <Col lg="8">
            <Card>
              <Card.Body>
                <Card.Title>Payment Method</Card.Title>
                <hr />
                <Card.Text>
                  <b>Payment Method : </b> {state5.payment} <br />
                </Card.Text>
                <Button variant="primary">Edit</Button>
              </Card.Body>
            </Card>
          </Col>
          <Col lg="4"></Col>
        </Row>
        <Row className="mt-5">
          <Col lg="8">
            <Card>
              <Card.Body>
                <Card.Title>Order Item</Card.Title>
                <hr />
                <Card.Text>
                  <b>Items : </b> {state.cart.cartItems.length} <br />
                  <ListGroup className="mt-4">
                    {state.cart.cartItems.map((item) => (
                      <>
                        <ListGroup.Item>
                          <img style={{ width: "50px" }} src={item.img} className="me-3" />
                          {item.name}
                          <b className="ms-4">Quantity : </b> {item.quantity} <br />
                        </ListGroup.Item>
                      </>
                    ))}
                  </ListGroup>
                </Card.Text>
                <Button variant="primary">Edit</Button>
              </Card.Body>
            </Card>
          </Col>
          <Col lg="4"></Col>
        </Row>
      </Container>
    </>
  );
};

export default Placeholder;
