import { Fragment, useEffect, useState } from 'react';
import { Table } from 'react-bootstrap';
import axios from 'axios';

const Statistics = () => {
  const [doneApps, setDoneApps] = useState([]);
  const [runningApps, setRunningApps] = useState([]);

  const statsRunning = [
    {
      id: 'application_1653992905362_0020',
      name: '',
      attempts: [
        {
          attemptId: '1',
          startTime: '2022-06-03T12:32:20.351GMT',
          endTime: '1969-12-31T23:59:59.999GMT',
          lastUpdated: '2022-06-03T12:32:27.278GMT',
          duration: 0,
          sparkUser: 'hadoop',
          completed: false,
          appSparkVersion: '3.2.1',
          startTimeEpoch: 1654259540351,
          endTimeEpoch: -1,
          lastUpdatedEpoch: 1654259547278,
        },
      ],
    },
  ];
  const statsDone = [
    {
      id: 'application_1653393292774_0001',
      name: 'PythonPi',
      attempts: [
        {
          attemptId: '1',
          startTime: '2022-05-31T08:41:10.381GMT',
          endTime: '2022-05-31T08:41:45.197GMT',
          lastUpdated: '2022-05-31T08:41:45.291GMT',
          duration: 34816,
          sparkUser: 'hadoop',
          completed: true,
          appSparkVersion: '3.2.1',
          startTimeEpoch: 1653986470381,
          endTimeEpoch: 1653986505197,
          lastUpdatedEpoch: 1653986505291,
        },
      ],
    },
    {
      id: 'application_1653992905362_0017',
      name: '',
      attempts: [
        {
          attemptId: '1',
          startTime: '2022-06-03T08:24:49.966GMT',
          endTime: '2022-06-03T08:25:52.235GMT',
          lastUpdated: '2022-06-03T08:25:52.321GMT',
          duration: 62269,
          sparkUser: 'hadoop',
          completed: true,
          appSparkVersion: '3.2.1',
          startTimeEpoch: 1654244689966,
          endTimeEpoch: 1654244752235,
          lastUpdatedEpoch: 1654244752321,
        },
      ],
    },
  ];

  useEffect(() => {
    //   setDoneApps(axios.get(process.env.SPARK_MONITOR + '/api/v1/applications'));
    //   setRunningApps(axios.get(process.env.SPARK_MONITOR + '/api/v1/applications?status=running'));
    setDoneApps(statsDone);
    return () => {};
  }, []);

  return (
    <Fragment>
      <h3>Statistics</h3>
      {statsDone.length > 0 ? (
        <div>
          <h5>Running</h5>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Start Time</th>
                <th>Status</th>
              </tr>
            </thead>

            {statsDone
              ? doneApps.map((app) => {
                  return (
                    <tbody>
                      <td>{app.id}</td>
                      <td>{app.name ? app.name : 'N/A'}</td>
                      <td>{app.attempts[0].startTime}</td>
                      <td>
                        {app.attempts[0].completed ? 'Completed' : 'Running'}
                      </td>
                    </tbody>
                  );
                })
              : null}
          </Table>
        </div>
      ) : null}
      {statsDone.length > 0 ? (
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

            {statsDone
              ? doneApps.map((app) => {
                  return (
                    <tbody>
                      <td>{app.id}</td>
                      <td>{app.name ? app.name : 'N/A'}</td>
                      <td>{app.attempts[0].startTime}</td>
                      <td>{app.attempts[0].endTime}</td>
                      <td>
                        {app.attempts[0].completed ? 'Completed' : 'Running'}
                      </td>
                    </tbody>
                  );
                })
              : null}
          </Table>
        </div>
      ) : null}
    </Fragment>
  );
};

export default Statistics;
