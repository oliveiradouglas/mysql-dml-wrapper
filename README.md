# MySQL simple dml wrapper

# Install

```sh
$ npm i -S mysql-dml-wrapper
```

# Usage

## Connections

```js
const MysqlDmlWrapper = require('mysql-dml-wrapper');

// * setup explicit
MysqlDmlWrapper.setupConnection({
    host     : 'localhost',
    user     : 'root',
    password : '',
    database : 'base'
});

// * if wish open connection internally, only grant the following environment variables in 'process.env'

DB_HOST
DB_USER
DB_PASSWORD
DB_DATABASE

// ======== connection control in app client

// open connection
MysqlDmlWrapper.openConnection();

// do database operations
MysqlDmlWrapper.insert(...parameters);
MysqlDmlWrapper.update(...parameters);

// remember to close the connection
MysqlDmlWrapper.closeConnection();

// ========= using implicit connection

// the wrapper opens the connection, does the insert operation and closes the connection
// ** valid for all dml operations
MysqlDmlWrapper.insert(...parameters);

```

## Select

```js

// with promise

MysqlDmlWrapper
    .select('products', 'id, name', 'WHERE cost > 3')
    .then((result) => {
        const products = result;
    }).catch(e => console.log(e.message));

// using es7 async/await

async function selectProducts() {
    try {
        await MysqlDmlWrapper.select('products', 'id, name', 'WHERE cost > 3 ORDER BY id DESC');
    } catch (e) {
        console.log(e);
    }
}
```

## Insert

```js
// with promise
let product = {
    name: 'Product Example',
    price: 15.9,
    cost: 5.9
};

MysqlDmlWrapper
    .insert('products', product)
    .then((result) => {
        const products = result;
    }).catch(e => console.log(e.message));

// using es7 async/await

async function saveProduct(product) {
    try {
        await MysqlDmlWrapper.insert('products', product);
    } catch (e) {
        console.log(e);
    }
}
```

## Update

```js
// with promise
let changedData = {
    price: 19.9,
    cost: 4
};

// providing ID
MysqlDmlWrapper
    .update('products', changedData, 1) // product id
    .then((result) => {
        const products = result;
    }).catch(e => console.log(e.message));

// providing where object
MysqlDmlWrapper
    .update('products', { price: 7.95 }, { cost: 2.3 }) // SET price = 7.95 WHERE cost = 2.3
    .then((result) => {
        const products = result;
    }).catch(e => console.log(e.message));

// using es7 async/await

async function updateProduct(product) {
    try {
        // providing id
        await MysqlDmlWrapper.update('products', product, product.id);

        // or where object
        await MysqlDmlWrapper.update('products', product, { someCondition: 'someValue' });
    } catch (e) {
        console.log(e);
    }
}
```

## Delete

```js
// with promise

// providing ID
MysqlDmlWrapper
    .delete('products', product.id)
    .then((result) => {
        const products = result;
    }).catch(e => console.log(e.message));

// providing where object
MysqlDmlWrapper
    .delete('products', { price: 7.95 })
    .then((result) => {
        const products = result;
    }).catch(e => console.log(e.message));

// using es7 async/await

async function deleteProduct(product) {
    try {
        // providing id
        await MysqlDmlWrapper.delete('products', product.id);

        // or where object
        await MysqlDmlWrapper.delete('products', { someCondition: 'someValue' });
    } catch (e) {
        console.log(e);
    }
}
```

# API

* ```setupConnection```: 
    - connectionData = {
        host     : process.env.DB_HOST,
        user     : process.env.DB_USER,
        password : process.env.DB_PASSWORD,
        database : process.env.DB_DATABASE
    } // Object with connection data

* ```openConnection```: // Opens the database connection

* ```closeConnection```: // Closes the database connection

* ```select```: 
    - table // Table
    - select // Fields to select, default '*'
    - complement // Any query complement, as where, joins, group by, etc

* ```insert```
    - table // Table
    - payload // Object to insert in database

* ```update```
    - table // Table
    - set // Object with fields to update
    - where // Object to do clause where or object id

* ```delete```
    - table // Table
    - where // Object to do clause where or object id