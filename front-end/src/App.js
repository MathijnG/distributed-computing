import {useState} from "react";
import {Container,Row,Button,Col,Form} from "react-bootstrap";
import CodeEditor from '@uiw/react-textarea-code-editor';
import axios from "axios";

function App() {

  const [code, setCode] = useState("");

  const submitCode = () => {
    axios.post("/api/submit", {code: code})
      .then((response)=>{
        console.log(response);
      })
      .catch((error)=>{
        console.log(error)
      })
  }

  return (
    <div className="App">
      <Container style={{padding: "5rem"}}>
        <Row>
          <Col style={{padding: "3rem"}}>
            
              {/* <CodeEditor
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
              /> */}

              <Form.Group className="mb-3">
                <Form.Control type="file" />
              </Form.Group>

              <div>
                <Button variant="dark" style={{width:"30%"}} onClick={()=>submitCode()}>Submit to cluster</Button>
              </div>
            
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default App;
