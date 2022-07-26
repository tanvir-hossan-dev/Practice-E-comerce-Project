import { BrowserRouter, Routes, Route, Link, useNavigate } from "react-router-dom";
import { Home } from "./Components/Home";
import Product from "./Components/Product";
import { Container, Nav, Navbar, Badge, NavDropdown, Button, Offcanvas, Alert } from "react-bootstrap";
import ProductsDetalis from "./Components/ProductsDetalis";
import { useContext, useState } from "react";
import { Store } from "./Store";
import Cart from "./Components/Cart";
import CartPage from "./Components/CartPage";
import Login from "./Auth/Login";
import WishList from "./Components/WishList";
import Compaire from "./Components/Compaire";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Shipping from "./Components/Shipping";
import SignUp from "./Auth/SignUp";
import Payment from "./Components/Payment";
import Placeholder from "./Components/Placeholder";
import Order from "./Components/Order";

function App() {
  const { state, dispatch, state2, dispatch2, state3, dispatch3, dispatch4, dispatch5 } = useContext(Store);
  const { userInfo } = state3;
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  let updateCart = (item, quantity) => {
    dispatch({ type: "ADD_TO_CART", payload: { ...item, quantity } });
  };

  let handleRemoveItem = (item) => {
    dispatch({ type: "REMOVE_TO_CART", payload: item });
  };
  let handleRemoveItemWishList = (item) => {
    dispatch2({ type: "REMOVEWISH_TO_CART", payload: item });
  };

  let handleLogOut = () => {
    dispatch3({ type: "USER_LOGOUT" });
    dispatch4({ type: "SHIPPING_ADDRESS", payload: {} });
    dispatch5({ type: "PAYMENT_METHOD", payload: "" });
  };
  return (
    <>
      <BrowserRouter>
        <Navbar bg="dark" variant="dark">
          <ToastContainer position="bottom-center" limit={1} />
          <Container>
            <Navbar.Brand href="#home">Navbar</Navbar.Brand>
            <Nav>
              <Link
                style={{ color: "white", textDecoration: "none", marginRight: "10px", marginTop: "7px" }}
                to="/"
              >
                Home
              </Link>
              <Link
                style={{ color: "white", textDecoration: "none", marginRight: "10px", marginTop: "7px" }}
                to="/products"
              >
                Product
              </Link>
              <Link
                style={{ color: "white", textDecoration: "none", marginRight: "10px", marginTop: "7px" }}
                to="/compaire"
              >
                Compaire
              </Link>
              <NavDropdown title="Cart" id="basic-nav-dropdown">
                {state.cart.cartItems.length == 0 ? (
                  <Alert variant="danger">Card is empty</Alert>
                ) : (
                  <div style={{ width: "360px" }}>
                    {state.cart.cartItems.map((item) => (
                      <>
                        {" "}
                        <img style={{ width: "80px" }} className="m-1" src={item.img} alt="" />
                        <Link
                          className="m-1"
                          style={{ color: "black", textDecoration: "none" }}
                          to={`/products/${item.slug}`}
                        >
                          {item.slug}
                        </Link>
                        <Button
                          className="m-1"
                          onClick={() => updateCart(item, item.quantity + 1)}
                          disabled={item.quantity == item.stock}
                        >
                          +
                        </Button>{" "}
                        <span>{item.quantity}</span>{" "}
                        <Button
                          className="m-1"
                          onClick={() => updateCart(item, item.quantity - 1)}
                          disabled={item.quantity == 1}
                        >
                          -
                        </Button>
                        <Button className="m-1" variant="danger" onClick={() => handleRemoveItem(item)}>
                          Delete
                        </Button>
                      </>
                    ))}
                  </div>
                )}
                <NavDropdown.Divider />
                <NavDropdown.Item>
                  <Link style={{ color: "black", textDecoration: "none" }} to="/cartpage">
                    Go to Cart
                  </Link>
                </NavDropdown.Item>
              </NavDropdown>
              {state.cart.cartItems.length > 0 && (
                <Badge bg="primary" style={{ height: "25px", marginTop: "8px" }}>
                  {" "}
                  {state.cart.cartItems.length}{" "}
                </Badge>
              )}
              {/* //=============================== */}
              <NavDropdown title="WistList" id="basic-nav-dropdown">
                {state2.wish.wishItems.length == 0 ? (
                  <Alert variant="danger">You have no Wishlist</Alert>
                ) : (
                  <div style={{ width: "360px" }}>
                    {state2.wish.wishItems.map((item) => (
                      <div>
                        <img style={{ width: "80px" }} className="m-1" src={item.img} alt="" />
                        <Link
                          className="m-1"
                          style={{ color: "black", textDecoration: "none" }}
                          to={`/products/${item.slug}`}
                        >
                          {item.slug}
                        </Link>
                        <Button
                          className="m-1"
                          variant="danger"
                          onClick={() => handleRemoveItemWishList(item)}
                        >
                          Delete
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
                <NavDropdown.Divider />
                <NavDropdown.Item>
                  <Link style={{ color: "black", textDecoration: "none" }} to="/wishlist">
                    Go to WishList
                  </Link>
                </NavDropdown.Item>
              </NavDropdown>
              {state2.wish.wishItems.length > 0 && (
                <Badge bg="primary" style={{ height: "25px", marginTop: "8px" }}>
                  {" "}
                  {state2.wish.wishItems.length}{" "}
                </Badge>
              )}
              {/*  */}
              {userInfo ? (
                <NavDropdown title={userInfo.name} id="basic-nav-dropdown">
                  <NavDropdown.Divider />
                  <NavDropdown.Item onClick={handleLogOut}>Log Out</NavDropdown.Item>
                </NavDropdown>
              ) : (
                <Link
                  style={{ color: "white", textDecoration: "none", marginRight: "10px", marginTop: "7px" }}
                  to="/signin"
                >
                  SignIn
                </Link>
              )}
            </Nav>
          </Container>
        </Navbar>
        <Button
          variant="primary"
          onClick={handleShow}
          style={{ position: "fixed", top: "50% ", right: "0%" }}
        >
          Cart
        </Button>
        <Offcanvas show={show} onHide={handleClose} placement="end">
          <Offcanvas.Header closeButton>Cart Item</Offcanvas.Header>
          <Offcanvas.Body>
            {state.cart.cartItems.length == 0 ? (
              <Alert variant="danger">Card is empty</Alert>
            ) : (
              <div style={{ width: "360px" }}>
                {state.cart.cartItems.map((item) => (
                  <>
                    {" "}
                    <img style={{ width: "80px" }} className="m-1" src={item.img} alt="" />
                    <Link
                      className="m-1"
                      style={{ color: "black", textDecoration: "none" }}
                      to={`/products/${item.slug}`}
                    >
                      {item.slug}
                    </Link>
                    <Button
                      className="m-1"
                      onClick={() => updateCart(item, item.quantity + 1)}
                      disabled={item.quantity == item.stock}
                    >
                      +
                    </Button>{" "}
                    <span>{item.quantity}</span>{" "}
                    <Button
                      className="m-1"
                      onClick={() => updateCart(item, item.quantity - 1)}
                      disabled={item.quantity == 1}
                    >
                      -
                    </Button>
                    <Button className="m-1" variant="danger" onClick={() => handleRemoveItem(item)}>
                      Delete
                    </Button>
                    <hr></hr>
                  </>
                ))}

                <Link style={{ color: "white", textDecoration: "none" }} to="/cartpage">
                  <Button className="w-100">Go to Cart</Button>
                </Link>
              </div>
            )}
          </Offcanvas.Body>
        </Offcanvas>
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/products" element={<Product />}></Route>
          <Route path="/products/:slug" element={<ProductsDetalis />}></Route>
          <Route path="/cart" element={<Cart />}></Route>
          <Route path="/cartpage" element={<CartPage />}></Route>
          <Route path="/signin" element={<Login />}></Route>
          <Route path="/signup" element={<SignUp />}></Route>
          <Route path="/wishlist" element={<WishList />}></Route>
          <Route path="/compaire" element={<Compaire />}></Route>
          <Route path="/shipping" element={<Shipping />}></Route>
          <Route path="/payment" element={<Payment />}></Route>
          <Route path="/placeholder" element={<Placeholder />}></Route>
          <Route path="/order/:id" element={<Order />}></Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
