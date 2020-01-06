const mysql = require('mysql');

/*
 * const connection = mysql.createConnection({ host: '142.4.8.175', port: 3306,
 * user: 'mime_cashback', password: 'cashback', database: 'mime_cashback' });
 */
const pool = mysql.createPool({
    connectionLimit: 10,
    host: '142.4.8.175',
    // port: 3306,
    user: 'mime_cashback',
    password: 'cashback',
    database: 'mime_cashback'
});
/*
const pool = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    // port: 3306,
    user: 'root',
    password: '',
    database: 'cashback'
});
*/

console.log('pool => criado');

pool.on('release', () => console.log('pool => conexão retornada'));

process.on('SIGINT', () => 
	pool.end(err => {
	    if(err) return console.log(err);
	    console.log('pool => fechado');
	    process.exit(0);
	})
);

module.exports = pool;