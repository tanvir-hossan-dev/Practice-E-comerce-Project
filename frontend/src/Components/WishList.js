import React, { useContext } from "react";
import { Container, Row, Col, Alert, ListGroup, Button } from "react-bootstrap";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate } from "react-router-dom";
import { Store } from "../Store";
const WishList = () => {
  const { state2, dispatch2 } = useContext(Store);
  let handleRemoveItem = (item) => {
    dispatch2({ type: "REMOVEWISH_TO_CART", payload: item });
  };
  console.log(state2);
  return (
    <>
      <Helmet>
        <title>Wishlist Page</title>
      </Helmet>
      <Container>
        <h1>Shopping Cart</h1>
        <Row className="mt-5">
          <Col lg={8}>
            {state2.wish.wishItems.length == 0 ? (
              <Alert variant="danger">You have no wishlist</Alert>
            ) : (
              <ListGroup>
                {state2.wish.wishItems.map((item) => (
                  <ListGroup.Item>
                    <Row>
                      <Col lg="5">
                        <img style={{ width: "80px" }} src={item.img} alt="" />
                        <Link style={{ color: "black", textDecoration: "none" }} to={`/products/${item.slug}`}>
                          {item.slug}
                        </Link>
                      </Col>
                      <Col lg="5">
                        <h5>Price : {item.price} $</h5>
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
        </Row>
      </Container>
    </>
  );
};

export default WishList;
