import React, { useEffect } from "react";
import { Image, Row, Col, Container, Card } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
//import { Link } from "react-router-dom";
import Loader from "../components/Loader";
import Msg from "../components/Msg";
import { getUserProfile } from "../redux/actions/userActions";
function Profile({ history }) {
  const userProfile = useSelector((state) => state.userProfile);
  const { user, success, loading, error } = userProfile;

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
      {loading ? (
        <Loader />
      ) : error ? (
        <Msg variant={"danger"}>{error}</Msg>
      ) : (
        user &&
        userInfo && (
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
                        <Row>
                          <a
                            className="btn btn-primary"
                            href={"/profile/create"}
                          >
                            updateprofile
                          </a>
                        </Row>
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
              <br />
              <Card className="text-center">
                <Row>
                  {user.movieCreated !== undefined &&
                    user.movieCreated.map((movie) => (
                      <Col md={3}>
                        <Card key={movie.id} style={{ width: "18rem" }}>
                          <Card.Img variant="top" src={movie.image} />
                          <Card.Body>
                            <Card.Title>{movie.name}</Card.Title>
                            <Card.Text>{movie.desc}</Card.Text>
                          </Card.Body>
                        </Card>
                      </Col>
                    ))}
                </Row>
              </Card>
            </Container>
          </div>
        )
      )}
    </div>
  );
}

export default Profile;
