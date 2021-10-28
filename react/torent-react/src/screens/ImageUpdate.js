import React, { useEffect, useState } from "react";
import { Form, Button, Container, Card } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../components/Loader";
import Msg from "../components/Msg";
import { getMovieDetail } from "../redux/actions/movieActions";
import { MOVIE_UPDATE_RESET } from "../redux/constants/MovieConstants";
import axios from "axios";
function ImageUpdate({ history, match }) {
  const [torrent, setTorrent] = useState("");
  const [image, setImage] = useState("");
  const [uploading, setUploading] = useState(false);

  const slug = match.params.slug;

  const dispatch = useDispatch();
  const movieUpdate = useSelector((state) => state.movieUpdate);
  const { success, loading, error } = movieUpdate;

  const movieDetail = useSelector((state) => state.movieDetail);
  const { loading: loadingdetail, error: errordetail, movie } = movieDetail;
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;
  const uploadHandler = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("image", file);
    formData.append("movie_id", movie.id);
    setUploading(true);
    try {
      const config = {
        headers: {
          "content-type": "multipart/form-data",
          Authorization: `Bearer ${userInfo.access_token}`,
        },
      };
      const { data } = await axios.post("/api/upload_mage", formData, config);
      setImage(data);
      setUploading(false);
    } catch (error) {
      setUploading(false);
    }
  };

  const uploadTorrentHandler = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("torrent", file);
    formData.append("movie_id", movie.id);
    setUploading(true);
    try {
      const config = {
        headers: {
          "content-type": "multipart/form-data",
          Authorization: `Bearer ${userInfo.access_token}`,
        },
      };
      const { data } = await axios.post(
        "/api/upload_torrent",
        formData,
        config
      );
      setTorrent(data);
      setUploading(false);
    } catch (error) {
      setUploading(false);
    }
  };
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
      setTorrent(movie.torrent);
      setImage(movie.image);
    }
  }, [userInfo, history, movie, dispatch, slug, success]);
  const updateMovieHandler = () => {
    history.push("/profile");
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
                  <Form.Group controlId="image">
                    <Form.Label>Image</Form.Label> <br />
                    <a href={image}>{String(image)}</a>
                    {uploading && <Loader />}
                    <input
                      id="image-file"
                      type="file"
                      label="choose image"
                      onChange={uploadHandler}
                    />
                  </Form.Group>

                  <Form.Group controlId="torrent">
                    <Form.Label>torrent</Form.Label>
                    <br />
                    <a href={torrent}>{String(torrent)}</a>
                    {uploading && <Loader />}

                    <input
                      id="torrent-file"
                      type="file"
                      label="choose file"
                      onChange={uploadTorrentHandler}
                    />
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

export default ImageUpdate;
