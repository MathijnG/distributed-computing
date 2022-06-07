import {Fragment, useEffect, useState} from "react";
import {Button, Form, Row, Container, Col} from "react-bootstrap";
import axios from "axios";
import {handleError} from "./errors";

const Login = ({changeLogin}) => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const Login = (e) => {
        e.preventDefault();
    
        if (email && password) {
          axios.post(process.env.REACT_APP_BACKEND + "/api/Authentication/signin", {Email: email, Password: password})
            .then((response)=>{
              console.log(response);
              localStorage.setItem("token", response.data.token)
              changeLogin(true);
            })
            .catch((error)=>{
                handleError(error.message);
            })
        } else {
            handleError("Please fill in all the fields!");
        }
      }

    return (
        <Fragment>
            <Col>
                <h1>Distributed computing</h1>
                <Form onSubmit={Login}>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                      <Form.Label>Email address *</Form.Label>
                      <Form.Control value={email} onChange={(e)=>{setEmail(e.target.value)}} type="email" placeholder="Enter email" />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicPassword">
                      <Form.Label>Password *</Form.Label>
                      <Form.Control value={password} onChange={(e)=>{setPassword(e.target.value)}} type="password" placeholder="Password" />
                    </Form.Group>
                    <Button variant="primary" type="submit">
                      Submit
                    </Button>
                </Form>
            </Col>
        </Fragment>
    )
}

export default Login;