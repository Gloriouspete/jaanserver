const { DateTime } = require("luxon");


const Gettime = () => {

    const now = DateTime.now().setZone('Africa/Lagos');
  
    const yyyy = now.year;
    const mm = String(now.month).padStart(2, '0'); // Months are zero-based, so add 1
    const dd = String(now.day).padStart(2, '0');
    const hh = String(now.hour).padStart(2, '0');
    const min = String(now.minute).padStart(2, '0');
  
    const formattedDateTime = `${yyyy}${mm}${dd}${hh}${min}`;
    
    const uniqueSuffix = generateUniqueSuffix();
    return `${formattedDateTime}${uniqueSuffix}`;
}

function generateUniqueSuffix() {
    // Generate a unique suffix to append to the date
    // This could be a random number, a UUID, a timestamp, etc.
    // For simplicity, let's use a random number
    return Math.floor(Math.random() * 100000); // Generates a number between 0 and 99999
  }
  
module.exports = Gettime;