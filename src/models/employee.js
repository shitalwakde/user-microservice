// const db = require("./db");
const { dynamoDB, tableName } = require("./db");
const uuid = require("uuid");

// Create Employee
const createEmployee = async (employee) => {
  const params = {
    TableName: tableName,
    Item: { id: uuid.v4(), ...employee },
  };
  await dynamoDB.put(params).promise();
  return params.Item;
};

// Get All Employees
const getAllEmployees = async () => {
  const params = { TableName: tableName };
  const result = await dynamoDB.scan(params).promise();
  return result.Items;
};

// Get Employee by ID
const getEmployeeById = async (id) => {
  const params = {
    TableName: tableName,
    Key: { id },
  };
  const result = await dynamoDB.get(params).promise();
  return result.Item;
};

// Update Employee
const updateEmployee = async (id, employee) => {
  const params = {
    TableName: tableName,
    Key: { id },
    UpdateExpression: "set #name = :name, #position = :position, #salary = :salary",
    ExpressionAttributeNames: {
      "#name": "name",
      "#position": "position",
      "#salary": "salary",
    },
    ExpressionAttributeValues: {
      ":name": employee.name,
      ":position": employee.position,
      ":salary": employee.salary,
    },
    ReturnValues: "ALL_NEW",
  };
  const result = await dynamoDB.update(params).promise();
  return result.Attributes;
};

// Delete Employee
const deleteEmployee = async (id) => {
  const params = {
    TableName: tableName,
    Key: { id },
  };
  await dynamoDB.delete(params).promise();
  return { id };
};

module.exports = {
  createEmployee,
  getAllEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
};