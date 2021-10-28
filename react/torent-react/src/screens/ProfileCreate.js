import React, { useState, useEffect } from "react";
import { Form, Button, Container, Card } from "react-bootstrap";
import { createUserProfile } from "../redux/actions/userActions";
import { USER_PROFILE_CREATE_RESET } from "../redux/constants/userConstants";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../components/Loader";
import Msg from "../components/Msg";

function ProfileCreate({ history, location }) {
  const dispatch = useDispatch();
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;
  const userProfileCreate = useSelector((state) => state.userProfileCreate);
  const { success, loading, error } = userProfileCreate;
  const [first, setfirst] = useState("");
  const [last, setlast] = useState("");
  const [bio, setbio] = useState("");
  const [image, setimage] = useState("");

  useEffect(() => {
    if (!userInfo) {
      history.push("/register");
    }
    if (success) {
      history.replace("/profile");
      dispatch({ type: USER_PROFILE_CREATE_RESET });
    }
  }, [userInfo, success, history, dispatch]);

  const createProfileHandler = (e) => {
    e.preventDefault();
    dispatch(createUserProfile({ first, last, bio, image }));
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
            <Card.Header>create Profile</Card.Header>

            <Card.Body>
              <Form onSubmit={createProfileHandler}>
                <Form.Group controlId="name">
                  <Form.Label>first</Form.Label>
                  <Form.Control
                    type="name"
                    placeholder="enter first"
                    required
                    value={first}
                    onChange={(e) => setfirst(e.target.value)}
                  ></Form.Control>
                </Form.Group>
                <Form.Group controlId="email">
                  <Form.Label>last</Form.Label>
                  <Form.Control
                    type="name"
                    placeholder="enter last"
                    required
                    value={last}
                    onChange={(e) => setlast(e.target.value)}
                  ></Form.Control>
                </Form.Group>
                <Form.Group controlId="brand">
                  <Form.Label>bio</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="enter bio"
                    required
                    value={bio}
                    onChange={(e) => setbio(e.target.value)}
                  ></Form.Control>
                </Form.Group>
                <Form.Group controlId="countinstock">
                  <Form.Label> image</Form.Label>
                  <input
                    type="file"
                    placeholder="enter image"
                    required
                    onChange={(e) => setimage(e.target.files[0])}
                  />
                </Form.Group>
                <Button variant="primary" type="submit">
                  update profile
                </Button>{" "}
              </Form>{" "}
            </Card.Body>
          </Card>{" "}
        </Container>
      )}
    </div>
  );
}

export default ProfileCreate;
