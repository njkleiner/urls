# urls

> Make working with URLs great again

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

## Contributing

You can contribute to this project by [sending patches](https://git-send-email.io) to `noah@njkleiner.com`.

## Authors

* [Noah Kleiner](https://github.com/njkleiner)

See also the list of [contributors](https://github.com/njkleiner/urls/contributors) who participated in this project.

## License

This project is licensed under the MIT License. See the [LICENSE.md](LICENSE.md) file for details.
