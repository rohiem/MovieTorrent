import React, { useEffect, useState } from "react";
import {
  Form,
  Button,
  Image,
  Row,
  Col,
  Container,
  Card,
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../components/Loader";
import Msg from "../components/Msg";
import {
  getMovieDetail,
  createMovieComment,
} from "../redux/actions/movieActions";
import { Link } from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { MOVIE_CREATE_COMMENT_RESET } from "../redux/constants/MovieConstants";
function MovieDetail({ match, history }) {
  const [highlighted, setHighlighted] = useState(-1);
  const highlightRate = (high) => (evt) => {
    setHighlighted(high);
  };

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;
  const [logged, setlogged] = useState(false);
  const MovieDetail = useSelector((state) => state.movieDetail);
  const { movie, error, loading } = MovieDetail;
  const movieCreateComment = useSelector((state) => state.movieCreateComment);
  const {
    error: errorComment,
    loading: loadingComment,
    success,
  } = movieCreateComment;
  if (success) {
    console.log("success");
  }
  const [body, setBody] = useState("");

  const dispatch = useDispatch();

  useEffect(() => {
    if (userInfo || success) {
      if (success) {
        setBody("");
      } else {
        dispatch({ type: MOVIE_CREATE_COMMENT_RESET });
      }
      setlogged(true);
      dispatch(getMovieDetail(match.params.slug, logged));
    } else if (!userInfo) {
      setlogged(false);
      dispatch(getMovieDetail(match.params.slug, logged));
    }
  }, [dispatch, userInfo, logged, match.params.slug, success]);

  const rateClicked = (i) => async () => {
    const config = {
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${userInfo.access_token}`,
      },
    };
    const { data } = await axios.post(
      `/api/movies/${movie.id}/rate`,
      { stars: i + 1 },
      config
    );
    console.log(data);
    dispatch(getMovieDetail(match.params.slug, logged));
  };
  const commentHandler = (e) => {
    e.preventDefault();
    dispatch(createMovieComment(movie.id, body));
  };
  const editRedirect = () => {
    history.push(`/moviesedit/${movie.slug}`);
  };
  return (
    <div>
      {loading ? (
        <Loader />
      ) : error ? (
        <Msg variant={"danger"}>{error}</Msg>
      ) : (
        <div>
          <br />
          <Container>
            <Card className="text-center">
              <Card.Header>{movie.name}</Card.Header>{" "}
              <Card.Body>
                <Row>
                  <Col md="6">
                    <Image src={movie.image} fluid />
                  </Col>
                  <Col md="6">
                    <Row>
                      <Col md={3}>
                        <Link
                          to={`/moviesedit/${movie.slug}`}
                          onClick={editRedirect}
                          className="btn btn-primary"
                        >
                          {" "}
                          update
                        </Link>
                      </Col>

                      <Col md={3}>
                        <Link
                          to={`/moviesimageedit/${movie.slug}`}
                          onClick={editRedirect}
                          className="btn btn-primary"
                        >
                          {" "}
                          update image and torrent
                        </Link>
                      </Col>
                    </Row>
                    <Row>
                      <h2>
                        {movie.name}({movie.year})
                      </h2>
                    </Row>
                    <Row>
                      <React.Fragment>
                        {userInfo ? (
                          <div>
                            <div style={{ backgroundColor: "white" }}>
                              <FontAwesomeIcon
                                icon={faStar}
                                className={
                                  movie.avg_of_rating > 0 ? "oranger" : ""
                                }
                              />
                              <FontAwesomeIcon
                                icon={faStar}
                                className={
                                  movie.avg_of_rating > 1 ? "oranger" : ""
                                }
                              />
                              <FontAwesomeIcon
                                icon={faStar}
                                className={
                                  movie.avg_of_rating > 2 ? "oranger" : ""
                                }
                              />
                              <FontAwesomeIcon
                                icon={faStar}
                                className={
                                  movie.avg_of_rating > 3 ? "oranger" : ""
                                }
                              />
                              <FontAwesomeIcon
                                icon={faStar}
                                className={
                                  movie.avg_of_rating > 4 ? "oranger" : ""
                                }
                              />
                              ({movie.no_of_rating})
                            </div>
                            <div>
                              <h3>rate it below</h3>
                              {[...Array(5)].map((e, i) => {
                                return (
                                  <FontAwesomeIcon
                                    icon={faStar}
                                    key={i}
                                    className={
                                      highlighted > i - 1 ? "oranger" : ""
                                    }
                                    onMouseEnter={highlightRate(i)}
                                    onMouseLeave={highlightRate(-1)}
                                    onClick={rateClicked(i)}
                                  />
                                );
                              })}
                            </div>
                          </div>
                        ) : null}
                      </React.Fragment>
                    </Row>
                    <Row>{movie.description}</Row>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
            <br />
            <Container>
              {userInfo && (
                <div>
                  {loadingComment ? (
                    <Loader />
                  ) : errorComment ? (
                    <Msg variant="danger">{errorComment}</Msg>
                  ) : (
                    <Form onSubmit={commentHandler}>
                      <Form.Group controlId="body">
                        <Form.Label>Comment</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={3}
                          placeholder="enter Comment"
                          value={body}
                          onChange={(e) => setBody(e.target.value)}
                        ></Form.Control>
                      </Form.Group>

                      <Button variant="primary" type="submit">
                        Create
                      </Button>
                    </Form>
                  )}
                </div>
              )}
            </Container>
            <br />
            <Container>
              {movie.comments &&
                movie.comments.map((comment) => (
                  <div className="container">
                    <Row>
                      <Col md="3">
                        <Image
                          src={comment.image}
                          height={"80px"}
                          width={"80px"}
                        />
                      </Col>
                      <Col md="9">
                        <Row>
                          <Col>
                            <h3>{comment.user}</h3>
                          </Col>
                          <Col>
                            <p>{comment.date}</p>
                          </Col>
                        </Row>
                        <Row>
                          <h5>{comment.body}</h5>
                        </Row>
                      </Col>
                    </Row>
                    <br />
                  </div>
                ))}
            </Container>
          </Container>
        </div>
      )}
    </div>
  );
}

export default MovieDetail;
