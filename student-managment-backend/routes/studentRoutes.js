const express = require("express");
const router = express.Router();
const Student = require("../models/Student");
const sequelize = require("../config/db");
const { Op, ValidationError, UniqueConstraintError } = require("sequelize");


const generateAdmissionNo = async () => {
    const year = new Date().getFullYear();

    const result = await Student.findOne({
        attributes: [[sequelize.fn("MAX", sequelize.col("admissionNo")), "maxNo"]]
    });

    const maxNo = result?.dataValues?.maxNo;
    const lastNum = maxNo ? (parseInt(maxNo.split("-")[2]) || 0) : 0;

    return `PU-${year}-${String(lastNum + 1).padStart(3, "0")}`;
};

// ✅ Centralized error handler
const handleSequelizeError = (error, res) => {
    console.error("Sequelize error:", error);

    if (error instanceof UniqueConstraintError) {
        const fields = error.errors.map((e) => {
            if (e.path === "email") return "Email address already registered";
            if (e.path === "admissionNo") return "Admission number conflict, please retry";
            return `${e.path} already exists`;
        });
        return res.status(400).json({ error: fields.join(". ") });
    }

    if (error instanceof ValidationError) {
        const messages = error.errors.map((e) => {
            if (e.path === "gender") return "Invalid gender value";
            return `${e.path}: ${e.message}`;
        });
        return res.status(400).json({ error: messages.join("; ") });
    }

    return res.status(400).json({ error: error.message || "Something went wrong" });
};

router.get("/dashboard", async (req, res) => {
    try {
        const totalStudents = await Student.count();

        const activeCourses = await Student.count({
            distinct: true,
            col: "course",
            where: { course: { [Op.ne]: null } }
        });

        const totalDepartments = await Student.count({
            distinct: true,
            col: "department",
            where: { department: { [Op.ne]: null } }
        });

        // ✅ LAST 2 HOURS TIME FILTER
        const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000);

        const recentStudents = await Student.findAll({
            where: {
                createdAt: {
                    [Op.gte]: twoHoursAgo
                }
            },
            limit: 5,
            order: [["createdAt", "DESC"]],
            attributes: ["id", "name", "admissionNo", "course", "department", "createdAt"]
        });

        res.json({
            totalStudents,
            totalLessons: 0,
            activeCourses,
            totalDepartments,
            recentStudents
        });
    } catch (error) {
        console.error("GET dashboard stats error:", error);
        res.status(500).json({ error: error.message });
    }
});
router.get("/", async (req, res) => {
    try {
        const { search, course, startDate, endDate } = req.query;
        let where = {};

        if (search) {
            where[Op.or] = [
                { name: { [Op.iLike]: `%${search}%` } },
                { admissionNo: { [Op.iLike]: `%${search}%` } },
                { email: { [Op.iLike]: `%${search}%` } }
            ];
        }

        if (course) where.course = course;

        if (startDate && endDate) {
            where.createdAt = {
                [Op.between]: [new Date(startDate), new Date(endDate)]
            };
        }

        const students = await Student.findAll({
            where,
            order: [["createdAt", "DESC"]]
        });

        res.json(students);
    } catch (error) {
        console.error("GET students error:", error);
        res.status(500).json({ error: error.message });
    }
});

router.get("/:id", async (req, res) => {
    try {
        const student = await Student.findByPk(req.params.id);
        if (!student) return res.status(404).json({ error: "Student not found" });
        res.json(student);
    } catch (error) {
        console.error("GET student by ID error:", error);
        res.status(500).json({ error: error.message });
    }
});

router.post("/", async (req, res) => {
    try {
        
        if (req.body.email) {
            const existing = await Student.findOne({
                where: { email: req.body.email }
            });
            if (existing) {
                return res.status(400).json({
                    error: "Email address is already registered to another student."
                });
            }
        }

        const admissionNo = await generateAdmissionNo();

        const student = await Student.create({
            ...req.body,
            admissionNo,
            dob: req.body.dob ? req.body.dob.substring(0, 10) : null
        });

        res.status(201).json(student);
    } catch (error) {
        console.error("CREATE student error:", error);
        handleSequelizeError(error, res);
    }
});


router.put("/:id", async (req, res) => {
    try {
        const student = await Student.findByPk(req.params.id);
        if (!student) return res.status(404).json({ error: "Student not found" });

        // ✅ Check duplicate email on update (exclude current student)
        if (req.body.email && req.body.email !== student.email) {
            const existing = await Student.findOne({
                where: {
                    email: req.body.email,
                    id: { [Op.ne]: req.params.id }
                }
            });
            if (existing) {
                return res.status(400).json({
                    error: "Email address is already registered to another student."
                });
            }
        }

        await student.update({
            ...req.body,
            dob: req.body.dob ? req.body.dob.substring(0, 10) : student.dob
        });

        res.json(student);
    } catch (error) {
        console.error("UPDATE student error:", error);
        handleSequelizeError(error, res);
    }
});

router.delete("/:id", async (req, res) => {
    try {
        const student = await Student.findByPk(req.params.id);
        if (!student) return res.status(404).json({ error: "Student not found" });
        await student.destroy();
        res.json({ message: "Student deleted successfully" });
    } catch (error) {
        console.error("DELETE student error:", error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;