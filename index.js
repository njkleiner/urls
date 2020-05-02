/**
* Determine whether a string is a valid URL.
*
* @param {string} value A string for which to determine whether it is a URL.
* @param {string[]} protocols A list of valid protocols. By default, only
* `http` and `https` are valid protocols. If you want to accept any protocol,
* use an empty array as the second argument.
*
* @asserts typeof value === 'string'
*
* @returns {boolean} `true` if `value` is a URL, otherwise `false`.
*/
function isURL(value, protocols) {
    if (value instanceof URL) {
        return isURL(value.toString(), protocols);
    }

    if (!(value && typeof value === 'string')) {
        return false;
    }

    // If no protocols are specified, default to `http(s)?`.
    // NOTE: Because we do no check `protocols.length` and `[]` is truthy,
    // the inner statement will evaluate to `true` if protocols is empty.
    if (!(protocols && Array.isArray(protocols))) {
        protocols = ['http', 'https'];
    }

    let url = null;

    try {
        url = new URL(value);
    } catch (error) {
        return false;
    }

    // Exit early if the range of valid protocols is not restricted.
    if (!protocols.length) {
        return true;
    }

    let {protocol} = url;
    protocol = protocol.replace(/:$/g, '');

    return protocols.includes(protocol);
}

/**
* Test whether a URL is absolute.
*
* @param {string} value The URL to test.
*
* @asserts typeof value === 'string'
*
* @returns {boolean} `true` if the URL is absolute, otherwise `false`.
*/
function isAbsolute(value) {
    if (!(value && typeof value === 'string')) {
        return false;
    }

    return /^[a-zA-Z][0-9a-zA-Z\-+.]+:/.test(value);
}

/**
* Test whether a URL is relative.
*
* @param {string} value The URL to test.
*
* @asserts typeof value === 'string'
*
* @returns {boolean} `true` if the URL is relative, otherwise `false`.
*/
function isRelative(value) {
    if (!(value && typeof value === 'string')) {
        return false;
    }

    return !isAbsolute(value);
}

/**
* Normalize a URL.
*
* @param {string} value The URL to normalize.
*
* @asserts typeof value === 'string'
*
* @returns {string} The normalized URL.
*/
function normalize(value) {
    if (!(value && typeof value === 'string')) {
        return null;
    }

    if (isRelative(value)) {
        value = 'http://' + value.replace(/^\/+/, '');
    }

    try {
        const url = new URL(value);

        return url.toString();
    } catch (error) {
        return null;
    }
}

/**
* Compare two URLs by normalizing them first.
*
* @param {string} left The first URL to compare.
* @param {string} right The second URL to compare.
*
* @asserts isURL(left, []) && isURL(right, [])
*
* @returns {boolean} `true`, if the URLs are equal, otherwise `false`.
*/
function compare(left, right) {
    left = normalize(left);
    right = normalize(right);

    if (!(isURL(left, []) && isURL(right, []))) {
        return false;
    }

    return left.toString() === right.toString();
}

/**
* Test whether a URL matches a specific host.
*
* @param {string} value The URL to test.
* @param {string} host The host to test against.
*
* @asserts isURL(value)
* @asserts typeof host === 'string'
*
* @returns {boolean} `true` if the URL matches the host, otherwise `false`.
*/
function matchesHost(value, host) {
    if (!isURL(value)) {
        return false;
    }

    if (!(host && typeof host === 'string')) {
        return false;
    }

    const url = new URL(value);

    return url.host === host;
}

/**
* Normalize query parameters of a given URL.
*
* @param {string} value A URL from which to extract query parameters.
*
* @asserts isURL(value)
*
* @returns {object} A dictionary containing the query parameters,
* or `null` if `value` is not a valid URL.
*/
function normalizeQuery(value) {
    if (!isURL(value)) {
        return null;
    }

    const url = new URL(value);
    const query = {};

    for(let [key, value] of url.searchParams.entries()) {
        query[key] = value;
    }

    return query;
}

/**
* Join a base URL and a path segment.
*
* @param {string} base The base URL to add the path to.
* @param {string} path The path to add to the base URL.
*
* @asserts isURL(base, [])
* @asserts isRelative(path)
*
* @returns {string} The combined URL, or `null`.
*/
function join(base, path) {
    if (!(isURL(base, []) && isRelative(path))) {
        return null;
    }

    return new URL(path, base).toString();
}

module.exports = Object.freeze({
    isURL, isAbsolute, isRelative, compare, matchesHost,
    normalize, normalizeQuery, join
});
