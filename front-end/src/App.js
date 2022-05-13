import {useEffect, useState} from "react";
import {Container,Row,Button,Col,Form} from "react-bootstrap";
import CodeEditor from '@uiw/react-textarea-code-editor';
import axios from "axios";

function App() {

  const [selectedFile, setSelectedFile] = useState(null);

  const submitCode = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("selectedFile", selectedFile);

    axios.post("/api/submit", formData, {headers: {"Content-Type": "multipart/form-data"}})
      .then((response)=>{
        //console.log(response);
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
      <Container style={{padding: "5rem"}}>
        <Row>
          <Col style={{padding: "3rem"}}>
              <p>The code you submit will be distributed on a cluster of several workstations to improve performance.</p>
              <Form>
                <Form.Group className="mb-3">
                  <Form.Control type="file" accept=".py" onChange={handleFileSelect} />
                </Form.Group>
                <div>
                  <Button type="submit" variant="dark" style={{width:"30%"}} onClick={(e)=>submitCode(e)}>Submit to cluster</Button>
                </div>
              </Form>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default App;
