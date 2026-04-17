const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Student = sequelize.define("Student", {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    admissionNo: {
        type: DataTypes.STRING,
        unique: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    course: DataTypes.STRING,
    year: DataTypes.INTEGER,
    department: DataTypes.STRING,
    dob: DataTypes.DATEONLY,
    email: {
        type: DataTypes.STRING,
        // unique: true
    },
    mobile: DataTypes.STRING,
    gender: DataTypes.ENUM("Male", "Female", "Other"),
    state: DataTypes.STRING,
    city: DataTypes.STRING,
    zip: DataTypes.STRING,
    addressLine: DataTypes.STRING,
    study: DataTypes.STRING,
    semester: DataTypes.STRING,
    photo: DataTypes.TEXT
}, {
    timestamps: true
});

module.exports = Student;