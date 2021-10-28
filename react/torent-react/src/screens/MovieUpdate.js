import React, { useEffect, useState } from "react";
import { Form, Button, Container, Card } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../components/Loader";
import Msg from "../components/Msg";
import { updateMovie, getMovieDetail } from "../redux/actions/movieActions";
import { MOVIE_UPDATE_RESET } from "../redux/constants/MovieConstants";
function MovieUpdate({ history, match }) {
  const slug = match.params.slug;
  const [name, setName] = useState("");
  const [year, setYear] = useState(0);

  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");

  const dispatch = useDispatch();
  const movieUpdate = useSelector((state) => state.movieUpdate);
  const { success, loading, error } = movieUpdate;

  const movieDetail = useSelector((state) => state.movieDetail);
  const { loading: loadingdetail, error: errordetail, movie } = movieDetail;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;
  useEffect(() => {
    if (!userInfo) {
      history.push("/register");
    }
    if (success) {
      dispatch({ type: MOVIE_UPDATE_RESET });
      history.push("/profile");
    }
    if (!movie.name || movie.slug !== String(slug)) {
      dispatch(getMovieDetail(slug, true));
    } else {
      setName(movie.name);
      setYear(movie.year);
      setDescription(movie.description);
      setCategory(movie.category);
    }
  }, [movie, slug, userInfo, history, success, dispatch]);

  const updateMovieHandler = (e) => {
    e.preventDefault();

    dispatch(
      updateMovie(slug, {
        name,
        description,
        year,
        category,
      })
    );
  };
  return (
    <div>
      {loading ? (
        <Loader />
      ) : error ? (
        <Msg variant="danger">{error}</Msg>
      ) : (
        movie && (
          <Container>
            {loadingdetail && <Loader />}
            {errordetail && <Msg>{errordetail}</Msg>}
            <Card className="text-center">
              <Card.Header>Create</Card.Header>

              <Card.Body>
                <Form onSubmit={updateMovieHandler}>
                  <Form.Group controlId="name">
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                      type="name"
                      placeholder="enter name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    ></Form.Control>
                  </Form.Group>

                  <Form.Group controlId="year">
                    <Form.Label>year</Form.Label>
                    <Form.Control
                      type="number"
                      placeholder="enter year"
                      value={year}
                      onChange={(e) => setYear(e.target.value)}
                    ></Form.Control>
                  </Form.Group>

                  <Form.Group controlId="category">
                    <Form.Label>Category</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="enter brand"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                    ></Form.Control>
                  </Form.Group>

                  <Form.Group controlId="description">
                    <Form.Label>Description</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="enter brand"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    ></Form.Control>
                  </Form.Group>
                  <Button variant="primary" type="submit">
                    create
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Container>
        )
      )}
    </div>
  );
}

export default MovieUpdate;
