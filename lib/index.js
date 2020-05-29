const qs = require('qs');
const merge = require('deepmerge');
const isAbsoluteURL = require('is-absolute-url');
const isRelativeURL = require('is-relative-url');

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

    return isAbsoluteURL(value);
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

    return isRelativeURL(value);
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
        let normalized = url.toString();

        if (url.href.endsWith('?') && !url.search.length) {
            normalized = normalized.replace(/\?$/, '');
        }

        if (url.href.endsWith('#') && !url.hash.length) {
            normalized = normalized.replace(/#$/, '');
        }

        return normalized;
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

    return qs.parse(url.search, {'ignoreQueryPrefix': true});
}

/**
* Append query parameters to an existing URL.
*
* @param {string} value The URL to append query parameters to.
* @param {object} query A dictionary of query parameters to append.
*
* @asserts isURL(value)
* @asserts typeof query === 'object'
*
* @return {string} The resulting URL, or `null`.
*/
function appendQuery(value, query) {
    if (!(isURL(value) && typeof query === 'object' && !Array.isArray(query))) {
        return null;
    }

    const {origin, pathname, search, hash} = new URL(value);
    const current = qs.parse(search, {'ignoreQueryPrefix': true});
    const combined = qs.stringify(merge(current, query));

    return normalize(`${origin}${pathname}?${combined}${hash}`);
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
    normalize, normalizeQuery, appendQuery, join
});
