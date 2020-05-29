# urls

A collection of common functions to make working with URLs less painful.

## Install

`$ npm install @njkleiner/urls`

## Usage

```javascript
const urls = require('@njkleiner/urls');

urls.isURL('https://example.com');
// => true

urls.isURL('not a url');
// => false

urls.isAbsolute('https://example.com/about');
// => true

urls.isRelative('/test');
// => true

urls.normalize('EXAMPLE.com');
// => http://example.com/

urls.compare('http://example.com/', 'example.com');
// => true

urls.matchesHost('https://www.example.com/test', 'example.com');
// => true

urls.normalizeQuery('https://www.example.com/?abc=def&xyz=123');
// => {'abc': 'def', 'xyz': '123'}

urls.appendQuery('https://example.com/test?abc=xyz', {'foo': 'bar'});
// => https://example.com/test?abc=xyz&foo=bar

urls.join('https://example.com', '/test');
// => https://example.com/test
```

## API

### urls.isURL(value, protocols?)

Returns `true` if `value` is a valid URL.

#### value

Type: `string`

The string for which to determine whether it is a URL.

#### protocols

Type: `Array<string>`\
Default: `['http', 'https']`

A list of valid protocols.

By default, only `http` and `https` are considered valid protocols. If you want to accept any protocol, use an empty array.

### urls.isAbsolute(value)

Returns `true` if `value` is an absolute URL.

#### value

Type: `string`

The URL to test.

### urls.isRelative(value)

Returns `true` if `value` is a relative URL.

#### value

Type: `string`

The URL to test.

### urls.normalize(value)

Takes a URL-like string and returns a normalized URL.

Appends `http://` if no protocol is specified, normalizes the URL by calling `new URL(value).toString()` and removes trailing `#` and `?` characters when possible.

#### value

Type: `string`

The URL to normalize.

### urls.compare(left, right)

Returns `true` if `left` and `right` are valid URLs and are equal after normalizing them.

#### left

Type: `string`

The first URL to compare.

#### right

Type: `string`

The second URL to compare.

### urls.matchesHost(value, host)

Returns `true` if `value` is a valid URL and its host is `host`.

#### value

Type: `string`

The URL whoose host to test.

#### host

Type: `string`

The host to test against.

### urls.normalizeQuery(value)

Returns a dictionary `object` of query parameters parsed from `value`.

#### value

Type: `string`

The URL whoose query parameters to parse and normalize.

### urls.appendQuery(value, query)

Appends query parameters to an existing URL and returns the stringified result.

#### value

Type: `string`

The URL to append query parameters to.

#### query

Type: `object`

A dictionary of query parameters to append.

### urls.join(base, path)

Returns a stringified URL that is the result of appending `path` to `base`.

#### base

Type: `string`

The base URL to append `path` to.

#### path

Type: `string`

The path segment appended to `base`.

## Contributing

You can contribute to this project by [sending patches](https://git-send-email.io) to `noah@njkleiner.com`.

## Authors

* [Noah Kleiner](https://github.com/njkleiner)

See also the list of [contributors](https://github.com/njkleiner/urls/contributors) who participated in this project.

## License

This project is licensed under the MIT License. See the [LICENSE.md](LICENSE.md) file for details.
