import React from "react";
import { useState, useEffect } from "react";
import { Form, Row, Col, Container, Card } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../components/Loader";
import Msg from "../components/Msg";
import { filterMovies } from "../redux/actions/movieActions";
import { MOVIE_FILTER_RESET } from "../redux/constants/MovieConstants";
import { Link } from "react-router-dom";
function BrowseMovie() {
  const [name, setname] = useState("");
  const [year, setyear] = useState("");
  const [category, setcategory] = useState("");
  const [news, setnews] = useState(1);
  const [mostwatch, setmostwatch] = useState(1);
  const [highrated, sethighrated] = useState(1);
  const [logged, setlogged] = useState(true);

  const movieFilter = useSelector((state) => state.movieFilter);
  const { movies, success, error, loading } = movieFilter;
  const dispatch = useDispatch();
  console.log(movies);
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;
  useEffect(() => {
    if (success) {
      setname("");
      setyear("");
      setcategory("");
      setnews(1);
      setmostwatch(1);
      sethighrated(1);
    } else {
      dispatch({ type: MOVIE_FILTER_RESET });
    }
    if (userInfo) {
      setlogged(true);
      dispatch(filterMovies({}, logged));
    } else {
      setlogged(false);
      dispatch(filterMovies({}, logged));
    }
  }, [userInfo, success, dispatch, logged]);

  const filterHandler = (e) => {
    e.preventDefault();

    dispatch(
      filterMovies(
        {
          name__icontains: name,
          year,
          category,
          new: news,
          mostwatch,
          highrated,
        },
        logged
      )
    );
  };
  return (
    <div className="container">
      <br />
      <Card className="text-center">
        <Card.Header>
          <h1>Search Filter</h1>
        </Card.Header>
        <Container>
          <Form onSubmit={filterHandler}>
            <Row>
              <Col>
                <p class="pull-left term">Search Term:</p>
                <input
                  name="name"
                  className="form-control mr-sm-2"
                  autocomplete="off"
                  type="search"
                  onChange={(e) => setname(e.target.value)}
                />
              </Col>
              <Col>
                <p>Year:</p>
                <input
                  className="form-control mr-sm-2"
                  name="number"
                  min="4"
                  max="4"
                  onChange={(e) => setyear(e.target.value)}
                />
              </Col>
            </Row>
            <Row>
              <Col>
                <p>Category:</p>
                <select
                  name="genre"
                  className="form-control mr-sm-2"
                  onChange={(e) => setcategory(e.target.value)}
                >
                  <option onClick={(e) => setcategory("")} value="">
                    ------
                  </option>
                  <option onClick={(e) => setcategory("AC")} value="AC">
                    Action
                  </option>
                  <option onClick={(e) => setcategory("SP")} value="SP">
                    Sports
                  </option>
                  <option onClick={(e) => setcategory("AN")} value="AN">
                    Animation
                  </option>
                  <option onClick={(e) => setcategory("CO")} value="CO">
                    Comedy
                  </option>
                  <option onClick={(e) => setcategory("DR")} value="DR">
                    Drama
                  </option>
                  <option onClick={(e) => setcategory("HO")} value="HO">
                    Horror
                  </option>
                  <option onClick={(e) => setcategory("RO")} value="RO">
                    Romance
                  </option>
                  <option onClick={(e) => setcategory("BI")} value="BI">
                    BIography
                  </option>
                </select>
              </Col>

              <Col>
                <p>New:</p>
                <select
                  className="form-control mr-sm-2"
                  name="rating"
                  onChange={(e) => setnews(e.target.value)}
                >
                  <option value="1">----</option>
                  <option value="2">True</option>
                  <option value="3">False</option>
                </select>
                <p>most watch:</p>
                <select
                  name="year"
                  className="form-control mr-sm-2"
                  onChange={(e) => setmostwatch(e.target.value)}
                >
                  <option value="1">----</option>
                  <option value="2">True</option>
                  <option value="3">False</option>
                </select>{" "}
              </Col>

              <Col>
                <p>high rated:</p>
                <select
                  name="language"
                  className="form-control mr-sm-2"
                  onChange={(e) => sethighrated(e.target.value)}
                >
                  <option value="1">----</option>
                  <option value="2">True</option>
                  <option value="3">False</option>
                </select>{" "}
              </Col>
            </Row>
            <Row>
              <Container>
                <input class="btn btn-primary" type="submit" value="Search" />
              </Container>
            </Row>
          </Form>
        </Container>
      </Card>
      <br />
      <br />
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
    </div>
  );
}

export default BrowseMovie;
