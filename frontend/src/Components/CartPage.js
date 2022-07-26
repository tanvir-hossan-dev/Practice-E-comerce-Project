import axios from "axios";
import React, { useContext, useState } from "react";
import { Container, Row, Col, Alert, ListGroup, Button, Form } from "react-bootstrap";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate } from "react-router-dom";
import { Store } from "../Store";

const CartPage = () => {
  let navigate = useNavigate();
  const { state, dispatch } = useContext(Store);
  const [discountPrice, setDiscountPrice] = useState("");
  const [cuponCode, setCuponCode] = useState("");
  const [errCuponCode, setErrCuponCode] = useState("");

  let updateCart = (item, quantity) => {
    dispatch({ type: "ADD_TO_CART", payload: { ...item, quantity } });
  };

  let handleRemoveItem = (item) => {
    dispatch({ type: "REMOVE_TO_CART", payload: item });
  };

  let handleCheckOut = () => {
    navigate("/signin?redirect=/shipping");
  };

  let handleCupon = async () => {
    let { data } = await axios.get("http://localhost:8000/alldiscount");

    if (cuponCode !== "") {
      setCuponCode("");
      if (data.cupon === cuponCode) {
        let totalPrice = state.cart.cartItems.reduce(
          (accumulator, current) => accumulator + current.quantity * current.price,
          0
        );
        let discount = (totalPrice * data.discount) / 100;
        let discountPrice = totalPrice - discount;
        setCuponCode("");
        if (totalPrice > data.limit) {
          setDiscountPrice(discountPrice);
          setErrCuponCode("");
          setCuponCode("");
        } else {
          setErrCuponCode("Please Buy Minimum 2000");
          setCuponCode("");
        }
      } else {
        setErrCuponCode("This is Wrong CuponCode");
        setCuponCode("");
      }
    } else {
      setErrCuponCode("set your cuponcode");
      setCuponCode("");
    }
  };

  return (
    <>
      <Helmet>
        <title>CartPage</title>
      </Helmet>
      <Container>
        <h1>Shopping Cart</h1>
        <Row className="mt-5">
          <Col lg={8}>
            {state.cart.cartItems.length == 0 ? (
              <Alert variant="danger">Card is empty</Alert>
            ) : (
              <ListGroup>
                {state.cart.cartItems.map((item) => (
                  <ListGroup.Item>
                    <Row>
                      <Col lg="5">
                        <img style={{ width: "80px" }} src={item.img} alt="" />
                        <Link
                          style={{ color: "black", textDecoration: "none" }}
                          to={`/products/${item.slug}`}
                        >
                          {item.slug}
                        </Link>
                      </Col>
                      <Col lg="5">
                        <Button
                          onClick={() => updateCart(item, item.quantity + 1)}
                          disabled={item.quantity == item.stock}
                        >
                          +
                        </Button>{" "}
                        <span>{item.quantity}</span>{" "}
                        <Button
                          onClick={() => updateCart(item, item.quantity - 1)}
                          disabled={item.quantity == 1}
                        >
                          -
                        </Button>
                      </Col>
                      <Col lg="2">
                        <Button variant="danger" onClick={() => handleRemoveItem(item)}>
                          Delete
                        </Button>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            )}
          </Col>
          <Col lg={4}>
            <h4>
              Total Item : (
              {state.cart.cartItems.reduce((accumulator, current) => accumulator + current.quantity, 0)})
            </h4>
            <h4>
              Total Price :{" "}
              {discountPrice ? (
                <del>
                  {state.cart.cartItems.reduce(
                    (accumulator, current) => accumulator + current.quantity * current.price,
                    0
                  )}
                </del>
              ) : (
                <h4 style={{ display: "inline" }}>
                  {state.cart.cartItems.reduce(
                    (accumulator, current) => accumulator + current.quantity * current.price,
                    0
                  )}
                </h4>
              )}
              $
            </h4>
            {discountPrice && <h4>Discount Price : {discountPrice}$</h4>}
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div className="w-50 mt-2">
                <Form.Control
                  onChange={(e) => setCuponCode(e.target.value)}
                  type="email"
                  placeholder="Cupon Code"
                  value={cuponCode}
                />
                <p style={{ color: "red" }}>{errCuponCode}</p>
              </div>
              <Button onClick={handleCupon} className="mt-2 mb-2">
                Apply
              </Button>
            </div>
            <Button onClick={handleCheckOut} className="w-100">
              Payment
            </Button>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default CartPage;
