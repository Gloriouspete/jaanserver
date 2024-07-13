const Gettime = () => {

    const pad = (num) => num.toString().padStart(2, '0');

    const now = new Date();
    const fullDateTime = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}${pad(now.getHours())}${pad(now.getMinutes())}`;
    
    console.log(fullDateTime);
    return fullDateTime
    
}

module.exports = Gettime;