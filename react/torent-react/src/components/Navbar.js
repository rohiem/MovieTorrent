import React, { useState } from "react";
import { Container, Navbar, Nav, NavDropdown, Button } from "react-bootstrap";
import Login from "../screens/Login";
import { logout } from "../redux/actions/userActions";
import { useDispatch, useSelector } from "react-redux";

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
          <Navbar.Brand href="#home">Movie Torrent</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link href="#home">Home</Nav.Link>
              <Nav.Link href="#link">Link</Nav.Link>
              <NavDropdown title="Dropdown" id="basic-nav-dropdown">
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
              </NavDropdown>
              {userInfo ? (
                <>
                  <Nav.Link href="/profile">{userInfo.user.username}</Nav.Link>
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
                    className="btn btn-info btn-sm waves-effect waves-light float-left"
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
