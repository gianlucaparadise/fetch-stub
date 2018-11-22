# FetchStub

### Config File Instructions

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