import {useEffect, useState, Fragment} from "react";
import Home from "./Home";
import Login from "./Login";
import Users from "./Users";
import {Navbar, Container, NavDropdown, Nav, Row} from "react-bootstrap";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import jwt_decode from "jwt-decode";

function App() {

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showUsers, setShowUsers] = useState(false);
  const [role, setRole] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");

  useEffect(()=>{
    const token = localStorage.getItem("token");
    if (token) {
      try {
        let decodedToken = jwt_decode(token);
        setRole(decodedToken.role);
        setUsername(decodedToken.username);
        setEmail(decodedToken.email);

        setIsLoggedIn(true);
      } catch (error) {
        setIsLoggedIn(false);
      }
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
                {role === "Admin" && <Nav.Link onClick={()=>setShowUsers(true)}>Users</Nav.Link>}
              </Nav>
              <Nav>
                <Nav.Link onClick={()=>logout()}>{username}, Logout</Nav.Link>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      }

      <Container style={{paddingTop: "5rem", height: "90vh"}}>
        <Row>
          {isLoggedIn ? 
            <Fragment>
              {showUsers ? 
                <Users role={role} userEmail={email} />
                :
                <Home role={role} />
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
