import axios from "axios";
import React, { useReducer, useEffect, useState } from "react";
import { Col, Row, Dropdown, Container, DropdownButton, Card, Button } from "react-bootstrap";
import Rating from "./Rating";

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

const Compaire = () => {
  let initalState = {
    loading: false,
    error: "",
    product: [],
  };

  const [{ loading, error, product }, dispatch] = useReducer(reducer, initalState);
  const [compare, setCompare] = useState("");
  const [compare2, setCompare2] = useState("");

  useEffect(async () => {
    dispatch({ type: "FETCH_REQUEST" });
    try {
      let product = await axios.get("http://localhost:8000/products");
      dispatch({ type: "FETCH_SUCCESS", payload: product.data });
    } catch (error) {
      dispatch({ type: "FETCH_FAILS", payload: error });
    }
  }, []);

  let handleCompare = async (item) => {
    let { data } = await axios.get(`http://localhost:8000/products/${item.slug}`);
    setCompare(data);
  };
  let handleCompare2 = async (item) => {
    let { data } = await axios.get(`http://localhost:8000/products/${item.slug}`);
    setCompare2(data);
  };
  return (
    <>
      <Container>
        <Row style={{ marginTop: "5px" }}>
          <Col lg="6">
            <DropdownButton id="dropdown-basic-button" title="Dropdown button">
              {product.map((item) => (
                <>
                  <Dropdown.Item onClick={() => handleCompare(item)}>
                    <img style={{ width: "50px" }} src={item.img} alt="" /> <span>{item.name}</span>
                  </Dropdown.Item>
                  <hr />
                </>
              ))}
            </DropdownButton>
            {compare ? (
              <Card className="mt-3">
                <Card.Img className="w-25" variant="top" src={compare.img} />
                <Card.Body>
                  <Card.Title>{compare.name}</Card.Title>
                  <Card.Title>$ {compare.price}</Card.Title>
                  <Card.Text>{compare.description}</Card.Text>
                  <Rating rating={compare.rating} numberofrating={compare.numberofrating} />
                  <Button variant="primary">Go somewhere</Button>
                </Card.Body>
              </Card>
            ) : (
              <h1>Choose Item</h1>
            )}
          </Col>
          {/* ============= */}
          <Col lg="6">
            <DropdownButton id="dropdown-basic-button" title="Dropdown button">
              {product.map((item) => (
                <>
                  <Dropdown.Item onClick={() => handleCompare2(item)}>
                    <img style={{ width: "50px" }} src={item.img} alt="" /> <span>{item.name}</span>
                  </Dropdown.Item>
                  <hr />
                </>
              ))}
            </DropdownButton>
            {compare2 ? (
              <Card className="mt-3">
                <Card.Img className="w-25" variant="top" src={compare2.img} />
                <Card.Body>
                  <Card.Title>{compare2.name}</Card.Title>
                  <Card.Title>$ {compare2.price}</Card.Title>
                  <Card.Text>{compare2.description}</Card.Text>
                  <Rating rating={compare2.rating} numberofrating={compare2.numberofrating} />
                  <Button variant="primary">Go somewhere</Button>
                </Card.Body>
              </Card>
            ) : (
              <h1>Choose Item</h1>
            )}
          </Col>
        </Row>
        <Row>
          <Container className="w-50">
            {compare && compare2 ? (
              compare.rating > compare2.rating ? (
                <Card className="mt-3">
                  <h4>This product is good between two products</h4>
                  <Card.Img className="w-25" variant="top" src={compare.img} />
                  <Card.Body>
                    <Card.Title>{compare.name}</Card.Title>
                    <Card.Text>{compare.description}</Card.Text>
                    <Rating rating={compare.rating} numberofrating={compare.numberofrating} />
                    <Button variant="primary">Go somewhere</Button>
                  </Card.Body>
                </Card>
              ) : compare.rating < compare2.rating ? (
                <Card className="mt-3">
                  <h4>This product is good between two products</h4>
                  <Card.Img className="w-25" variant="top" src={compare2.img} />
                  <Card.Body>
                    <Card.Title>{compare2.name}</Card.Title>
                    <Card.Text>{compare2.description}</Card.Text>
                    <Rating rating={compare2.rating} numberofrating={compare.numberofrating} />
                    <Button variant="primary">Go somewhere</Button>
                  </Card.Body>
                </Card>
              ) : compare.price > compare2.price ? (
                <Card className="mt-3">
                  <h4>This product is good between two products</h4>
                  <Card.Img className="w-25" variant="top" src={compare.img} />
                  <Card.Body>
                    <Card.Title>{compare.name}</Card.Title>
                    <Card.Text>{compare.description}</Card.Text>
                    <Rating rating={compare.rating} numberofrating={compare.numberofrating} />
                    <Button variant="primary">Go somewhere</Button>
                  </Card.Body>
                </Card>
              ) : compare.price < compare2.price ? (
                <Card className="mt-3">
                  <h4>This product is good between two products</h4>
                  <Card.Img className="w-25" variant="top" src={compare2.img} />
                  <Card.Body>
                    <Card.Title>{compare2.name}</Card.Title>
                    <Card.Text>{compare2.description}</Card.Text>
                    <Rating rating={compare2.rating} numberofrating={compare.numberofrating} />
                    <Button variant="primary">Go somewhere</Button>
                  </Card.Body>
                </Card>
              ) : (
                ""
              )
            ) : (
              ""
            )}
          </Container>
        </Row>
      </Container>
    </>
  );
};

export default Compaire;
