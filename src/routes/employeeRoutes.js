const express = require("express");
const router = express.Router();
const employeeController = require("../models/employee");

// Create Employee
router.post("/employees", async (req, res) => {
  try {
    const employee = await employeeController.createEmployee(req.body);
    res.status(201).json(employee);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get All Employees
router.get("/employees", async (req, res) => {
  try {
    const employees = await employeeController.getAllEmployees();
    res.json(employees);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get Employee by ID
router.get("/employees/:id", async (req, res) => {
  try {
    const employee = await employeeController.getEmployeeById(req.params.id);
    if (!employee) return res.status(404).json({ error: "Employee not found" });
    res.json(employee);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update Employee
router.put("/employees/:id", async (req, res) => {
  try {
    const updatedEmployee = await employeeController.updateEmployee(
      req.params.id,
      req.body
    );
    res.json(updatedEmployee);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete Employee
router.delete("/employees/:id", async (req, res) => {
  try {
    const deletedEmployee = await employeeController.deleteEmployee(req.params.id);
    res.json(deletedEmployee);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;