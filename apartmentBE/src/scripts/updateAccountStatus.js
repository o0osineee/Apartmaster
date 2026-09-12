const db = require('../config/database');

async function updateAccountStatus() {
  try {
    // Update status for residents
    await db.query('UPDATE Resident SET status = TRUE WHERE isDeleted = FALSE');
    console.log('Resident accounts have been activated!');

    // Update status for employees
    await db.query('UPDATE Employee SET status = TRUE WHERE isDeleted = FALSE');
    console.log('Employee accounts have been activated!');

    process.exit(0);
  } catch (error) {
    console.error('Error updating account status:', error);
    process.exit(1);
  }
}

updateAccountStatus(); 