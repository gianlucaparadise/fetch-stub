# FetchStub

This library wraps the fetch function and responds with a local json.

## Purpose

This library is useful in the following conditions:

* Your backend is unavailable
* Your backend is not yet completed, but you have an interface agreement
* You don't have Internet access
* You need to test specific responses that are difficult to replicate with you server

## Installation

```shell
yarn add fetch-stub
```
or
```shell
npm i fetch-stub --save
```

## Basic Usage

To initialize and load FetchStub:
```js
const FetchStub = require('fetch-stub');
const mockConfig = require('../../config/mocks/mock.config.json'); // path to mock config file
FetchStub.load(mockConfig);
```
To unload FetchStub:
```js
FetchStub.unload();
```

### Config File Instructions

#### Config Example
Here you can see an example:
```js
{
  "$schema": "https://raw.githubusercontent.com/gianlucaparadise/fetch-stub/master/mock.schema.json",
  "forward": false,
  "requests": [
    {
      "method": "GET",
      "path": {
        "base": "/api/user",
        "queries": {
          "id": "7"
        }
      },
	  "responseJson": {
	    "user": "John Doe"
	  }
    },
    {
      "method": "POST",
      "path": {
        "base": "/api/changePassword"
      },
	  "responseJson": {
	    "result": "ok"
	  }
    },
    {
      "method": "POST",
      "path": {
        "base": "/api/registerUser"
      },
      "bodyPatterns": {
        "matches": "['\"]name['\"]\\s*:\\s*['\"]mario['\"]"
      },
	  "responseJson": {
		"result": "ok",
	    "user": "John Doe"
	  }
    }
  ]
}
```

##### Apply JSON Schema
You can write your configurations in a file named `*.mock.json`. For applying the JSON Schema validator in VS Code, add this configuration in your `settings.json` file:
```js
"json.schemas": [
  {
    "fileMatch": [
      "/*.mock.json"
    ],
    "url": "https://raw.githubusercontent.com/gianlucaparadise/fetch-stub/master/mock.schema.json"
  }
]
```