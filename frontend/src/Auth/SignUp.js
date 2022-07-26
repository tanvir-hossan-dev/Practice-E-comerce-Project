import React, { useContext, useEffect, useState } from "react";
import { Container, Form, Button } from "react-bootstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { Store } from "../Store";

const SignUp = () => {
  let navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cPassword, setCPassword] = useState("");
  const { state3, dispatch3 } = useContext(Store);
  const { userInfo } = state3;

  let { search } = useLocation();
  let redirectUrl = new URLSearchParams(search).get("redirect");
  let redirect = redirectUrl ? redirectUrl : "/";

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post("http://localhost:8000/api/users/signup", {
        name,
        email,
        password,
      });
      navigate("/signin");
    } catch (err) {
      toast.error("Invalid Auth");
    }
  };

  // useEffect(() => {
  //   if (userInfo) {
  //     navigate(redirect);
  //   }
  // }, []);

  return (
    <Container className="w-25 mt-5 p-3 border" style={{ borderRadius: "5px" }}>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Name</Form.Label>
          <Form.Control
            onChange={(e) => setName(e.target.value)}
            value={name}
            type="text"
            placeholder="Name"
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            type="email"
            placeholder="Enter email"
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Password</Form.Label>
          <Form.Control
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            type="password"
            placeholder="Password"
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            onChange={(e) => setCPassword(e.target.value)}
            value={cPassword}
            type="password"
            placeholder="Confirm Password"
          />
        </Form.Group>
        <Button className="mb-2" variant="primary" type="submit">
          Sign Up
        </Button>
        <br />
        <Form.Text className="text-muted">
          Already Have an Account? <Link to={`/signin?redirect=${redirect}`}>Login</Link>{" "}
        </Form.Text>
      </Form>
    </Container>
  );
};

export default SignUp;
