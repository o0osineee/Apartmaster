const db = require('../config/database');
const bcrypt = require('bcrypt');

async function hashPasswords() {
  try {
    // Hash passwords for residents
    const [residents] = await db.query('SELECT residentId, password FROM Resident WHERE isDeleted = FALSE');
    for (const resident of residents) {
      const hashedPassword = await bcrypt.hash(resident.password, 10);
      await db.query('UPDATE Resident SET password = ? WHERE residentId = ?', [hashedPassword, resident.residentId]);
    }

    // Hash passwords for employees
    const [employees] = await db.query('SELECT employeeId, password FROM Employee WHERE isDeleted = FALSE');
    for (const employee of employees) {
      const hashedPassword = await bcrypt.hash(employee.password, 10);
      await db.query('UPDATE Employee SET password = ? WHERE employeeId = ?', [hashedPassword, employee.employeeId]);
    }

    console.log('All passwords have been hashed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error hashing passwords:', error);
    process.exit(1);
  }
}

hashPasswords(); 