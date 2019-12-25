
# Testor

An easy-to-use testing framework for web app of [Node.js](https://nodejs.org), support HTTP and HTTPS, GET and POST.


## Install

```sh
npm install testor --save
```

## Usage

1\. Create folder "test" under your project root path

2\. Create file "./test/index.js"

```js
require('testor')()
```

3\. Create file "[./test/cases.js](./examples/01-test-web-app/test/cases.js)". (See [Define test cases](#Define-test-cases) to learn more)

4\. Run `./test/index.js` under your project root path

```sh
node test
```

Result

```sh
  01 test web app
    ✓ /about
    ✓ /say/hi
    ✓ /say/hi?name=owen&age=100
    ✓ /say/hi?name=owen&age=100
    ✓ /say/hi
    ✓ /helloWorld

  6 passing (1s)
```

## Define test cases

Use an array to define test cases in file "[./test/cases.js](./examples/01-test-web-app/test/cases.js)".

### 1. Basic definition

1\. Minimal version, with a result object

```js
module.exports = [
    
    // The target url which will be tested. 
    // It will be completed like "http://localhost:3000/about" if it is not started with "http:..."
    '/about', 

    // The expected result which should be returned from the server.
    // The result can be any structure. The following is Noapi style.
    {
        success: true,
        data: {
            "version": "1.0.0"
        }
    },
];
```

2\. With "method", "params", "result" and "verify"

```js
module.exports = [
    
    '/say/hi',
    {
        // The default is POST
        method: 'GET', 

        // The params with test data will be send to the target url 
        params: { 
            name: 'owen',
            age: 100
        },

        // The expected result which should be returned from the server.
        result: {
            success: true,
            data: {
                msg: "Hi, I am owen, 100 years old."
            }
        },
        
        // If a verify() function is specified, it will be used
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

### 2. Using title of test case

We can specify a title string before url like below, Testor will prints it instead of the url.

```js
module.exports = [
    
    'Passing test data via params, and using GET method',
    '/say/hi',
    {
        method: 'GET', // default is POST

        params: {
            name: 'owen',
            age: 100
        },

        result: {
            success: true,
            data: {
                msg: "Hi, I am owen, 100 years old."
            }
        }
    },

    'Passing test data via url',
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

Result

```sh
  02 title of test cases
    ✓ Passing test data via params, and using GET method
    ✓ Passing test data via url

  2 passing (1s)
```

See [demo file](./examples/02-title-of-test-cases/test/cases.js) to learn more.

### 3. Before and after

Sometimes we wanna do something before test and after tested, use "**before**" and "**after**" like below. 

```js
module.exports = [
    
    // Step 2
    '/user/list',
    {
        // Step 1
        before: [
            '/user/register?username=owen&password=123',
            '/user/login?username=owen',
        ],

        // Step 3
        after: [
            '/user/kill?username=owen',
        ],

        // Step 4: using the result returned from step 2
        verify(result) {
            const rst = result.data.find(item => item.username === 'owen');
            return !!rst;
        }
    },
    
];
```

More further, we can use "**resultUrl**" instead of the target url to get the result like below.

```js
module.exports = [
    
    // Step 2
    '/user/logout?username=owen',
    {
        // Step 1
        before: [
            '/user/register?username=owen&password=123',
            '/user/login?username=owen',
        ],

        // Step 3: using this url to get the result
        resultUrl: '/user/get?username=owen',

        // Step 4
        after: [
            '/user/kill?username=owen',
        ],

        // Step 5: using the result returned from step 3 instead of step 2
        verify(result) {
            return result.data.isOnline === 0;
        }
    },    
        
];
```

See [demo file](./examples/03-before-and-after/test/cases.js) to learn more.

## Examples

* [01 Test web app](./examples/01-test-web-app)
* [02 title of test cases](./examples/02-title-of-test-cases)
* [03 before and after](./examples/03-before-and-after)
* [04 before and after with scripts](./examples/04-before-and-after-with-scripts)
* [99 with config](./examples/99-with-config)

## Options

It can be omitted if it is the default value as below.

```js
const options = {
    protocol: 'http',
    host: 'localhost',
    port: 3000,
};
require('testor')(options)
```

## License

[MIT](LICENSE)

Copyright (c) 2019, Owen Luke
