'use strict'

const mysql = require('mysql');

/**
 * Create a connection
 * @return {Object} connection
 */
function createConnection() {
    return mysql.createConnection({
        host     : process.env.DB_HOST,
        user     : process.env.DB_USER,
        password : process.env.DB_PASSWORD,
        database : process.env.DB_DATABASE
    });
}

/**
 * Handle query response
 * @param {Object} err Query error
 * @param {Object} result Query result
 * @param {Object} reject Callback of error of promise
 * @param {Object} resolve Callback of success of promise
 * @param {Object} connection Connection
 */
function handlerResult(err, result, reject, resolve, connection) {
    connection.end();

    if (err) {
        reject(new Error(err));
    } else {
        resolve(result);
    }
}

/**
 * Run query
 * @param {string} query 
 * @param {any} options 
 * @return {Promise}
 */
function runQuery(query, options) {
    return new Promise((resolve, reject) => {
        const connection = createConnection();

        let parameters = [
            query, 
            (err, result) => handlerResult(err, result, reject, resolve, connection)
        ];

        if (options) {
            parameters.splice(1, 0, options);
        }

        connection.query(...parameters);
    });
}

class Wrapper {
    static async select(table, select = '*', complement) {
        let sql = `SELECT ${select} FROM ${table} ${complement};`;
        return runQuery(sql);
    }

    static async insert(table, payload) {
        return runQuery(
            `INSERT INTO ${table} SET ?`, 
            payload, 
        );
    }

    static async update(table, set, where) {
        where = (
            typeof where === 'object' ? 
            where : 
            { id: where }
        );

        return runQuery(
            `UPDATE ${table} SET ? WHERE ?`, 
            [ set, where ]
        );
    }

    static async delete(table, where) {
        where = (
            typeof where === 'object' ? 
            where : 
            { id: where }
        );

        return runQuery(
            `DELETE FROM ${table} WHERE ?`, 
            where
        );
    }
}

module.exports = Wrapper;