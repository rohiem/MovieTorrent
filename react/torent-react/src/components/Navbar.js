import React, { useState } from "react";
import {
  Container,
  Navbar,
  Nav,
  // NavDropdown,
  Button,
} from "react-bootstrap";
import Login from "../screens/Login";
import { logout } from "../redux/actions/userActions";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Search from "../components/Search";
function NavBar() {
  const [modalShow, setModalShow] = useState(false);
  const dispatch = useDispatch();
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const logoutUser = () => {
    dispatch(logout());
  };
  return (
    <header>
      <Navbar bg="light" expand="lg">
        <Container>
          <Navbar.Brand>
            <Link to="/">Movie Torrent</Link>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="container-fluid">
              <Link to="/">
                <Nav.Link>
                  {" "}
                  <Link to="/">Home </Link>
                </Nav.Link>
              </Link>{" "}
              <Nav.Link>
                <Link to="/create">ceateMovie</Link>
              </Nav.Link>
              <Nav.Link>
                <Link to="/browse">BrowseMovie </Link>
              </Nav.Link>
              <Nav.Item>
                <Search />
              </Nav.Item>
              {/*               <NavDropdown title="Dropdown" id="basic-nav-dropdown">
                <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
                <NavDropdown.Item href="#action/3.2">
                  Another action
                </NavDropdown.Item>
                <NavDropdown.Item href="#action/3.3">
                  Something
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item href="#action/3.4">
                  Separated link
                </NavDropdown.Item>
              </NavDropdown> */}
              {userInfo ? (
                <>
                  <Nav.Link className="ml-auto">
                    {" "}
                    {/*                     <Link to="/profile">{userInfo.user.username} </Link>
                     */}{" "}
                  </Nav.Link>
                  <Button
                    className="btn btn-info btn-sm waves-effect waves-light float-left"
                    onClick={logoutUser}
                  >
                    logout
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    className="btn btn-info btn-sm waves-effect waves-light float-left ml-auto"
                    onClick={() => setModalShow(true)}
                  >
                    login
                  </Button>
                  <Login show={modalShow} onHide={() => setModalShow(false)} />
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
}

export default NavBar;
