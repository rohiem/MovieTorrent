import React, { useState, useEffect } from "react";
import { Form, Button, Container, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import Login from "../screens/Login";
import { register } from "../redux/actions/userActions";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../components/Loader";
import Msg from "../components/Msg";
function Register({ history }) {
  const dispatch = useDispatch();
  const [modalShow, setModalShow] = useState(false);
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo, success, loading, error } = userLogin;
  const [username, setUsername] = useState("");
  const [email, setemail] = useState("");
  const [password1, setpassword1] = useState("");
  const [password2, setpassword2] = useState("");

  useEffect(() => {
    if (userInfo || success) {
      history.push("/profile/create");
    }
  }, [userInfo, success, history]);

  const registerUser = (e) => {
    e.preventDefault();
    dispatch(register(username, email, password1, password2));
  };

  return (
    <div>
      {loading ? (
        <Loader />
      ) : error ? (
        <Msg variant="danger">{error}</Msg>
      ) : (
        <Container>
          <Card className="text-center">
            <Card.Header>REGISTER</Card.Header>

            <Card.Body>
              <Form onSubmit={registerUser}>
                <Form.Group controlId="name">
                  <Form.Label>username</Form.Label>
                  <Form.Control
                    type="name"
                    placeholder="enter name"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  ></Form.Control>
                </Form.Group>
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
                  <Form.Label>password1</Form.Label>
                  <p> password must contain letters,numbers and sympols</p>
                  <Form.Control
                    type="password"
                    placeholder="enter password1"
                    value={password1}
                    onChange={(e) => setpassword1(e.target.value)}
                  ></Form.Control>
                </Form.Group>
                <Form.Group controlId="countinstock">
                  <Form.Label> password2</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="enter password2"
                    value={password2}
                    onChange={(e) => setpassword2(e.target.value)}
                  ></Form.Control>
                </Form.Group>
                <Button variant="primary" type="submit">
                  sign up
                </Button>{" "}
                Already a user
                <Link to="/register" onClick={() => setModalShow(true)}>
                  {" "}
                  sign in
                </Link>
                <Login show={modalShow} onHide={() => setModalShow(false)} />
              </Form>{" "}
            </Card.Body>
          </Card>{" "}
        </Container>
      )}
    </div>
  );
}

export default Register;
