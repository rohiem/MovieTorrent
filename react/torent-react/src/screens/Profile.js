import React, { useEffect } from "react";
import { Image, Row, Col, Container, Card } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { getUserProfile } from "../redux/actions/userActions";
function Profile({ history }) {
  const userProfile = useSelector((state) => state.userProfile);
  const { user, success } = userProfile;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const dispatch = useDispatch();
  useEffect(() => {
    if (!userInfo) {
      history.push("/");
    } else if (
      Object.keys(user).length === 0 &&
      Object.getPrototypeOf(user) === Object.prototype
    ) {
      dispatch(getUserProfile());
    }
  }, [dispatch, userInfo, user, history, success]);

  return (
    <div>
      {user && userInfo && (
        <div>
          <br />
          <Container>
            <Card className="text-center">
              <Card.Header>profile</Card.Header>{" "}
              <Card.Body>
                <Row>
                  <Col md="6">
                    <Image src={user.picture} alt={user.first} fluid />
                  </Col>
                  <Col md="6">
                    <Row>
                      <h2>
                        {user.first} {user.last}
                        {`@${userInfo.user.username}`}
                      </h2>
                    </Row>
                    <Row>{userInfo.user.email}</Row>
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            <Card className="text-center">
              {user.movies !== undefined &&
                user.movies.map((movie) => (
                  <Card key={movie.id} style={{ width: "18rem" }}>
                    <Card.Img variant="top" src={movie.image} />
                    <Card.Body>
                      <Card.Title>{movie.name}</Card.Title>
                      <Card.Text>{movie.desc}</Card.Text>
                    </Card.Body>
                  </Card>
                ))}
            </Card>
          </Container>
        </div>
      )}
    </div>
  );
}

export default Profile;
