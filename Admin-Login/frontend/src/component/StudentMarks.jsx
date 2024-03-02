// App.js
import "./Students.css";
import { useEffect, useState } from "react";
import Axios from "axios";
import { v4 as uuidv4 } from 'uuid';
import { useNavigate,useParams  } from "react-router-dom";

function StudentMarks() {
  const [reactjs, setreactjs] = useState(0);
  const [nodejs, setnodejs] = useState(0);
  const [reactnative, setreactnative] = useState(0);
  const [figma, setfigma] = useState(0);
  const navigate = useNavigate();
  const {id} = useParams();

  const [employeeList, setEmployeeList] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const clearForm = () => {
    setreactjs("");
    setnodejs("");
    setreactnative("");
    setfigma("");
    setSelectedEmployee(null);
  };
  const addEmployee = async() => {
    Axios.post("http://localhost:8000/marks", {
      id:uuidv4(),
      studentId:id,
      reactjs: reactjs,
      nodejs: nodejs,
      reactNative: reactnative,
      figma: figma,
    }).then(() => {
      getEmployees();
      clearForm();
    });
  };

  const getEmployees = () => {
    Axios.get(`http://localhost:8000/marks/${id}`).then((response) => {
      setEmployeeList(response.data);
    });
  };

const updateEmployeeWage = (employee) => {
    setSelectedEmployee(employee);
    setreactjs(employee.reactjs);
    setnodejs(employee.nodejs);
    setreactnative(employee.reactNative);
    setfigma(employee.figma);
  };

  const submitUpdatedEmployee = () => {
    Axios.put(`http://localhost:8000/marks/${selectedEmployee.id}`, {
      studentId:id,
      reactjs: reactjs,
      nodejs: nodejs,
      reactNative: reactnative,
      figma: figma,
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

 

  const deleteEmployee = (ids) => {
    Axios.delete(`http://localhost:8000/marks/${ids}`).then((response) => {
      setEmployeeList(
        employeeList.filter((val) => {
          return val.id !== ids;
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
          <label style={{fontSize:"18px",fontWeight:600}}>Add Students Marks:</label>
        }
        {selectedEmployee &&
          <label style={{fontSize:"18px",fontWeight:600}}>Edit Students Marks:</label>
        }
        <label>React Js:</label>
        <input
          type="number"
          className="input-long"
          value={reactjs}
          onChange={(event) => {
            setreactjs(event.target.value);
          }}
        />
        <label>Node js:</label>
        <input
        type="number"
          value={nodejs}
          onChange={(event) => {
            setnodejs(event.target.value);
          }}
        />
        <label>React Native:</label>
        <input
          type="number"
          value={reactnative}
          onChange={(event) => {
            setreactnative(event.target.value);
          }}
        />
        <label>Figma:</label>
        <input
          type="text"
          value={figma}
          onChange={(event) => {
            setfigma(event.target.value);
          }}
        />
         {selectedEmployee && (
          <button onClick={submitUpdatedEmployee}>Update Student Mark</button>
        )}
        {!selectedEmployee && (
          <button onClick={addEmployee}>Add Student Mark</button>
        )}
      </div>
      <div className="employees">
        <table className="employee-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>React Js</th>
              <th>Node Js</th>
              <th>React Native</th>
              <th>Figma</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {employeeList.map((val, key) => (
              <tr key={key}>
                <td>{val.name}</td>
                <td>{val.reactjs}</td>
                <td>{val.nodejs}</td>
                <td>{val.reactNative}</td>
                <td>{val.figma}</td>
                <td>
                  <button onClick={() => updateEmployeeWage(val)}>
                    Update
                  </button>
                  <button onClick={() => deleteEmployee(val.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default StudentMarks;
