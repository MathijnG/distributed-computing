import {Fragment, useEffect, useState} from "react";
import {Table, Dropdown, Button, Form, Modal, DropdownButton} from "react-bootstrap";
import { handleError, handleSuccess } from "./errors";
import axios from "axios";

const Users = ({role, userEmail}) => {
    
    const [show, setShow] = useState(false);
    const [users, setUsers] = useState(null);
    const [roles, setRoles] = useState(null);

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

        console.log(userEmail);

        if (role === "Admin") {
          fetchRoles();
          fetchUsers();
        }
    },[role])

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

                if(response.data.success === false) {
                   handleError(response.data.message);
                } else {
                  handleSuccess("Created new user successfully!");
                }

                fetchUsers();
              })
              .catch((error)=>{
                console.log(error)
              })
        } else {
            handleError("Please fill in all the fields!")
        }
    }

    const fetchUsers = () => {
      axios.get(process.env.REACT_APP_BACKEND + "/api/Authentication/users", 
        {headers: {"Authorization": "Bearer " + localStorage.getItem("token")}})
           .then((response) => {
               setUsers(response.data);
           })
           .catch((error) => {
               handleError(error.message);
           })
    }

    const fetchRoles = () => {
      axios.get(process.env.REACT_APP_BACKEND + "/api/Authentication/roles", 
        {headers: {"Authorization": "Bearer " + localStorage.getItem("token")}})
           .then((response) => {
               setRoles(response.data);
           })
           .catch((error) => {
               handleError(error.message);
           })
    }

    const updateRole = (role, email) => {
      axios.post(process.env.REACT_APP_BACKEND + "/api/Authentication/updaterole", {email: email, role: role},
        {headers: {"Authorization": "Bearer " + localStorage.getItem("token")}})
          .then((response) => {
            fetchUsers();
            handleSuccess("Updated role successfully!")
          })
          .catch((error) => {
            handleError("Failed to update role.")
          })
    }

    return (
        <Fragment>

            <Modal show={show} onHide={handleClose} centered size="lg">
                <Form onSubmit={Signup}>
              <Modal.Header closeButton>
                <Modal.Title>Create new user</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                
                    <Form.Group className="mb-3">
                      <Form.Label>Email address *</Form.Label>
                      <Form.Control value={email} onChange={(e)=>{setEmail(e.target.value)}} type="email" placeholder="Enter email" />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Username *</Form.Label>
                      <Form.Control value={username} onChange={(e)=>{setUsername(e.target.value)}} type="text" placeholder="Enter username" />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Password *</Form.Label>
                      <Form.Control value={password} onChange={(e)=>{setPassword(e.target.value)}} type="password" placeholder="Password" />
                    </Form.Group>

                    <Form.Group className="mb-3">
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
                    users.map((user,i) => {
                        return (
                            <Fragment key={i}>
                                <tr>
                                    <td>{user.email}</td>
                                    <td>{user.username}</td>
                                    <td>
                                        <Dropdown onSelect={(key, e)=>{updateRole(e.target.attributes.eventkey.value, user.email)}}>
                                          <Dropdown.Toggle disabled={userEmail === user.email} variant="primary">
                                              {user.role}
                                          </Dropdown.Toggle>
                                           <Dropdown.Menu>
                                              {roles.map((role, i) => 
                                                <Dropdown.Item key={i} eventkey={role}>{role}</Dropdown.Item>
                                              )}
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