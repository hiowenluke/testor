
# Testor

A testing framework for web app of [Node.js](https://nodejs.org).


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

Or

```js
require('testor')({host: '127.0.0.1', port: 3000})
```

3\. Create file "./test/cases.js", such as below

```js
module.exports = {
    
    // The target uri (an api or a source file such as html)
    '/say/hi': {
        
        // The parameters which will be posted to the target uri
        // It can be omitted if no need
        params: {
            name: 'owen',
            age: 100
        },

        // The expected result which will be returned from server 
        result: {
            success: true,
            data: {
                msg: "Hi, I am owen, 100 years old."
            }
        }
    },

    '/helloWorld': {
        
        // Use function verify to verify the result 
        verify(result) {
            return result.data.msg.indexOf('Hello') >= 0;
        }
    },
    
    '/about': {
        result: {
            success: true,
            data: {
                "version": "1.0.0"
            }
        }
    },
}
```

4\. Run test under your project root path

```sh
node test
```

## Examples

* [Test web app](./examples/web-app/test)
* [Test web app with config](./examples/web-app-with-config/test)

## License

[MIT](LICENSE)

Copyright (c) 2019, Owen Luke
