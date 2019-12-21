
# Testor

An easy-to-use testing framework for web app of [Node.js](https://nodejs.org), support HTTP and HTTPS, GET and POST.


## Install

```sh
npm install testor --save
```

## Usage

1\. Create folder "test" under your project root path

2\. Create file "[./test/index.js](./examples/01-test-web-app/test/index.js)"

```js
require('testor')()
```

3\. Create file "[./test/cases.js](./examples/01-test-web-app/test/cases.js)". (See [Define test cases](#Define-test-cases) to learn more)

4\. Run `./test/index.js` under your project root path

```sh
node test
```

## Define test cases

Use an array to define test cases in file "[./test/cases.js](./examples/01-test-web-app/test/cases.js)".

1\. Minimal version, with a result object

```js
module.exports = [
    
    // The target url. 
    // It will be completed to "http://localhost:3000/about"
    '/about', 

    // The expected result which should be returned from the server
    {
        success: true,
        data: {
            "version": "1.0.0"
        }
    },
];
```

2\. Full definition, with "method", "params", "result" and "verify"

```js
module.exports = [
    
    // The target url. 
    // It will be completed to "http://localhost:3000/say/hi"
    '/say/hi',
    {
        // Support GET and POST. The default is POST
        method: 'GET', 

        // The params with test data will be send to the target url 
        params: { 
            name: 'owen',
            age: 100
        },

        // The expected result which should be returned from the server.
        // The result can be any structure. The following is Noapi style.
        result: {
            success: true,
            data: {
                msg: "Hi, I am owen, 100 years old."
            }
        },
        
        // If a verify function is specified, it will be used
        // instead of the property "result" to verify the result.
        verify(result) {
            
            // The result is returned from the server at runtime.
            return result.data.msg === 'Hi, I am owen, 100 years old.';
        }
    },    
];
```

3\. Just "result"

```js
module.exports = [
    '/say/hi?name=owen&age=100',
    {
        result: {
            success: true,
            data: {
                msg: "Hi, I am owen, 100 years old."
            }
        }
    },    
];
```

4\. Just "params" and "verify"

```js
module.exports = [
    '/say/hi',
    {
        params: {
            name: 'owen',
            age: 100
        },

        verify(result) {
            // The result is returned from the server at runtime.
            return result.data.msg === 'Hi, I am owen, 100 years old.';
        }
    },
];
```

5\. Just a function

```js
module.exports = [
    '/helloWorld',
    
    // If it is a function, it is the verify function
    (result) => {
    
        // The result is returned from the server at runtime.
        return result.data.msg.indexOf('Hello') >= 0;
    },
];
```

## Examples

* [01 Test web app](./examples/01-test-web-app)
* [02 Test web app with config](./examples/02-test-web-app-with-config)

## Options

```js
const options = {
    protocol: 'http', // Or https. The default is "http"
    host: 'localhost', // Or www.abc.com. The default is "localhost"
    port: 3000, // Or omit it. The default is 3000
};
require('testor')(options)
```

## License

[MIT](LICENSE)

Copyright (c) 2019, Owen Luke
