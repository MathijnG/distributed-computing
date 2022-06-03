import {useEffect, useState, Fragment} from "react";
import Home from "./Home";
import Login from "./Login";
import Users from "./Users";
import {Navbar, Container, NavDropdown, Nav, Row} from "react-bootstrap";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showUsers, setShowUsers] = useState(false);

  useEffect(()=>{
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, [isLoggedIn])

  const changeLogin = (value) => {
    setIsLoggedIn(value);
  }

  const logout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem("token");
  }

  return (
    <div className="App">

      <ToastContainer />

      {isLoggedIn && 
        <Navbar bg="light" expand="lg">
          <Container>
            <Navbar.Brand>Distributed computing</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="me-auto">
                <Nav.Link onClick={()=>setShowUsers(false)}>Home</Nav.Link>
                <Nav.Link onClick={()=>setShowUsers(true)}>Users</Nav.Link>
              </Nav>
              <Nav>
                <Nav.Link onClick={()=>logout()}>Logout</Nav.Link>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      }

      <Container style={{paddingTop: "5rem", height: "100vh"}}>
        <Row style={{height: "100%"}}>
          {isLoggedIn ? 
            <Fragment>
              {showUsers ? 
                <Users />
                :
                <Home />
              }
            </Fragment>
            :
            <Login changeLogin={changeLogin} />
          }
        </Row>
      </Container>

      
    </div>
  );
}

export default App;
