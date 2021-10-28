import React, { useEffect, useState } from "react";
import { Row, Col, Container, Card } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../components/Loader";
import Msg from "../components/Msg";
import { getMovieList } from "../redux/actions/movieActions";
import { Pagination } from "react-bootstrap";
import { Link } from "react-router-dom";
function HomeScreen() {
  const movieList = useSelector((state) => state.movieList);
  const { loading, error, movies, next, previous } = movieList;
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;
  const [logged, setlogged] = useState(false);
  const dispatch = useDispatch();
  useEffect(() => {
    if (userInfo) {
      setlogged(true);
      dispatch(getMovieList("", logged));
    } else {
      setlogged(false);
      dispatch(getMovieList("", logged));
    }
  }, [dispatch, userInfo, logged]);
  const paginateHandler = (url) => {
    const urlsp = url.split("api/movies")[1];

    dispatch(getMovieList(urlsp, logged));
  };
  return (
    <div>
      {loading ? (
        <Loader />
      ) : error ? (
        <Msg>{error}</Msg>
      ) : (
        <Container>
          <Card className="text-center">
            <Row>
              {movies.map((movie) => (
                <Col md={"3"}>
                  <Card key={movie.id} style={{ width: "18rem" }}>
                    <Card.Img variant="top" src={movie.image} />
                    <Card.Body>
                      <Link to={`/movies/${movie.slug}`}>
                        <Card.Title>{movie.name}</Card.Title>{" "}
                      </Link>
                      <Card.Text>{movie.desc}</Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </Card>
        </Container>
      )}
      <div className="container text-center">
        <Pagination>
          <Pagination.Item
            onClick={() => paginateHandler(previous)}
            active={previous !== null}
            disabled={previous === null}
          >
            Previous
          </Pagination.Item>
          <Pagination.Item
            onClick={() => paginateHandler(next)}
            active={next !== null}
            disabled={next === null}
          >
            Next
          </Pagination.Item>
        </Pagination>
      </div>
    </div>
  );
}

export default HomeScreen;
