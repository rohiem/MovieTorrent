import React, { useEffect, useState } from "react";
import { Form, Button, Container, Card } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../components/Loader";
import Msg from "../components/Msg";
import { createMovie } from "../redux/actions/movieActions";
import { MOVIE_CREATE_RESET } from "../redux/constants/MovieConstants";
function MovieCreate({ history }) {
  const [name, setName] = useState("");
  const [year, setYear] = useState(0);

  const [torrent, setTorrent] = useState("");
  const [image, setImage] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [uploading, setUploading] = useState(false);

  const dispatch = useDispatch();
  const movieCreate = useSelector((state) => state.movieCreate);
  const { success, loading, error } = movieCreate;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const uploadHandler = (e) => {
    const file = e.target.files[0];

    setUploading(true);
    try {
      setImage(file);
      setUploading(false);
    } catch (error) {
      setUploading(false);
    }
  };

  const createMovieHandler = (e) => {
    e.preventDefault();
    dispatch(
      createMovie({ name, image, torrent, description, year, category })
    );
  };
  useEffect(() => {
    if (!userInfo) {
      history.push("/");
    }
    if (success) {
      history.push(`/profile`);
    } else {
      dispatch({ type: MOVIE_CREATE_RESET });
    }
  }, [success, history, dispatch, userInfo]);

  return (
    <div>
      {loading ? (
        <Loader />
      ) : error ? (
        <Msg variant="danger">{error}</Msg>
      ) : (
        <Container>
          <Card className="text-center">
            <Card.Header>Create</Card.Header>

            <Card.Body>
              <Container>
                <Form onSubmit={createMovieHandler}>
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

                  <Form.Group controlId="image">
                    <Form.Label>Image</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="enter image"
                      value={image}
                      onChange={(e) => setImage(e.target.value)}
                    ></Form.Control>

                    <input
                      className="form-control mr-sm-2"
                      id="image-file"
                      type="file"
                      label="choose image"
                      onChange={uploadHandler}
                    />
                    {uploading && <Loader />}
                  </Form.Group>

                  <Form.Group controlId="torrent">
                    <Form.Label>torrent</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="enter torrent"
                      value={torrent}
                      onChange={(e) => setTorrent(e.target.value)}
                    ></Form.Control>

                    <input
                      id="torrent-file"
                      className="form-control mr-sm-2"
                      type="file"
                      label="choose file"
                      onChange={(e) => setTorrent(e.target.files[0])}
                    />

                    {uploading && <Loader />}
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
                </Form>{" "}
              </Container>
            </Card.Body>
          </Card>
        </Container>
      )}
    </div>
  );
}

export default MovieCreate;
