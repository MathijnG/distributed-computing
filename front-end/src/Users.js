import {Fragment} from "react";
import {Table, Dropdown} from "react-bootstrap";

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
                  <td>test@email.com</td>
                  <td>TestUser1</td>
                  <td>
                      <Dropdown>
                        <Dropdown.Toggle variant="primary">
                          Admin
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                          <Dropdown.Item>Reader</Dropdown.Item>
                          <Dropdown.Item>Writer</Dropdown.Item>
                          <Dropdown.Item>Admin</Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                  </td>
                </tr>
                <tr>
                  <td>test@email.com</td>
                  <td>TestUser2</td>
                  <td>
                      <Dropdown>
                        <Dropdown.Toggle variant="primary">
                        Writer
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                          <Dropdown.Item>Reader</Dropdown.Item>
                          <Dropdown.Item>Writer</Dropdown.Item>
                          <Dropdown.Item>Admin</Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                  </td>
                </tr>
                <tr>
                  <td>test@email.com</td>
                  <td>TestUser3</td>
                  <td>
                      <Dropdown>
                        <Dropdown.Toggle variant="primary">
                          Reader
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                          <Dropdown.Item>Reader</Dropdown.Item>
                          <Dropdown.Item>Writer</Dropdown.Item>
                          <Dropdown.Item>Admin</Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                  </td>
                </tr>
              </tbody>
            </Table>
        </Fragment>
    )
}

export default Users;