import React, { useContext, useEffect, useReducer, useState } from "react";
import { Container, Row, Col, Card, Button, Spinner, Modal, Badge } from "react-bootstrap";
import axios from "axios";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Rating from "./Rating";
import { Store } from "../Store";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return {
        ...state,
        loading: true,
      };

    case "FETCH_SUCCESS":
      return {
        ...state,
        loading: false,
        product: action.payload,
      };
    case "FETCH_FAILS":
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
  }
};

const Product = () => {
  const [show, setShow] = useState(false);
  const [deatils, setDeatils] = useState({});

  const handleClose = () => setShow(false);

  let initalState = {
    loading: false,
    error: "",
    product: [],
  };

  const [{ loading, error, product }, dispatch] = useReducer(reducer, initalState);

  useEffect(async () => {
    dispatch({ type: "FETCH_REQUEST" });
    try {
      let product = await axios.get("http://localhost:8000/products");
      dispatch({ type: "FETCH_SUCCESS", payload: product.data });
    } catch (error) {
      dispatch({ type: "FETCH_FAILS", payload: error });
    }
  }, []);

  const { state, dispatch: ctxDispatch, state2, dispatch2 } = useContext(Store);

  let addToCart = async (product) => {
    const existingItem = state.cart.cartItems.find((item) => item._id === product._id);
    const quantity = existingItem ? existingItem.quantity + 1 : 1;
    const { data } = await axios.get(`http://localhost:8000/cartproduct/${product._id}`);
    if (data.stock < quantity) {
      window.alert(`${product.name} out of stock`);
      return;
    }
    ctxDispatch({ type: "ADD_TO_CART", payload: { ...product, quantity: quantity } });
  };

  let updateCart = (item, quantity) => {
    ctxDispatch({ type: "ADD_TO_CART", payload: { ...item, quantity } });
  };

  let handleRemoveItem = (item) => {
    ctxDispatch({ type: "REMOVE_TO_CART", payload: item });
  };

  let handleDeatils = async (product) => {
    const { data } = await axios.get(`http://localhost:8000/cartproduct/${product._id}`);
    setDeatils(data);
    setShow(true);
  };

  let addToWishlist = (product) => {
    dispatch2({ type: "WISH_TO_CART", payload: { ...product } });
  };

  return (
    <>
      <Helmet>
        <title>Product</title>
      </Helmet>
      <Container>
        <Modal show={show} onHide={handleClose} animation={false}>
          <Modal.Header closeButton></Modal.Header>
          <Modal.Body>
            <Card>
              <Row>
                <Col lg="6">
                  <Card.Img variant="top" src={deatils.img} />
                </Col>
                <Col lg="6">
                  <Card.Body>
                    <Card.Title>{deatils.name}</Card.Title>
                    <Card.Text>{deatils.description}</Card.Text>
                  </Card.Body>
                </Col>
              </Row>
            </Card>
          </Modal.Body>
          <Modal.Footer>
            <Button className="ms" variant="primary" onClick={() => addToCart(deatils)}>
              Add To Cart
            </Button>
          </Modal.Footer>
        </Modal>

        <Row>
          {loading ? (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
              <Spinner animation="border" />
            </div>
          ) : (
            product.map((item) => (
              <Col lg="3">
                <Card style={{ width: "18rem", marginTop: "10px" }}>
                  <Link style={{ color: "black", textDecoration: "none" }} to={`/products/${item.slug}`}>
                    <Card.Img variant="top" style={{ height: "100%" }} src={item.img} />
                  </Link>
                  <Card.Body>
                    <Card.Title>{item.name} </Card.Title>
                    <Card.Title>Catagory : {item.catagroy} </Card.Title>
                    <Card.Title>{item.price} $</Card.Title>
                    <Card.Title>
                      {item.totalSale > 80 && (
                        <Badge bg="warning" text="light">
                          Best Saller
                        </Badge>
                      )}{" "}
                    </Card.Title>
                    <Rating rating={item.rating} numberofrating={item.numberofrating} />
                    <Card.Text>{item.description}</Card.Text>

                    <div>
                      {state.cart.cartItems.map((items) =>
                        items._id == item._id ? (
                          <>
                            <Button
                              className="m-1"
                              onClick={() => updateCart(items, items.quantity + 1)}
                              disabled={items.quantity == items.stock}
                            >
                              +
                            </Button>{" "}
                            <span>{items.quantity}</span>{" "}
                            <Button
                              onClick={() => updateCart(items, items.quantity - 1)}
                              disabled={items.quantity == 1}
                            >
                              -
                            </Button>
                            <Button className="m-1" variant="danger" onClick={() => handleRemoveItem(items)}>
                              Delete
                            </Button>
                          </>
                        ) : (
                          ""
                        )
                      )}
                    </div>
                    {item.stock == 0 ? (
                      <>
                        {" "}
                        <Button onClick={() => addToCart(item)} variant="danger">
                          Out of Stock
                        </Button>
                        <Button
                          style={{ marginLeft: "5px" }}
                          variant="primary"
                          onClick={() => handleDeatils(item)}
                        >
                          Details
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button onClick={() => addToCart(item)} variant="primary">
                          Add To Cart
                        </Button>
                        <Button
                          style={{ marginLeft: "5px" }}
                          variant="primary"
                          onClick={() => handleDeatils(item)}
                        >
                          Details
                        </Button>
                      </>
                    )}
                    <Button style={{ marginLeft: "5px" }} onClick={() => addToWishlist(item)}>
                      Wish
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))
          )}
        </Row>
      </Container>
    </>
  );
};

export default Product;
