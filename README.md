
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

### 1. Minimal definition

A target url with a result object

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

### 2. Basic definition

1\) With "method", "params", "result" and "verify"

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

2\) Just "result"

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

3\) Just "params" and "verify"

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

4\) Just a function

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

### 3. Title of test case

You can specify a title string before url like below, Testor will prints it instead of the url.

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

See [demo file](./examples/03-title-of-test-cases/test/cases.js) to learn more.

### 4. Before and after

Sometimes you wanna do something before test and after tested, use "**before**" and "**after**" like below. The "before" and "after" should be a url array or a url string.

```js
module.exports = [
    
    // Step 2
    '/user/list',
    {
        // Step 1
        before: [
            '/user/register?username=owen&password=123',
            '/user/login?username=owen&password=123',
        ],

        // Step 3
        after: '/user/kill?username=owen',

        // Step 4: using the result returned from step 2
        verify(result) {
            const rst = result.data.find(item => item.username === 'owen');
            return !!rst;
        }
    },
    
];
```

More further, you can use "**resultUrl**" instead of the target url to get the result like below step 3.

```js
module.exports = [
    
    // Step 2
    '/user/logout?username=owen',
    {
        // Step 1
        before: [
            '/user/register?username=owen&password=123',
            '/user/login?username=owen&password=123',
        ],

        // Step 3: using this url to get the result
        resultUrl: '/user/get?username=owen',

        // Step 4
        after: '/user/kill?username=owen',

        // Step 5: using the result returned from step 3 instead of step 2
        verify(result) {
            return result.data.isOnline === 0;
        }
    },    
        
];
```

See [demo file](./examples/04-before-and-after/test/cases.js) to learn more.

### 5. Before and after with title

You can use the title of test case instead of url in "before" and "after".

```js
module.exports = [

    'register',
    '/user/register?username=owen&password=123',
    {
        // Using the title instead of url
        before: 'kill',

        verify(result) {
            return result.data > 0;
        }
    },
    
    'kill',
    '/user/kill?username=owen',
    {
        verify(result) {
            return result.data === 1;
        }
    },
    
];
```

See [demo file](./examples/05-before-and-after-with-title) to learn more.

### 6. Before and after with scripts

You can write some scripts under directory "test", and use them in "before" and "after".

```js
module.exports = [
    
    // Step 2
    '/user/logout?username=owen',
    {
        // Step 1
        before: [
            './scripts/user/register?username=owen&password=123',
            './scripts/user/login?username=owen&password=123',
        ],

        // Step 3: use this url to get the result
        resultUrl: './scripts/user/get?username=owen',

        // Step 4
        after: './scripts/user/kill?username=owen',

        // Step 5: use the result returned from step 3 instead of step 2
        verify(result) {
            return result.data.isOnline === 0;
        }
    },
    
];
```

See [demo file](./examples/06-before-and-after-with-scripts/test) to learn more. 

## Examples

* [01 test web app](./examples/01-test-web-app)
* [02 test web app with config](./examples/02-test-web-app-with-config)
* [03 title of test cases](./examples/03-title-of-test-cases)
* [04 before and after](./examples/04-before-and-after)
* [05 before and after with title](./examples/05-before-and-after-with-title)
* [06 before and after with scripts](./examples/06-before-and-after-with-scripts)

## CLi Options

#### --logs

Output server logs.

```sh
node test --logs
```

#### -b, --bail

Force to bail after the first test failure.

```sh
node test --bail
```

#### -t, --timeout \<ms\>

The timeout of test cases. The default is 2 seconds.

```sh
node test -t 3000
```

It is equivalents to:

```sh
node test --timeout 3s
```

Use --no-timeouts or --timeout 0 to disable timeout:

```sh
node test --no-timeouts
```

#### --inspect-brk \<port\>

Debug tests running in Node using Chrome DevTools inspector.

```sh
node test --inspect-brk 9229
```

## License

[MIT](LICENSE)

Copyright (c) 2019, Owen Luke
