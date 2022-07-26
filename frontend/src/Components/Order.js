import React, { useContext, useEffect, useReducer } from "react";
import axios from "axios";
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import { Alert, Col, Container, ListGroup, Row, Card, Button } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { Store } from "../Store";
import { toast } from "react-toastify";
import StripeCheckout from "react-stripe-checkout";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH-REQUEST":
      return { ...state, loading: true, error: action.payload };

    case "FETCH-SUCCESS":
      return { ...state, loading: false, order: action.payload };

    case "FETCH-FAIL":
      return { ...state, loading: false, error: action.payload };

    case "PAY_REQUEST":
      return { ...state, loadingPay: true };

    case "PAY_SUCCESS":
      return { ...state, loadingPay: false, successPay: true };

    case "PAY_FAIL":
      return { ...state, loadingPay: false, errorPay: action.payload };

    case "PAY_RESET":
      return { ...state, loadingPay: false, successPay: false };

    default:
      return state;
  }
};

const Order = () => {
  const navigate = useNavigate();
  const { state3 } = useContext(Store);
  const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();

  const [{ loading, error, order, loadingPay, successPay }, dispatch] = useReducer(reducer, {
    loading: false,
    order: {},
    error: "",
    successPay: false,
    loadingPay: false,
  });

  const params = useParams();
  const { id: orderId } = params;

  function createOrder(data, actions) {
    return actions.order
      .create({
        purchase_units: [
          {
            amount: { value: order.totalPrice },
          },
        ],
      })
      .then((orderId) => {
        return orderId;
      });
  }

  function onApprove(data, actions) {
    return actions.order.capture().then(async (deatils) => {
      try {
        dispatch({ type: "PAY_REQUEST" });
        const { data } = await axios.put(`http://localhost:8000/api/order/${order._id}/pay`, deatils, {
          headers: { authorization: `Bearer ${state3.userInfo.token}` },
        });
        dispatch({ type: "PAY_SUCCESS", payload: data });
        toast.success("Order is paid");
      } catch (err) {
        dispatch({ type: "PAY_FAIL", payload: err.message });
        toast.error(err.message);
      }
    });
  }

  function onError(err) {
    toast.error(err.message);
  }

  const handleToken = async () => {
    try {
      dispatch({ type: "FETCH-REQUEST" });

      const { data } = await axios.get(`http://localhost:8000/api/order/${orderId}`, {
        headers: { authorization: `Bearer ${state3.userInfo.token}` },
      });
      dispatch({ type: "FETCH-SUCCESS", payload: data });
    } catch (error) {
      dispatch({ type: "FETCH-FAIL", payload: error });
    }
  };

  useEffect(() => {
    if (!order._id || successPay || (order._id && order._id !== orderId)) {
      const fetchOrder = async () => {
        try {
          dispatch({ type: "FETCH-REQUEST" });

          const { data } = await axios.get(`http://localhost:8000/api/order/${orderId}`, {
            headers: { authorization: `Bearer ${state3.userInfo.token}` },
          });
          dispatch({ type: "FETCH-SUCCESS", payload: data });
        } catch (error) {
          dispatch({ type: "FETCH-FAIL", payload: error });
        }
      };
      fetchOrder();
      if (successPay) {
        dispatch({ type: "PAY_RESET" });
      }
    } else {
      const loadPayPalScript = async () => {
        const { data: clintId } = await axios.get("http://localhost:8000/api/keys/paypal", {
          headers: { authorization: `Bearer ${state3.userInfo.token}` },
        });
        paypalDispatch({ type: "resetOptions", value: { "client-id": clintId, currency: "USD" } });
        paypalDispatch({ type: "setLoadingStatus", value: "pending" });
      };
      loadPayPalScript();
    }
  }, [order, state3.userInfo, orderId, navigate, paypalDispatch, successPay]);

  return (
    <Container>
      {loading ? (
        <h1>Loading...</h1>
      ) : error ? (
        <Alert variant="danger">{error}</Alert>
      ) : (
        <>
          {order._id ? (
            <Row>
              <h1>OrderId {orderId} </h1>
              <Col lg={8}>
                <Card>
                  <Card.Body>
                    <Card.Title>Shipping Address</Card.Title>
                    <b>Name:</b> {order.shippingAddress.name} <br />
                    <b>Address:</b> {order.shippingAddress.address},{order.shippingAddress.city} <br />
                  </Card.Body>
                </Card>
              </Col>{" "}
              <Col lg={8} className="mt-3">
                <Card>
                  <Card.Body>
                    <Card.Title>Payment Method</Card.Title>
                    <b>Method:</b> {order.paymentMethod} <br />
                  </Card.Body>
                </Card>
              </Col>
              <Col lg={8} className="mt-3">
                <Card>
                  <Card.Body>
                    <Card.Title>Product Item</Card.Title>
                    <ListGroup>
                      {order.orderItems.map((item) => (
                        <ListGroup.Item>{item.name}</ListGroup.Item>
                      ))}
                    </ListGroup>
                  </Card.Body>
                </Card>
              </Col>{" "}
              <Col lg={4}>
                <Card>
                  <Card.Body>
                    <Card.Title>Order Summary</Card.Title>
                    <ListGroup>
                      <ListGroup.Item>
                        {" "}
                        <b>Item Price:</b> {order.productPrice}
                      </ListGroup.Item>
                      <ListGroup.Item>
                        <b>Shipping Price:</b> {order.shippingPrice}
                      </ListGroup.Item>
                      <ListGroup.Item>
                        <b>Tax Price:</b> {order.taxPrice}
                      </ListGroup.Item>
                      <ListGroup.Item>
                        <b>Total Price:</b> {order.totalPrice}
                      </ListGroup.Item>
                    </ListGroup>
                  </Card.Body>
                  {!order.isPaid && isPending ? (
                    <h1>Loading..........</h1>
                  ) : (
                    <>
                      {order.paymentMethod === "PayPal" && (
                        <PayPalButtons
                          createOrder={createOrder}
                          onApprove={onApprove}
                          onError={onError}
                        ></PayPalButtons>
                      )}
                      {order.paymentMethod === "Strip" && (
                        <StripeCheckout
                          token={handleToken}
                          stripeKey="pk_test_51Ku0ZhEmz3P19zrdO18eIxdvmna6UKiT9wnGaljeIBImPmq9iyvCWdjtQQivCi8k2GgBOac9lEvd7ovdTnqaSDBO00MFrQZCcE"
                          panelLabel="Payment"
                          currency="USD"
                          amount={order.totalPrice * 100}
                        />
                      )}
                    </>
                  )}
                  {loadingPay && <h1>Payment Loading.........</h1>}
                </Card>
              </Col>
            </Row>
          ) : (
            <h2>ami nai</h2>
          )}
        </>
      )}
    </Container>
  );
};

export default Order;
