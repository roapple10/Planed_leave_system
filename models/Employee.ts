import { Model, DataTypes, Sequelize } from 'sequelize';

class Employee extends Model {
  public id!: number;
  public name!: string;
  public email!: string;
  public personalLeave!: number;
  public remainingPersonalLeave!: number;
  public sickLeave!: number;
  public remainingSickLeave!: number;
  public annualLeave!: number;
  public remainingAnnualLeave!: number;
}

// This function will be called when you're ready to initialize the model
export function initEmployee(sequelize: Sequelize) {
  Employee.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    personalLeave: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    remainingPersonalLeave: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    sickLeave: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    remainingSickLeave: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    annualLeave: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    remainingAnnualLeave: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  }, {
    sequelize,
    modelName: 'Employee',
  });
}

export default Employee;
