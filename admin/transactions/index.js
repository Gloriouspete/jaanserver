const executor = require("../../config/db.js");

async function Transaction (req,res) {
        const userid = req.user.userid;
                const pquery = `select * from transactions where userid = ?`
                executor(pquery, [userid])
                    .then(results => {
                        console.log(results)
                        const transform = [];
                        const resu = results.reverse();
                        resu.forEach(element => {
                            const { buynumber, status, price, date, network, size } = element;
                            console.log(date)
                            const dateObject = new Date(date);
                            console.log(dateObject)
                            const year = dateObject.getFullYear();
                            const month = (dateObject.getMonth() + 1).toString().padStart(2, '0');
                            const day = dateObject.getDate().toString().padStart(2, '0');
                            const hours = dateObject.getHours().toString().padStart(2, '0');
                            const minutes = dateObject.getMinutes().toString().padStart(2, '0');
                            const seconds = dateObject.getSeconds().toString().padStart(2, '0');
    
                            const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    
                            console.log(formattedDate); // Output: "2023-08-22 12:58:24"
    
                            transform.push({ buynumber, status, price, date: formattedDate, network, size });
                        });
                        transform.map((idan) => {
                            console.log(idan)
                        });
                        res.json(transform);
    
                    })
                    .catch((error) => {
                        console.log(error)
                    })
                }

module.exports = Transaction;