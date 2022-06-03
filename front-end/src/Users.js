import {Fragment, useEffect, useState} from "react";
import {Table, Dropdown, Button, Form, Modal} from "react-bootstrap";
import { handleError, handleSuccess } from "./errors";
import axios from "axios";

const Users = () => {
    
    const [show, setShow] = useState(false);
    const [users, setUsers] = useState(null);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    
    useEffect(()=>{

        // axios.post(process.env.REACT_APP_BACKEND + "/api/Authentication/validate", {
        //     Token: localStorage.getItem("token")
        // })
        //     .then((response) => {
        //         console.log(response)
        //     })
        //     .catch((error) => {
        //         handleError(error.message);
        //     })

        axios.get(process.env.REACT_APP_BACKEND + "/api/Authentication/users", 
        {headers: {"Authorization": "Bearer " + localStorage.getItem("token")}})
           .then((response) => {
               console.log(response);
               setUsers(response.data);
           })
           .catch((error) => {
               handleError(error.message);
           })
    },[])

    const Signup = (e) => {
        e.preventDefault();
  
        if (email && username && password && confirmPassword) {
            axios.post(process.env.REACT_APP_BACKEND + "/api/Authentication/signup", {
                Email: email,
                Username: username,
                Password: password,
                ConfirmPassword: confirmPassword
            },
            {headers: {"Authorization": "Bearer " + localStorage.getItem("token")}})
              .then((response)=>{
                handleSuccess("Created new user!");
                
                //TODO: refresh users
              })
              .catch((error)=>{
                console.log(error)
              })
        } else {
            handleError("Please fill in all the fields!")
        }
    }

    return (
        <Fragment>

            <Modal show={show} onHide={handleClose} centered size="lg">
                <Form onSubmit={Signup}>
              <Modal.Header closeButton>
                <Modal.Title>Create new user</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                      <Form.Label>Email address *</Form.Label>
                      <Form.Control value={email} onChange={(e)=>{setEmail(e.target.value)}} type="email" placeholder="Enter email" />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicEmail">
                      <Form.Label>Username *</Form.Label>
                      <Form.Control value={username} onChange={(e)=>{setUsername(e.target.value)}} type="text" placeholder="Enter username" />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicPassword">
                      <Form.Label>Password *</Form.Label>
                      <Form.Control value={password} onChange={(e)=>{setPassword(e.target.value)}} type="password" placeholder="Password" />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicPassword">
                      <Form.Label>Confirm password *</Form.Label>
                      <Form.Control value={confirmPassword} onChange={(e)=>{setConfirmPassword(e.target.value)}} type="password" placeholder="Confirm password" />
                    </Form.Group>
                
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                  Close
                </Button>
                <Button variant="primary" type="submit" onClick={handleClose}>
                  Save Changes
                </Button>
              </Modal.Footer>
              </Form>
            </Modal>

            <div className="mb-3">
                <Button style={{float: "right"}} onClick={()=>{handleShow()}}>New user</Button>
            </div>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Email</th>
                  <th>Username</th>
                  <th>Role</th>
                </tr>
              </thead>
              <tbody>
                  {users && 
                    users.map((user) => {
                        return (
                            <Fragment>
                                <tr>
                                    <td>{user.email}</td>
                                    <td>{user.username}</td>
                                    <td>
                                        <Dropdown>
                                        <Dropdown.Toggle variant="primary">
                                            {user.role}
                                        </Dropdown.Toggle>

                                        <Dropdown.Menu>
                                            <Dropdown.Item>Reader</Dropdown.Item>
                                            <Dropdown.Item>Writer</Dropdown.Item>
                                            <Dropdown.Item>Admin</Dropdown.Item>
                                        </Dropdown.Menu>
                                        </Dropdown>
                                    </td>
                                </tr>
                            </Fragment>
                        )
                    })
                  }
                
                {/* <tr>
                  <td>test@email.com</td>
                  <td>TestUser1</td>
                  <td>
                      <Dropdown>
                        <Dropdown.Toggle variant="primary">
                          Admin
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                          <Dropdown.Item>Reader</Dropdown.Item>
                          <Dropdown.Item>Writer</Dropdown.Item>
                          <Dropdown.Item>Admin</Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                  </td>
                </tr>
                <tr>
                  <td>test@email.com</td>
                  <td>TestUser2</td>
                  <td>
                      <Dropdown>
                        <Dropdown.Toggle variant="primary">
                        Writer
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                          <Dropdown.Item>Reader</Dropdown.Item>
                          <Dropdown.Itewm>Writer</Dropdown.Item>
                          <Dropdown.Item>Admin</Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                  </td>
                </tr>
                <tr>
                  <td>test@email.com</td>
                  <td>TestUser3</td>
                  <td>
                      <Dropdown>
                        <Dropdown.Toggle variant="primary">
                          Reader
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                          <Dropdown.Item>Reader</Dropdown.Item>
                          <Dropdown.Item>Writer</Dropdown.Item>
                          <Dropdown.Item>Admin</Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                  </td>
                </tr> */}
              </tbody>
            </Table>
        </Fragment>
    )
}

export default Users;