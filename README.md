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
		"url": "./source/libraries/FetchStub/mock.schema.json"
	}
]
```

#### Config Example
Here you can see an example:
```js
{
	"$schema": "./mock.schema.json",
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
			"responseFile": "./getUser.json"
		},
		{
			"method": "POST",
			"path": {
				"base": "/api/changePassword"
			},
			"responseFile": "./changePassword.json"
		},
		{
			"method": "POST",
			"path": {
				"base": "/api/registerUser"
			},
			"bodyPatterns": {
				"matches": "['\"]name['\"]\\s*:\\s*['\"]mario['\"]"
			},
			"responseFile": "./marioRegistration.json"
		}
	]
}
```