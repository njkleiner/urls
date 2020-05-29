const test = require('ava');

const urls = require('..');

test('urls#isUrl: should return false if input is invalid', t => {
    return t.false(urls.isURL(null));
});

test('urls#isUrl: should return false if input is valid but empty', t => {
    return t.false(urls.isURL(''));
});

test('urls#isUrl: should return true if input is valid', t => {
    return t.true(urls.isURL('http://example.com'));
});

test('urls#isUrl: should allow HTTP URLs by default', t => {
    return t.true(urls.isURL('http://example.com'));
});

test('urls#isUrl: should allow HTTPS URLs by default', t => {
    return t.true(urls.isURL('https://example.com'));
});

test('urls#isUrl: should return false if protocol is not allowed', t => {
    return t.false(urls.isURL('ftp://example.com'));
});

test('urls#isUrl: should return true if protocol is explicitly allowed', t => {
    return t.true(urls.isURL('ftp://example.com', ['ftp']));
});

test('urls#isUrl: should return true if any protocol is allowed', t => {
    return t.true(urls.isURL('ftp://example.com', []));
});

test('urls#isUrl: should return true if input is a valid URL object', t => {
    return t.true(urls.isURL(new URL('http://example.com')));
});

test('urls#isUrl: should allow HTTP URLs by default (URL object)', t => {
    return t.true(urls.isURL(new URL('http://example.com')));
});

test('urls#isUrl: should allow HTTPS URLs by default (URL object)', t => {
    return t.true(urls.isURL(new URL('https://example.com')));
});

test('urls#isUrl: should return false if protocol is not allowed (URL object)', t => {
    return t.false(urls.isURL(new URL('ftp://example.com')));
});

test('urls#isUrl: should return true if protocol is explicitly allowed (URL object)', t => {
    return t.true(urls.isURL(new URL('ftp://example.com'), ['ftp']));
});

test('urls#isUrl: should return true if any protocol is allowed (URL object)', t => {
    return t.true(urls.isURL(new URL('ftp://example.com'), []));
});

test('urls#isAbsolute: should return false if input is invalid', t => {
    return t.false(urls.isAbsolute(null));
});

test('urls#isAbsolute: should return false if input is valid but empty', t => {
    return t.false(urls.isAbsolute(''));
});

test('urls#isAbsolute: should return true URL is absolute', t => {
    return t.true(urls.isAbsolute('http://example.com'));
});

test('urls#isAbsolute: should return false URL is not absolute', t => {
    return t.false(urls.isAbsolute('/about'));
});

test('urls#isRelative: should return false if input is invalid', t => {
    return t.false(urls.isRelative(null));
});

test('urls#isRelative: should return false if input is valid but empty', t => {
    return t.false(urls.isRelative(''));
});

test('urls#isRelative: should return true URL is relative (path-relative)', t => {
    return t.true(urls.isRelative('/about'));
});

test('urls#isRelative: should return true URL is relative (not absolute)', t => {
    return t.true(urls.isRelative('about'));
});

test('urls#isRelative: should return false URL is not relative (absolute)', t => {
    return t.false(urls.isRelative('http://example.com'));
});

test('urls#isRelative: should return true if URL is protocol-relative', t => {
    return t.true(urls.isRelative('//example.com'));
});

test('urls#normalize: should return null if input is invalid', t => {
    return t.is(urls.normalize(null), null);
});

test('urls#normalize: should return null if input is valid but empty', t => {
    return t.is(urls.normalize(''), null);
});

test('urls#normalize: should add trailing slash', t => {
    return t.is(urls.normalize('http://example.com'), 'http://example.com/');
});

test('urls#normalize: should add default protocol', t => {
    return t.is(urls.normalize('example.com'), 'http://example.com/');
});

test('urls#normalize: should add default protocol to protocol-relative URL', t => {
    return t.is(urls.normalize('//example.com'), 'http://example.com/');
});

test('urls#normalize: should remove trailing question mark', t => {
    return t.is(urls.normalize('http://example.com/?'), 'http://example.com/');
});

test('urls#normalize: should remove trailing hash sign', t => {
    return t.is(urls.normalize('http://example.com/#'), 'http://example.com/');
});

test('urls#compare: should return false if input is invalid', t => {
    return t.false(urls.compare(null, null));
});

test('urls#compare: should return false if input is valid but empty', t => {
    return t.false(urls.compare('', ''));
});

test('urls#compare: should return true if URLs are equal (normalize protocol)', t => {
    return t.true(urls.compare('HTTP://example.com', 'example.com'));
});

test('urls#compare: should return true if URLs are equal (normalize host case)', t => {
    return t.true(urls.compare('http://EXAMPLE.COM', 'example.com'));
});

test('urls#matchesHost: should return false if input is invalid', t => {
    return t.false(urls.matchesHost(null, null));
});

test('urls#matchesHost: should return false if input is valid but empty', t => {
    return t.false(urls.matchesHost('', ''));
});

test('urls#matchesHost: should return true if the host matches', t => {
    return t.true(urls.matchesHost('http://example.com/abc/xyz', 'example.com'));
});

test('urls#matchesHost: should return true if the host and port match', t => {
    return t.true(urls.matchesHost('http://example.com:1337/abc/xyz', 'example.com:1337'));
});

test('urls#normalizeQuery: should return null if input is invalid', t => {
    return t.is(urls.normalizeQuery(null), null);
});

test('urls#normalizeQuery: should return null if input is valid but empty', t => {
    return t.is(urls.normalizeQuery(''), null);
});

test('urls#normalizeQuery: should normalize empty query', t => {
    return t.deepEqual(urls.normalizeQuery('http://example.com'), {});
});

test('urls#normalizeQuery: should normalize non-empty query', t => {
    return t.deepEqual(urls.normalizeQuery('https://example.com/test?abc=xyz&foo=bar'), {
        'abc': 'xyz',
        'foo': 'bar'
    });
});

test('urls#normalizeQuery: should normalize nested query', t => {
    return t.deepEqual(urls.normalizeQuery('https://example.com/test?abc=xyz&foo[bar]=baz'), {
        'abc': 'xyz',
        'foo': {
            'bar': 'baz'
        }
    });
});

test('urls#normalizeQuery: should normalize nested query with array indices', t => {
    return t.deepEqual(urls.normalizeQuery('https://example.com/test?foo[0]=bar&foo[1]=baz'), {
        'foo': [
            'bar', 'baz'
        ]
    });
});

test('urls#appendQuery: should return null if input is invalid', t => {
    return t.is(urls.appendQuery(null, null), null);
});

test('urls#appendQuery: should return null if input is valid but empty', t => {
    return t.is(urls.normalizeQuery('', {}), null);
});

test('urls#appendQuery: should append (to empty) query', t => {
    return t.is(urls.appendQuery('https://example.com/test', {
        'foo': 'bar'
    }), 'https://example.com/test?foo=bar');
});

test('urls#appendQuery: should append (to existing) query', t => {
    return t.is(urls.appendQuery('https://example.com/test?abc=xyz', {
        'foo': 'bar'
    }), 'https://example.com/test?abc=xyz&foo=bar');
});

test('urls#appendQuery: should append query to empty path', t => {
    return t.is(urls.appendQuery('https://example.com/', {
        'foo': 'bar'
    }), 'https://example.com/?foo=bar');
});

test('urls#appendQuery: should append (to existing, nested) query', t => {
    return t.is(urls.appendQuery('https://example.com/test?pq=nm&abc[]=foo&a[b]=c', {
        'abc': [
            'bar'
        ],
        'a': {
            'd': 'e'
        }
    }), encodeURI('https://example.com/test?pq=nm&abc[0]=foo&abc[1]=bar&a[b]=c&a[d]=e'));
});

test('urls#appendQuery: should append nothing to nothing', t => {
    return t.is(urls.appendQuery('https://example.com/', {}), 'https://example.com/');
});

test('urls#appendQuery: should preserve fragment', t => {
    return t.is(
        urls.appendQuery('https://example.com/home#about', {'foo': 'bar'}),
        'https://example.com/home?foo=bar#about'
    );
});

test('urls#join: should return null if input is invalid', t => {
    return t.is(urls.join(null, null), null);
});

test('urls#join: should return null if input is valid but empty', t => {
    return t.is(urls.join('', ''), null);
});

test('urls#join: should fail to join two absolute URLs', t => {
    return t.is(urls.join('http://example.com', 'https://example.org'), null);
});

test('urls#join: should fail to join two relative URLs', t => {
    return t.is(urls.join('/abc', '/xyz'), null);
});

test('urls#join: should join valid base URL and valid path', t => {
    return t.is(urls.join('http://example.com', '/test'), 'http://example.com/test');
});

test('urls#join: should join valid base URL and valid path without leading slash', t => {
    return t.is(urls.join('http://example.com', 'test'), 'http://example.com/test');
});
