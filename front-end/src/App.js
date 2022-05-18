import {Fragment, useState} from "react";
import {Container,Row,Button,Col,Form, Alert} from "react-bootstrap";
import CodeEditor from '@uiw/react-textarea-code-editor';
import axios from "axios";

function App() {

  const [code, setCode] = useState("");
  const [result, setResult] = useState("");
  const [title, setTitle] = useState("");
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);

  const submitCode = (e) => {
    e.preventDefault();

    if (code && title) {
      setSuccess(true);
      setError(false);

      const formData = new FormData();
      formData.append("title", title)
      formData.append("code", code);

      axios.post("/api/submit", formData, {headers: {"Content-Type": "multipart/form-data"}})
        .then((response)=>{
          //console.log(response);
          //setResult(response)
        })
        .catch((error)=>{
          //console.log(error)
        })

    } else {
      setSuccess(false);
      setError(true);
    }
  }

  return (
    <div className="App">
      <Container style={{padding: "5rem", height: "100vh"}}>
        <Row style={{height: "100%"}}>
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
      </Container>
    </div>
  );
}

export default App;
