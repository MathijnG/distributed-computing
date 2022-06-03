import React, { useState, useRef } from 'react';
import axios from 'axios';
import { Button } from 'bootstrap';

const FileHandle = () => {
  const [file, setFile] = useState();
  const fileRef = useRef(null);

  const handleUpload = (event) => {
    event.preventDefault();
    setFile(event.target.files[0]);
    const formData = new FormData();
    formData.append(file);

    axios
      .post('http://localhost:5000/api/file', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div>
      <input type="file" onChange={handleUpload} />
      <Button type="submit" variant="dark" style={{ width: '30%' }}></Button>
    </div>
  );
};

export default FileHandle;
