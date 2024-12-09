import React, { useState, useEffect } from "react";
import Modals from "../components/Modal";
import { Form, Button } from "react-bootstrap";
import { Link, useHistory } from "react-router-dom";
import { login } from "../redux/actions/userActions";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../components/Loader";
import Msg from "../components/Msg";
function Login(props) {
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const dispatch = useDispatch();
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo, success, loading, error } = userLogin;

  let history = useHistory();

  useEffect(() => {
    if (userInfo || success) {
      history.push("/");
    }
  }, [success, history, userInfo]);
  const loginUser = (e) => {
    e.preventDefault();
    dispatch(login(email, password));
    props.onHide();
  };
  return (
    <Modals props={props}>
      {loading ? (
        <Loader />
      ) : error ? (
        <Msg variant="danger">{error}</Msg>
      ) : (
        <Form onSubmit={loginUser}>
          <Form.Group controlId="email">
            <Form.Label>email</Form.Label>
            <Form.Control
              type="email"
              placeholder="enter email"
              value={email}
              onChange={(e) => setemail(e.target.value)}
            ></Form.Control>
          </Form.Group>
          <Form.Group controlId="brand">
            <Form.Label>password</Form.Label>
            <Form.Control
              type="password"
              placeholder="enter password"
              value={password}
              onChange={(e) => setpassword(e.target.value)}
            ></Form.Control>
          </Form.Group>
          <Button variant="primary" type="submit">
            login
          </Button>
          Not a user
          <Link to="/register" onClick={() => props.onHide()}>
            {" "}
            register
          </Link>
        </Form>
      )}
    </Modals>
  );
}

export default Login;
