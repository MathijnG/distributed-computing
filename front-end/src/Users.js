import {Fragment} from "react";
import {Table} from "react-bootstrap";

const Users = () => {
    return (
        <Fragment>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Email</th>
                  <th>Username</th>
                  <th>Role</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Mark</td>
                  <td>Otto</td>
                  <td>@mdo</td>
                </tr>
                <tr>
                  <td>Jacob</td>
                  <td>Thornton</td>
                  <td>@fat</td>
                </tr>
                <tr>
                  <td>3</td>
                  <td>Jacob</td>
                  <td>@twitter</td>
                </tr>
              </tbody>
            </Table>
        </Fragment>
    )
}

export default Users;