const Employee = require("../models/Employee");

const employeeResolvers = {
  Query: {
    async getAllEmployees() {
      return await Employee.find();
    },
    async getEmployeeById(_, { id }) {
      return await Employee.findById(id);
    },
    async searchEmployee(_, { designation, department }) {
      return await Employee.find({ $or: [{ designation }, { department }] });
    },
  },
  Mutation: {
    async addEmployee(_, args) {
      const employee = new Employee(args);
      await employee.save();
      return employee;
    },
    async updateEmployee(_, { id, ...updates }) {
      return await Employee.findByIdAndUpdate(id, updates, { new: true });
    },
    async deleteEmployee(_, { id }) {
      await Employee.findByIdAndDelete(id);
      return "Employee deleted successfully";
    },
  },
};

module.exports = employeeResolvers;
