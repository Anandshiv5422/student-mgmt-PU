const sequelize = require('./config/db');
const Student = require('./models/Student');

const sampleStudents = [
  {
    name: "John Doe",
    course: "Computer Science",
    year: 1,
    department: "Engineering",
    email: "john.doe@example.com",
    mobile: "1234567890",
    gender: "Male",
    state: "Maharashtra",
    city: "Mumbai",
    zip: "400001",
    addressLine: "123 Main St",
    study: "Undergraduate",
    semester: "Semester 1",
    photo: "base64_string_placeholder_1"
  },
  {
    name: "Jane Smith",
    course: "Information Technology",
    year: 2,
    department: "Engineering",
    email: "jane.smith@example.com",
    mobile: "9876543210",
    gender: "Female",
    state: "Karnataka",
    city: "Bangalore",
    zip: "560001",
    addressLine: "456 Side St",
    study: "Undergraduate",
    semester: "Semester 3",
    photo: "base64_string_placeholder_2"
  },
  {
    name: "Alex Johnson",
    course: "Mechanical Engineering",
    year: 3,
    department: "Engineering",
    email: "alex.j@example.com",
    mobile: "5556667777",
    gender: "Other",
    state: "Delhi",
    city: "New Delhi",
    zip: "110001",
    addressLine: "789 Broad St",
    study: "Undergraduate",
    semester: "Semester 5",
    photo: "base64_string_placeholder_3"
  }
];

const seedDatabase = async () => {
  try {
    // We don't use generateAdmissionNo here to keep it simple, 
    // or we can let the model/route handle it if we create via API.
    // But since this is a direct script:
    
    await sequelize.authenticate();
    console.log('Database connection established.');

    // Sync models
    await sequelize.sync({ force: true }); // WARNING: This clears the table
    console.log('Database synced.');

    // Add students
    // We'll manually add admission numbers for the seed if needed, 
    // but the user's route has a generator. 
    // Let's mimic the generator style.
    
    for (let i = 0; i < sampleStudents.length; i++) {
        const year = new Date().getFullYear();
        sampleStudents[i].admissionNo = `PU-${year}-${String(i + 1).padStart(3, "0")}`;
    }

    await Student.bulkCreate(sampleStudents);
    console.log('Sample data seeded successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error.message);
    process.exit(1);
  }
};

seedDatabase();
