```javascript
const express = require("express");
const cors = require("cors");
const db = require("./db");

const app = express();

// ===============================
// CORS
// ===============================
app.use(cors({
    origin: [
        "https://beyondmarks-mu.vercel.app",
        "http://localhost:3000",
        "http://localhost:5500"
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

app.options("*", cors());

// ===============================
// Middleware
// ===============================
app.use(express.json());

// ===============================
// Test backend
// ===============================
app.get("/", (req, res) => {
    res.send("BeyondMarks Backend is running!");
});

// ===============================
// Test database
// ===============================
app.get("/api/test", (req, res) => {
    db.query("SELECT * FROM students", (err, results) => {
        if (err) {
            return res.status(500).json({
                error: err.message
            });
        }

        res.json(results);
    });
});

// ===============================
// GET ALL STUDENTS
// ===============================
app.get("/api/students", (req, res) => {
    db.query("SELECT * FROM students", (err, results) => {
        if (err) {
            return res.status(500).json({
                error: err.message
            });
        }

        res.json(results);
    });
});

// ===============================
// GET ONE STUDENT
// ===============================
app.get("/api/students/:student_id", (req, res) => {
    const { student_id } = req.params;

    const sql = "SELECT * FROM students WHERE student_id = ?";

    db.query(sql, [student_id], (err, results) => {
        if (err) {
            return res.status(500).json({
                error: err.message
            });
        }

        if (results.length === 0) {
            return res.status(404).json({
                error: "Student not found"
            });
        }

        res.json(results[0]);
    });
});

// ===============================
// ADD STUDENT
// ===============================
app.post("/api/students", (req, res) => {
    const {
        student_id,
        name,
        department,
        attendance
    } = req.body;

    const sql = `
        INSERT INTO students
        (student_id, name, department, attendance)
        VALUES (?, ?, ?, ?)
    `;

    db.query(
        sql,
        [student_id, name, department, attendance],
        (err, result) => {
            if (err) {
                return res.status(500).json({
                    error: err.message
                });
            }

            res.json({
                message: "Student added successfully!",
                id: result.insertId
            });
        }
    );
});

// ===============================
// UPDATE STUDENT
// ===============================
app.put("/api/students/:student_id", (req, res) => {
    const { student_id } = req.params;

    const {
        name,
        department,
        attendance
    } = req.body;

    const sql = `
        UPDATE students
        SET name = ?, department = ?, attendance = ?
        WHERE student_id = ?
    `;

    db.query(
        sql,
        [name, department, attendance, student_id],
        (err, result) => {
            if (err) {
                return res.status(500).json({
                    error: err.message
                });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    error: "Student not found"
                });
            }

            res.json({
                message: "Student updated successfully!"
            });
        }
    );
});

// ===============================
// DELETE STUDENT
// ===============================
app.delete("/api/students/:student_id", (req, res) => {
    const { student_id } = req.params;

    const sql = "DELETE FROM students WHERE student_id = ?";

    db.query(sql, [student_id], (err, result) => {
        if (err) {
            return res.status(500).json({
                error: err.message
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                error: "Student not found"
            });
        }

        res.json({
            message: "Student deleted successfully!"
        });
    });
});

// ===============================
// START SERVER
// ===============================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`BeyondMarks Backend running on port ${PORT}`);
});
```
