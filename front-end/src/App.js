import {useEffect, useState} from "react";
import {Container,Row,Button,Col,Form} from "react-bootstrap";
import CodeEditor from '@uiw/react-textarea-code-editor';
import axios from "axios";

function App() {

  const [code, setCode] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);

  const submitCode = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("selectedFile", selectedFile);

    axios.post("/api/submit", formData, {headers: {"Content-Type": "multipart/form-data"}})
      .then((response)=>{
        //console.log(response);
        //setCode(response)
      })
      .catch((error)=>{
        //console.log(error)
      })
  }

  const handleFileSelect = (e) => {
    setSelectedFile(e.target.files[0]);
  }

  return (
    <div className="App">
      <Container style={{padding: "5rem", height: "100vh"}}>
        <Row style={{height: "100%"}}>
          <Col style={{padding: "3rem", margin: "auto"}}>
              <h1>Distributed computing</h1>
              <p>The python code you submit will be distributed on a cluster of several workstations to improve performance.</p>
              <Form>
                <Form.Group className="mb-3">
                  <Form.Control type="file" accept=".py" onChange={handleFileSelect} />
                </Form.Group>
                <div>
                  <Button type="submit" variant="dark" style={{width:"30%"}} onClick={(e)=>submitCode(e)}>Submit</Button>
                </div>
              </Form>
              <h1 className="mt-5 mb-3">Results</h1>
              <CodeEditor
                value={code}
                language="python"
                placeholder="Please enter python code here."
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
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default App;
