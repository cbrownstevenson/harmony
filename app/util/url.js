const url = require('url');

/**
 * Returns the protocol (http or https) depending on whether using localhost or not
 *
 * @param {http.IncomingMessage} req The incoming request whose URL should be gleaned
 * @returns {string} The protocol (http or https) to use for public Harmony URLs
 */
function _getProtocol(req) {
  const host = req.get('host');
  return (host.startsWith('localhost') || host.startsWith('127.0.0.1')) ? 'http' : 'https';
}

/**
 * Returns the full string URL being accessed by a http.IncomingMessage, "req" object
 *
 * @param {http.IncomingMessage} req The incoming request whose URL should be gleaned
 * @param {boolean} includeQuery Include the query string in the returned URL (default: true)
 * @returns {string} The URL the incoming request is requesting
 */
function getRequestUrl(req, includeQuery = true) {
  return url.format({
    protocol: _getProtocol(req),
    host: req.get('host'),
    pathname: req.originalUrl.split('?')[0],
    query: includeQuery ? req.query : null,
  });
}

/**
 * Returns the full string URL being accessed by a http.IncomingMessage, "req" object
 * after removing any trailing slashes from the path
 *
 * @param {http.IncomingMessage} req The incoming request whose URL should be gleaned
 * @param {boolean} includeQuery Include the query string in the returned URL (default: true)
 * @returns {string} The URL the incoming request is requesting
 */
function getSanitizedRequestUrl(req, includeQuery = true) {
  return url.format({
    protocol: _getProtocol(req),
    host: req.get('host'),
    pathname: req.originalUrl.split('?')[0].replace(/\/+$/, ''),
    query: includeQuery ? req.query : null,
  });
}

/**
 * Returns the root of the request (protocol, host, port, with path = "/")
 *
 * @param {http.IncomingMessage} req The incoming request whose URL should be gleaned
 * @returns {string} The URL the incoming request is requesting
 */
function getRequestRoot(req) {
  return url.format({
    protocol: _getProtocol(req),
    host: req.get('host'),
  });
}

/**
 * Construct the url for the STAC catalog associated with the given job
 *
 * @param {Job} job The job for which to create the STAC catalog link
 * @returns {string} A URL string that is the link to the STAC catalog for the job
 */
function getJobStacCatalogUrl(job) {
  const { request, requestId } = job;
  const requestUrl = new URL(request);
  return `${requestUrl.origin}/stac/${requestId}`;
}

module.exports = {
  getRequestUrl,
  getSanitizedRequestUrl,
  getRequestRoot,
  getJobStacCatalogUrl,
};
