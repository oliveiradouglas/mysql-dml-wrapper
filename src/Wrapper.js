'use strict'

const mysql         = require('mysql');
let _connectionData = null;
let _connection     = null;

class Wrapper {
    static setupConnection(connectionData) {
        _connectionData = (connectionData || {
            host     : process.env.DB_HOST,
            user     : process.env.DB_USER,
            password : process.env.DB_PASSWORD,
            database : process.env.DB_DATABASE
        });
    }

    static openConnection() {
        if (!_connectionData) {
            this.setupConnection();
        }
        
        if (!_connectionData) {
            throw new Error('Connection data not provided!');
        }

        if (_connection) {
            return;
        }

        _connection = mysql.createConnection(_connectionData);
    }

    static closeConnection() {
        if (_connection) {
            _connection.end();
        }

        _connection = null;
    }

    static async select(table, select = '*', complement) {
        let sql = `SELECT ${select} FROM ${table} ${complement};`;
        return _runQuery(sql);
    }

    static async insert(table, payload) {
        return _runQuery(
            `INSERT INTO ${table} SET ?`, 
            payload, 
        );
    }

    static async update(table, set, where) {
        _formatWhereObject(where);

        return _runQuery(
            `UPDATE ${table} SET ? WHERE ?`, 
            [ set, where ]
        );
    }

    static async delete(table, where) {
        _formatWhereObject(where);

        return _runQuery(
            `DELETE FROM ${table} WHERE ?`, 
            where
        );
    }
}

/**
 * Run query
 * @param {string} query 
 * @param {any} options 
 * @return {Promise}
 */
function _runQuery(query, options) {
    return new Promise((resolve, reject) => {
        const mustCloseConnection = !_connection;
        
        let parameters = [
            query, 
            (err, result) => _handlerResult(err, result, reject, resolve, mustCloseConnection)
        ];
        
        if (options) {
            parameters.splice(1, 0, options);
        }
        
        if (mustCloseConnection) {
            Wrapper.openConnection();
        }

        _connection.query(...parameters);
    });
}

/**
 * Handle query response
 * @param {Object} err Query error
 * @param {Object} result Query result
 * @param {Object} reject Callback of error of promise
 * @param {Object} resolve Callback of success of promise
 * @param {Boolean} mustCloseConnection Close connection if connection is open internally
 */
function _handlerResult(err, result, reject, resolve, mustCloseConnection) {
    if (mustCloseConnection) {
        Wrapper.closeConnection();
    }

    if (err) {
        reject(new Error(err));
    } else {
        resolve(result);
    }
}

function _formatWhereObject(where) {
    where = (
        typeof where === 'object' ? 
        where : 
        { id: where }
    );
}

module.exports = Wrapper;