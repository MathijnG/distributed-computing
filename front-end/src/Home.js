import {Fragment, useEffect, useState} from "react";
import {Container,Row,Button,Col,Form, Alert} from "react-bootstrap";
import CodeEditor from '@uiw/react-textarea-code-editor';
import axios from "axios";
import LoadingIcon from "./loading.svg"
import Statistics from "./Statistics";

const Home = ({role}) => {

    const [code, setCode] = useState("");
    const [result, setResult] = useState("");
    const [title, setTitle] = useState("");
    const [error, setError] = useState(false);
    const [file, setFile] = useState(null);
    const [success, setSuccess] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [showFileUpload, setShowFileUpload] = useState(true);

    const submitCode = (e) => {
      e.preventDefault();
  
      if (code && title) {
        setSuccess(true);
        setError(false);
  
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
            console.log(error)
          })
  
      } else {
        setSuccess(false);
        setError(true);
      }
    }
    
    const handleUpload = (event) => {
      event.preventDefault();
      console.log(file);
      const formData = new FormData();
      formData.append('file', file);
      // console.log(file);
      axios
        .post(process.env.REACT_APP_BACKEND + '/api/File/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })
        .then((response) => {
          console.log(response);
        })
        .catch((error) => {
          console.log(error);
        });
    };

    const handleToggle = () => {
      console.log("toggle");
    }

    return (
        <Fragment>
          {role !== "Reader" && 
            <Fragment>
          {isLoading ?
                <Container style={{padding: "5rem", height: "100vh"}}>
                  <img className="mb-3" src={LoadingIcon} />
                  <p>Your code is running on our cluster, this could take 2-10 minutes.</p>
                  <p>Once your code has been run the results will be shown here.</p>
                </Container>
              :
                <Container >
                  <Row>
                    <Col style={{display: "flex", textAlign: "center", justifyContent: "center"}}>
                      <p>Code upload</p><Form.Check style={{fontSize: "20px"}} onClick={handleToggle} type="switch"/><p>File upload</p>
                    </Col>
                  </Row>

                  {showFileUpload ? 
                    <Row style={{textAlign: "center"}}>
                    <Col style={{padding: "3rem", margin: "auto"}}>
                      
                    </Col>
                    </Row>
                    :
                    <Row style={{textAlign: "center"}}>
                    <Col style={{padding: "3rem", margin: "auto"}}>
                      <h1>Distributed computing</h1>
                      <p>The python code you submit will be distributed on a cluster of several workstations to improve performance.</p>
                      {error && 
                        <Alert dismissible onClose={() => setError(false)} variant="danger">The title or code field(s) are empty! Please fill in all the fields to submit your code.</Alert>
                      }
                      {success && 
                        <Alert dismissible onClose={() => setSuccess(false)} variant="success">The code has been submitted!</Alert>
                      }
                      <Form>
                        <Form.Group className="mb-3">
                          <Form.Control className="mb-4" placeholder="Enter script title here" type="text" value={title} onChange={(e)=>{setTitle(e.target.value)}} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                          <CodeEditor
                            value={code}
                            language="python"
                            placeholder="Enter python code here"
                            onChange={(e) => setCode(e.target.value)}
                            padding={15}
                            style={{
                              borderRadius: 6,
                              fontSize: 15,
                              backgroundColor: "#1C1B22",
                              fontFamily: 'ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace',
                              marginBottom: "1rem"
                            }}
                          />
                        </Form.Group>
                        <div>
                          <Button type="submit" variant="dark" style={{width:"30%"}} onClick={(e)=>submitCode(e)}>Submit</Button>
                        </div>
                      </Form>
                      {result &&
                        <Fragment>
                          <h1 className="mt-5 mb-3">Results</h1>
                          <CodeEditor
                            value={result}
                            language="python"
                            padding={15}
                            style={{
                              borderRadius: 6,
                              fontSize: 15,
                              backgroundColor: "#1C1B22",
                              fontFamily: 'ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace',
                              marginBottom: "1rem"
                            }}
                          />
                        </Fragment>
                      }
                      </Col>
                    </Row>
                  }

                  
                          
                      
                </Container>}
              </Fragment>}
        <Statistics />
        </Fragment>
    )
}

export default Home;