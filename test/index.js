const assert = require('assert');

const urls = require('..');

describe('urls#isURL', () => {
    it('should return false if input is invalid', () => {
        return assert.equal(urls.isURL(null), false);
    });

    it('should return false if input is valid but empty', () => {
        return assert.equal(urls.isURL(''), false);
    });

    it('should return true if input is valid', () => {
        return assert.equal(urls.isURL('http://example.com'), true);
    });

    it('should allow HTTP URLs by default', () => {
        return assert.equal(urls.isURL('http://example.com'), true);
    });

    it('should allow HTTPS URLs by default', () => {
        return assert.equal(urls.isURL('https://example.com'), true);
    });

    it('should return false if protocol is not allowed', () => {
        return assert.equal(urls.isURL('ftp://example.com'), false);
    });

    it('should return true if protocol is explicitly allowed', () => {
        return assert.equal(urls.isURL('ftp://example.com', ['ftp']), true);
    });

    it('should return true if any protocol is allowed', () => {
        return assert.equal(urls.isURL('ftp://example.com', []), true);
    });

    it('should return true if input is a valid URL object', () => {
        return assert.equal(urls.isURL(new URL('http://example.com')), true);
    });

    it('should allow HTTP URLs by default (URL object)', () => {
        return assert.equal(urls.isURL(new URL('http://example.com')), true);
    });

    it('should allow HTTPS URLs by default (URL object)', () => {
        return assert.equal(urls.isURL(new URL('https://example.com')), true);
    });

    it('should return false if protocol is not allowed (URL object)', () => {
        return assert.equal(urls.isURL(new URL('ftp://example.com')), false);
    });

    it('should return true if protocol is explicitly allowed (URL object)', () => {
        return assert.equal(urls.isURL(new URL('ftp://example.com'), ['ftp']), true);
    });

    it('should return true if any protocol is allowed (URL object)', () => {
        return assert.equal(urls.isURL(new URL('ftp://example.com'), []), true);
    });
});

describe('urls#isAbsolute', () => {
    it('should return false if input is invalid', () => {
        return assert.equal(urls.isAbsolute(null), false);
    });

    it('should return false if input is valid but empty', () => {
        return assert.equal(urls.isAbsolute(''), false);
    });

    it('should return true URL is absolute', () => {
        return assert.equal(urls.isAbsolute('http://example.com'), true);
    });

    it('should return false URL is not absolute', () => {
        return assert.equal(urls.isAbsolute('/about'), false);
    });
});

describe('urls#isRelative', () => {
    it('should return false if input is invalid', () => {
        return assert.equal(urls.isRelative(null), false);
    });

    it('should return false if input is valid but empty', () => {
        return assert.equal(urls.isRelative(''), false);
    });

    it('should return true URL is relative (path-relative)', () => {
        return assert.equal(urls.isRelative('/about'), true);
    });

    it('should return true URL is relative (not absolute)', () => {
        return assert.equal(urls.isRelative('about'), true);
    });

    it('should return false URL is not relative (absolute)', () => {
        return assert.equal(urls.isRelative('http://example.com'), false);
    });

    it('should return true if URL is protocol-relative', () => {
        return assert.equal(urls.isRelative('//example.com'), true);
    });
});

describe('urls#normalize', () => {
    it('should return null if input is invalid', () => {
        return assert.equal(urls.normalize(null), null);
    });

    it('should return null if input is valid but empty', () => {
        return assert.equal(urls.normalize(''), null);
    });

    it('should add trailing slash', () => {
        return assert.equal(urls.normalize('http://example.com'), 'http://example.com/');
    });

    it('should add default protocol', () => {
        return assert.equal(urls.normalize('example.com'), 'http://example.com/');
    });

    it('should add default protocol to protocol-relative URL', () => {
        return assert.equal(urls.normalize('//example.com'), 'http://example.com/');
    });

    it('should remove trailing question mark', () => {
        // Note that in this case `url.search` is empty, thus the question mark serves no purpose.
        return assert.equal(urls.normalize('http://example.com/?'), 'http://example.com/');
    });

    it('should remove trailing hash sign', () => {
        // Note that in this case `url.hash` is empty, thus the hash sign serves no purpose.
        return assert.equal(urls.normalize('http://example.com/#'), 'http://example.com/');
    });
});

describe('urls#compare', () => {
    it('should return false if input is invalid', () => {
        return assert.equal(urls.compare(null, null), false);
    });

    it('should return false if input is valid but empty', () => {
        return assert.equal(urls.compare('', ''), false);
    });

    it('should return true if URLs are equal (normalize protocol)', () => {
        return assert.equal(urls.compare('HTTP://example.com', 'example.com'), true);
    });

    it('should return true if URLs are equal (normalize host case)', () => {
        return assert.equal(urls.compare('http://EXAMPLE.COM', 'example.com'), true);
    });
});

describe('urls#matchesHost', () => {
    it('should return false if input is invalid', () => {
        return assert.equal(urls.matchesHost(null, null), false);
    });

    it('should return false if input is valid but empty', () => {
        return assert.equal(urls.matchesHost('', ''), false);
    });

    it('should return true if the host matches', () => {
        return assert.equal(urls.matchesHost('http://example.com/abc/xyz', 'example.com'), true);
    });

    it('should return true if the host and port match', () => {
        return assert.equal(urls.matchesHost('http://example.com:1337/abc/xyz', 'example.com:1337'), true);
    });
});

describe('urls#normalizeQuery', () => {
    it('should return null if input is invalid', () => {
        return assert.equal(urls.normalizeQuery(null), null);
    });

    it('should return null if input is valid but empty', () => {
        return assert.equal(urls.normalizeQuery(''), null);
    });

    it('should normalize empty query', () => {
        return assert.deepEqual(urls.normalizeQuery('http://example.com'), {});
    });

    it('should normalize non-empty query', () => {
        return assert.deepEqual(urls.normalizeQuery('https://example.com/test?abc=xyz&foo=bar'), {
            'abc': 'xyz',
            'foo': 'bar'
        });
    });

    it('should normalize nested query', () => {
        return assert.deepEqual(urls.normalizeQuery('https://example.com/test?abc=xyz&foo[bar]=baz'), {
            'abc': 'xyz',
            'foo': {
                'bar': 'baz'
            }
        });
    });

    it('should normalize nested query with array indices', () => {
        return assert.deepEqual(urls.normalizeQuery('https://example.com/test?foo[0]=bar&foo[1]=baz'), {
            'foo': [
                'bar', 'baz'
            ]
        });
    });
});

describe('urls#appendQuery', () => {
    it('should return null if input is invalid', () => {
        return assert.equal(urls.appendQuery(null, null), null);
    });

    it('should return null if input is valid but empty', () => {
        return assert.equal(urls.normalizeQuery('', {}), null);
    });

    it('should append (to empty) query', () => {
        return assert.equal(urls.appendQuery('https://example.com/test', {
            'foo': 'bar'
        }), 'https://example.com/test?foo=bar');
    });

    it('should append (to existing) query', () => {
        return assert.equal(urls.appendQuery('https://example.com/test?abc=xyz', {
            'foo': 'bar'
        }), 'https://example.com/test?abc=xyz&foo=bar');
    });

    it('should append query to empty path', () => {
        return assert.equal(urls.appendQuery('https://example.com/', {
            'foo': 'bar'
        }), 'https://example.com/?foo=bar');
    });

    it('should append (to existing, nested) query', () => {
        return assert.equal(urls.appendQuery('https://example.com/test?pq=nm&abc[]=foo&a[b]=c', {
            'abc': [
                'bar'
            ],
            'a': {
                'd': 'e'
            }
        }), encodeURI('https://example.com/test?pq=nm&abc[0]=foo&abc[1]=bar&a[b]=c&a[d]=e'));
    });

    it('should append nothing to nothing', () => {
        return assert.equal(urls.appendQuery('https://example.com/', {}), 'https://example.com/');
    });
});

describe('urls#join', () => {
    it('should return null if input is invalid', () => {
        return assert.equal(urls.join(null, null), null);
    });

    it('should return null if input is valid but empty', () => {
        return assert.equal(urls.join('', ''), null);
    });

    it('should fail to join two absolute URLs', () => {
        return assert.deepEqual(urls.join('http://example.com', 'https://example.org'), null);
    });

    it('should fail to join two relative URLs', () => {
        return assert.deepEqual(urls.join('/abc', '/xyz'), null);
    });

    it('should join valid base URL and valid path', () => {
        return assert.deepEqual(urls.join('http://example.com', '/test'), 'http://example.com/test');
    });

    it('should join valid base URL and valid path without leading slash', () => {
        return assert.deepEqual(urls.join('http://example.com', 'test'), 'http://example.com/test');
    });
});
