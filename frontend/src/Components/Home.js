import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { Modal, Button, Container, ListGroup, Row, Col, Card, Badge } from "react-bootstrap";
import { Link } from "react-router-dom";
import { Store } from "../Store";
import Rating from "./Rating";

export const Home = () => {
  const [show, setShow] = useState(false);
  const [discountProduct, setDiscountProduct] = useState({});
  const [products, setProducts] = useState([]);
  const [cataProduct, setCataProduct] = useState([]);
  const { state, dispatch } = useContext(Store);

  const handleClose = () => setShow(false);

  useEffect(async () => {
    let findItem = [];
    let { data } = await axios.get("http://localhost:8000/alldiscount");
    let product = await axios.get("http://localhost:8000/products");
    product.data.map((item) => {
      if (findItem.indexOf(item.catagroy) == -1) {
        findItem.push(item.catagroy);
      }
    });

    setProducts(findItem);
    setDiscountProduct(data);
    setShow(true);
  }, []);

  let handleCatagory = async (catagory) => {
    let { data } = await axios.get(`http://localhost:8000/catagory/${catagory}`);
    setCataProduct(data);
  };

  let addToCart = (product) => {
    let existingItem = state.cart.cartItems.find((item) => item._id == cataProduct._id);
    let quantity = existingItem ? quantity + 1 : 1;
    dispatch({ type: "ADD_TO_CART", payload: { ...product, quantity } });
  };

  return (
    <>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton></Modal.Header>
        <img src={discountProduct.img} alt="" />
      </Modal>
      <div className="banner">
        <Container>
          <Row>
            <Col lg="3">
              <ListGroup>
                {products.map((item) => (
                  <ListGroup.Item onClick={() => handleCatagory(item)} style={{ cursor: "pointer" }}>
                    {item}{" "}
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Col>
          </Row>
          <Row style={{ marginTop: "350px" }}>
            {cataProduct.map((item) => (
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

                    {/* <div>
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
                  </div> */}
                    {/* {item.stock == 0 ? (
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
                  )} */}
                    <Button onClick={() => addToCart(item)} variant="primary">
                      Add To Cart
                    </Button>
                    {/* <Button style={{ marginLeft: "5px" }} onClick={() => addToWishlist(item)}>
                    Wish
                  </Button> */}
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
        <Container></Container>
      </div>
    </>
  );
};
