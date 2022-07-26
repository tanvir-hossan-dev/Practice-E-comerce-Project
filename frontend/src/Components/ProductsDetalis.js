import { useParams } from "react-router-dom";
import React, { useEffect, useReducer, useContext, useState } from "react";
import { Container, Row, Col, ListGroup, Badge, Button, Alert, Spinner, Card, Form } from "react-bootstrap";
import axios from "axios";
import Rating from "./Rating";
import InnerImageZoom from "react-inner-image-zoom";
import "react-inner-image-zoom/lib/InnerImageZoom/styles.min.css";
import { Helmet } from "react-helmet-async";
import { Store } from "../Store";
import { useNavigate, Link } from "react-router-dom";
import Slider from "react-slick";
import { BsFillArrowLeftSquareFill, BsFillArrowRightSquareFill } from "react-icons/bs";

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

const ProductsDetalis = () => {
  let params = useParams();
  let navigate = useNavigate();

  let initalState = {
    loading: false,
    error: "",
    product: {},
  };

  const [{ loading, error, product }, dispatch] = useReducer(reducer, initalState);
  let [related, setRelated] = useState([]);
  let [cuponCode, setCuponCode] = useState("");
  let [discountPrice, setdiscountPrice] = useState("");
  let [cuponError, setCuponError] = useState("");

  console.log(product);

  useEffect(async () => {
    dispatch({ type: "FETCH_REQUEST" });
    try {
      let product = await axios.get(`http://localhost:8000/products/${params.slug}`);
      let relatedProduct = await axios.get(`http://localhost:8000/products`);
      let reletedItem = relatedProduct.data.filter(
        (item) => item.catagroy == product.data.catagroy && item.name !== product.data.name
      );
      setRelated(reletedItem);
      dispatch({ type: "FETCH_SUCCESS", payload: product.data });
    } catch (error) {
      dispatch({ type: "FETCH_FAILS", payload: error });
    }
  }, [params.slug]);

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart } = state;

  let addToCart = async () => {
    const existingItem = cart.cartItems.find((item) => item._id === product._id);
    const quantity = existingItem ? existingItem.quantity + 1 : 1;
    const { data } = await axios.get(`http://localhost:8000/cartproduct/${product._id}`);
    if (data.stock < quantity) {
      window.alert(`${product.name} out of stock`);
      return;
    }
    ctxDispatch({
      type: "ADD_TO_CART",
      payload: { ...product, price: discountPrice ? discountPrice : product.price, quantity: quantity },
    });
    navigate(`/cartpage`);
  };

  var settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    prevArrow: <BsFillArrowLeftSquareFill />,
    nextArrow: <BsFillArrowRightSquareFill />,
  };

  let handleCupon = () => {
    if (cuponCode !== "") {
      if (product.cupon === cuponCode) {
        let discount = (product.price * product.discount) / 100;
        let afterDiscount = product.price - discount;
        if (afterDiscount > product.discountLimit) {
          setdiscountPrice(afterDiscount);
          setCuponError("");
        } else {
          setCuponError("Discount not available for this price. minimum 200");
        }
      } else {
        setCuponError("This is Wrong CuponCode");
      }
    } else {
      setCuponError("Enter Your CuponCode");
    }
  };

  return (
    <>
      <Helmet>
        <title>Product Details</title>
      </Helmet>
      <Container>
        <Row>
          {loading ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100vh",
              }}
            >
              <Spinner animation="border" />
            </div>
          ) : product ? (
            <>
              <Col lg={6}>
                <div style={{ width: "400px", height: "400px" }}>
                  {product.img && <InnerImageZoom src={product.img} zoomScale={0.18} />}
                </div>
              </Col>
              <Col lg={3}>
                <ListGroup>
                  <ListGroup.Item>{product.name}</ListGroup.Item>
                  <ListGroup.Item>
                    <h5>{product.price} $</h5>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Rating rating={product.rating} numberofrating={product.numberofrating} />
                  </ListGroup.Item>
                  <ListGroup.Item>
                    Stock{" "}
                    {product.stock > 0 ? (
                      <Badge bg="primary">{product.stock}</Badge>
                    ) : (
                      <Badge bg="danger">{product.stock}</Badge>
                    )}
                  </ListGroup.Item>
                  <ListGroup.Item>{product.description}</ListGroup.Item>
                </ListGroup>
              </Col>
              <Col lg={3}>
                <ListGroup variant="flush">
                  <ListGroup.Item>
                    <h5>
                      {discountPrice ? (
                        <del>Price : {product.price} $</del>
                      ) : (
                        <h5>Price : {product.price} $</h5>
                      )}
                    </h5>
                    <h5>{discountPrice && <h5>Discount Price : {discountPrice}</h5>}</h5>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Form.Control
                      style={{ display: "inline" }}
                      onChange={(e) => setCuponCode(e.target.value)}
                      className="w-50"
                      type="email"
                      placeholder="Cupon Code"
                    />
                    <Button style={{ display: "inline" }} onClick={handleCupon}>
                      Apply
                    </Button>{" "}
                    <br />
                    <p style={{ color: "red" }}> {cuponError} </p>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Button onClick={addToCart} varient="primary">
                      Add To Cart
                    </Button>
                  </ListGroup.Item>
                </ListGroup>
              </Col>
            </>
          ) : (
            <Alert style={{ textAlign: "center" }} variant="danger">
              <h6>Product not found</h6>
            </Alert>
          )}
        </Row>
        {/*  */}
        <Row>
          <h2>Releted Products</h2>

          {related.length > 0 ? (
            <Slider {...settings}>
              {related.map((item) => (
                <Col>
                  <Card style={{ width: "18rem", marginTop: "10px" }}>
                    <Link style={{ color: "black", textDecoration: "none" }} to={`/products/${item.slug}`}>
                      <Card.Img variant="top" style={{ height: "100%" }} src={item.img} />
                    </Link>
                    <Card.Body>
                      <Card.Title>{item.name} </Card.Title>
                      <Card.Title>Catagory : {item.catagroy} </Card.Title>
                      <Card.Title>{item.price} $</Card.Title>
                      <Rating rating={item.rating} numberofrating={item.numberofrating} />
                      <Card.Text>{item.description}</Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Slider>
          ) : (
            <Alert variant="danger">Releted product not found</Alert>
          )}
        </Row>
      </Container>
    </>
  );
};

export default ProductsDetalis;
