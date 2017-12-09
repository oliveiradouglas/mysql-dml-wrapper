# MySQL simple dml wrapper

# Install

```sh
$ npm i -S mysql-dml-wrapper
```

# Setup

Configure access to the database in ```process.env```. The keys are:

```
DB_HOST
DB_USER
DB_PASSWORD
DB_DATABASE
```

# Usage

With promise

```js
const MysqlDmlWrapper = require('mysql-dml-wrapper');

const product = {
    name: 'Product Example',
    price: 15.9,
    cost: 5.9
}

MysqlDmlWrapper.insert('products', product).then((result) => {
    product.id = result.insertId
}).catch(e => console.log(e.message));

MysqlDmlWrapper.update('products', { price: 10.9 }, { id: product.id }).then((result) => {
    console.log('ok');
}).catch(e => console.log(e.message));

MysqlDmlWrapper.delete('products', { id: product.id }).then((result) => {
    console.log('ok');
}).catch(e => console.log(e.message));

MysqlDmlWrapper.select('products', 'id, name', ' WHERE cost > 3').then((result) => {
    const products = result;
}).catch(e => console.log(e.message));
```

Async/Await

```js
async function someMethod() {
    try {
        await MysqlDmlWrapper.insert('products', product);
        await MysqlDmlWrapper.update('products', { price: 10.9 }, { id: product.id });
        await MysqlDmlWrapper.delete('products', { id: product.id });
        await MysqlDmlWrapper.select('products', 'products', 'id, name', ' WHERE cost > 3');
    } catch (e) {
        console.log(e.message);
    }
}
```

# Available methods and parameters

* ```select```: 
    - table // Table
    - select // Fields to select, default '*'
    - whereAnd // Array to do clause where and
    - whereOr // Array to do clause where or

* ```insert```
    - table // Table
    - payload // Object to insert in database

* ```update```
    - table // Table
    - set // Object with fields to update
    - where // Object to do clause where

* ```delete```
    - table // Table
    - where // Object to do clause where