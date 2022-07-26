import React, { useContext, useEffect, useState } from "react";
import { Container, Form, Button } from "react-bootstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { Store } from "../Store";

const Login = () => {
  let navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { state3, dispatch3 } = useContext(Store);
  const { userInfo } = state3;

  let { search, state } = useLocation();
  let redirectUrl = new URLSearchParams(search).get("redirect");
  let redirect = redirectUrl ? redirectUrl : "/";

  if (state) {
    toast.success(state);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post("http://localhost:8000/api/users/signin", { email, password });
      dispatch3({ type: "USER_SIGN_IN", payload: data });
      navigate(redirect || "/");
    } catch (err) {
      toast.error("Invalid email and password");
    }
  };

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, []);

  return (
    <Container className="w-25 mt-5 p-3 border" style={{ borderRadius: "5px" }}>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            type="email"
            placeholder="Enter email"
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            type="password"
            placeholder="Password"
          />
        </Form.Group>
        <Button className="mb-2" variant="primary" type="submit">
          SignIn
        </Button>
        <br />
        <Form.Text className="text-muted">
          Don't have an account? <Link to={`/signup?redirect=${redirect}`}>Create Account</Link>{" "}
        </Form.Text>
      </Form>
    </Container>
  );
};

export default Login;
