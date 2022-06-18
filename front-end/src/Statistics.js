import { Fragment, useEffect, useState } from 'react';
import { Table, Alert } from 'react-bootstrap';
import axios from 'axios';

const Statistics = () => {
  const [apps, setApps] = useState([]);
  const [temp, setTemp] = useState([]);
  const [data, setData] = useState([]);

  useEffect(() => {
    axios
      .get(process.env.REACT_APP_SPARK_MONITOR + '/api/v1/applications')
      .then((response) => setData(response.data));
  }, []);

  useEffect(() => {
    filterApps();
  }, [data]);

  const filterApps = () => {
    data.forEach((app) => {
      var index = data.indexOf(app);
      var newArray = [];
      if (!app.attempts[0].completed && !Array.from(temp).includes(app)) {
        // setTemp(...temp, app);
        temp.push(app);
        newArray = data.filter((i) => temp.includes(i));
        console.log(newArray);
      }
    });
    var final = [...temp, ...data];
    setApps(final);
  };

  const renderTable = () => {
    return apps.map((app) => {
      return (
        <tr>
          <td key={app.id}>{app.id}</td>
          <td key={app.name}>{app.name ? app.name : 'N/A'}</td>
          <td key={app.attempts[0].startTime}>{app.attempts[0].startTime}</td>
          <td key={app.attempts[0].endTime}>
            {app.attempts[0].completed ? app.attempts[0].endTime : 'N/A'}
          </td>
          <td key={app.attempts[0].completed}>
            {app.attempts[0].completed ? 'Completed' : 'Running'}
          </td>
        </tr>
      );
    });
  };

  return (
    <Fragment>
      <h3>Statistics</h3>
      {data.length > 0 ? (
        <div>
          <h5>Completed</h5>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Start Time</th>
                <th>End Time</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>{renderTable()}</tbody>
          </Table>
        </div>
      ) :
        <Alert>Unfortunately no data could be displayed here. Please try refreshing the page.</Alert>
      }
    </Fragment>
  );
};

export default Statistics;
