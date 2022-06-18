import {Fragment, useEffect, useState} from "react";
import {Container,Row,Button,Col,Form, Alert} from "react-bootstrap";
import axios from "axios";
import LoadingIcon from "./loading.svg"
import Statistics from "./Statistics";
import { handleError } from "./errors";
import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/themes/prism.css';

const Home = ({role}) => {

    const [code, setCode] = useState("");
    const [result, setResult] = useState("");
    const [title, setTitle] = useState("");
    const [file, setFile] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [showFileUpload, setShowFileUpload] = useState(true);

    const submitCode = (e) => {
      e.preventDefault();
  
      if (code && title) {
        const formData = new FormData();
        formData.append("Title", title)
        formData.append("PythonCode", code);
  
        setIsLoading(true);
  
        axios.post(process.env.REACT_APP_BACKEND + "/api/Code/push", formData, {headers: {"Content-Type": "multipart/form-data"}})
          .then((response)=>{
            setIsLoading(false);
            setResult(response.data);
          })
          .catch((error)=>{
            setIsLoading(false);
            handleError(error)
          })
  
      } else {
        handleError("Fill in all the fields to submit this code.")
      }
    }
    
    const handleUpload = (event) => {
      event.preventDefault();
      if (file) {
        const formData = new FormData();
        formData.append('file', file);

        setIsLoading(true);

        axios
          .post(process.env.REACT_APP_BACKEND + '/api/File/upload', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
          })
          .then((response) => {
            setIsLoading(false);
            setResult(response.data);
          })
          .catch((error) => {
            setIsLoading(false);
            handleError(error)
          });
      } else {
        handleError("Add a python file to this form.")
      }
    };

    const handleToggle = () => {
      setShowFileUpload(!showFileUpload);
    }

    return (
        <Fragment>
          {role !== "Reader" && 
            <Fragment>
              {isLoading ?
                <Container style={{padding: "5rem"}}>
                  <img className="mb-3" src={LoadingIcon} alt="loading icon" />
                  <p>Your code is running on our cluster.</p>
                  <p>Once your code has been run the results will be shown here.</p>
                </Container>
              :
                <Container >
                  <Row>
                    <Col style={{display: "flex", textAlign: "center", justifyContent: "center"}}>
                      <p>File upload</p><Form.Check style={{fontSize: "20px"}} onClick={handleToggle} type="switch"/><p>Code upload</p>
                    </Col>
                  </Row>

                  {showFileUpload ? 
                    <Row style={{textAlign: "center"}}>
                      <Col style={{padding: "3rem", margin: "auto"}}>
                        <h1>Distributed computing</h1>
                        <p>The python code you submit will be distributed on a cluster of several workstations to improve performance.</p>
                        <Form>
                        <Form.Group className="mb-3">
                          <Form.Control className="mb-4" placeholder="Enter script title here" type="text" value={title} onChange={(e)=>{setTitle(e.target.value)}} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                          <Form.Control type="file" onChange={(e) => setFile(e.target.files[0])} />
                        </Form.Group>
                        <div>
                          <Button type="submit" variant="dark" style={{width:"30%"}} onClick={(e) => handleUpload(e)}>Submit</Button>
                        </div>
                        </Form>
                      </Col>
                    </Row>
                    :
                    <Row style={{textAlign: "center"}}>
                    <Col style={{padding: "3rem", margin: "auto"}}>
                      <h1>Distributed computing</h1>
                      <p>The python code you submit will be distributed on a cluster of several workstations to improve performance.</p>
                      <Form>
                        <Form.Group className="mb-3">
                          <Form.Control className="mb-4" placeholder="Enter script title here" type="text" value={title} onChange={(e)=>{setTitle(e.target.value)}} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                          <Editor
                            value={code}
                            highlight={code => highlight(code, languages.js)}
                            placeholder="Enter python code here"
                            onChange={(e) => setCode(e.target.value)}
                            padding={15}
                            style={{
                              fontFamily: '"Fira code", "Fira Mono", monospace',
                              fontSize: 15,
                              backgroundColor: "#F4F4F4",
                              borderRadius: "10px"
                            }}
                          />
                        </Form.Group>
                        <div>
                          <Button type="submit" variant="dark" style={{width:"30%"}} onClick={(e)=>submitCode(e)}>Submit</Button>
                        </div>
                      </Form>
                      </Col>
                    </Row>
                  }
                  {result &&
                    <Fragment>
                      <h3 className="mt-5 mb-3">Results</h3>
                      <Editor
                            value={result}
                            highlight={result => highlight(result, languages.js)}
                            padding={15}
                            style={{
                              fontFamily: '"Fira code", "Fira Mono", monospace',
                              fontSize: 15,
                              backgroundColor: "#F4F4F4",
                              borderRadius: "10px"
                            }}
                          />
                    </Fragment>
                  }
                </Container>
              }
            </Fragment>
          }
        <Statistics />
        </Fragment>
    )
}

export default Home;