// App.js
import "./Students.css";
import { useEffect, useState } from "react";
import Axios from "axios";
import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from "react-router-dom";

function Students() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phonenumber, setphonenumber] = useState("");
  const [dob, setdob] = useState("");
  const navigate = useNavigate();

  const [employeeList, setEmployeeList] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const clearForm = () => {
    setName("");
    setEmail("");
    setphonenumber("");
    setdob("");
    setSelectedEmployee(null);
  };
  const addEmployee = async() => {
    Axios.post("http://localhost:8000/students", {
      id:uuidv4(),
      name: name,
      email: email,
      phoneNumber: phonenumber,
      dob: dob,
    }).then(() => {
      getEmployees();
      clearForm();
    });
  };

  const getEmployees = () => {
    Axios.get("http://localhost:8000/students").then((response) => {
      setEmployeeList(response.data);
    });
  };

const updateEmployeeWage = (employee) => {
    setSelectedEmployee(employee);
    setName(employee.name);
    setEmail(employee.email);
    setphonenumber(employee.phoneNumber);
    setdob(employee.dob);
  };

  const submitUpdatedEmployee = () => {
    Axios.put(`http://localhost:8000/students/${selectedEmployee.id}`, {
      name: name,
      email: email,
      phoneNumber: phonenumber,
      dob: dob,
    }).then((response) => {
      if (response.status === 200) {
        getEmployees();
        clearForm();
      } else {
        console.error("Error updating employee");
      }
    }).catch((error) => {
      console.error("Error updating employee:", error);
    });
  };

 

  const deleteEmployee = (id) => {
    Axios.delete(`http://localhost:8000/students/${id}`).then((response) => {
      setEmployeeList(
        employeeList.filter((val) => {
          return val.id !== id;
        })
      );
      getEmployees();
    });
  };

  useEffect(() => {
    getEmployees()
  }, []);

  return (
    <div className="App">
      <div className="form-container">
        {!selectedEmployee &&
          <label style={{fontSize:"18px",fontWeight:600}}>Add Students:</label>
        }
        {selectedEmployee &&
          <label style={{fontSize:"18px",fontWeight:600}}>Edit Students:</label>
        }
        <label>Name:</label>
        <input
          type="text"
          className="input-long"
          value={name}
          onChange={(event) => {
            setName(event.target.value);
          }}
        />
        <label>Email:</label>
        <input
          value={email}
          onChange={(event) => {
            setEmail(event.target.value);
          }}
        />
        <label>Phonenumber:</label>
        <input
          type="number"
          value={phonenumber}
          onChange={(event) => {
            setphonenumber(event.target.value);
          }}
        />
        <label>dob:</label>
        <input
          type="text"
          value={dob}
          onChange={(event) => {
            setdob(event.target.value);
          }}
        />
         {selectedEmployee && (
          <button onClick={submitUpdatedEmployee}>Update Student</button>
        )}
        {!selectedEmployee && (
          <button onClick={addEmployee}>Add Student</button>
        )}
      </div>
      <div className="employees">
        <table className="employee-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone Number</th>
              <th>dob</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {employeeList.map((val, key) => (
              <tr key={key}>
                <td>{val.name}</td>
                <td>{val.email}</td>
                <td>{val.phoneNumber}</td>
                <td>{val.dob}</td>
                <td>
                  <button onClick={() => updateEmployeeWage(val)}>
                    Update
                  </button>
                  <button onClick={() => deleteEmployee(val.id)}>Delete</button>
                  <button onClick={() => navigate(`/mark/${val.id}`)}>
                    Add Mark
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Students;
