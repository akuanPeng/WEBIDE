/* @flow weak */
import { urlJoin, querystring as qs } from './url-helpers'

function getUrlParam (name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = decodeURI(window.location.search).substr(1).match(reg);
    if (r != null) return unescape(r[2]); return null;
}

const defaultRequestOptions = {
  method: 'GET',
  headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
  }
}

let defaultFetchOptions = {
  method: 'GET',
  credentials: "same-origin"
}

function interceptResponse (response) {
  var contentType = response.headers.get('Content-Type')
  if (contentType === 'text/html; charset=UTF-8') return location.href = '/';
  if (contentType && contentType.includes('application/json')) {
    return response.json().then(json => {
	  if (json && json.code === 401) return json
      if (!response.ok) throw {error: true, ...json}
      return json
    })
  } else {
    if (!response.ok) throw response.statusText
    return true
  }
}

function request (_options) {
  var options = {...defaultRequestOptions, ..._options}
  var queryString, fetchOptions
  if (options.json) {
    options.headers['Content-Type'] = 'application/json'
    options.body = options.json
  }

  if (options.form) {
    options.headers['Content-Type'] = 'application/x-www-form-urlencoded'
    options.body = options.form
  }

  if (options.body) {
    options.body = (function () {
      switch (options.headers['Content-Type']) {
        case 'application/json':
          return JSON.parse(options.body)
        case 'application/x-www-form-urlencoded':
          if (options.isfile) {
            return options.body
          } else {
            return qs.stringify(options.body)
          }
        default:
          return options.body
      }
    })()
  }

  fetchOptions = Object.assign({}, defaultFetchOptions, {
    method: options.method,
    headers: options.headers || {},
    body: options.body
  })

  let url = options.url;
  if (options.url.indexOf("http://127.0.0.1:8081") === -1) {
      url = urlJoin(window.perms.uri, options.url) + (options.qs ? '?' : '') + qs.stringify(options.qs);
      fetchOptions.headers['user-token'] = window.perms.token;
      fetchOptions.headers['asset-key'] = window.perms.key;
  } else {
      delete fetchOptions.headers['user-token'];
      delete fetchOptions.headers['asset-key'];
  }
  if (_options.body && _options.body.name) fetchOptions.body = _options.body
  return fetch(url, fetchOptions).then(interceptResponse);
}

function parseMethodArgs (url, data, METHOD) {
  var options = {}
  options.method = METHOD
  if (typeof url === 'object') {
    options = url
  } else if (typeof url === 'string') {
    options.url = url
    switch (METHOD) {
      case 'GET':
      case 'DELETE':
        options.qs = data
        break
      case 'POST':
      case 'PUT':
      case 'PATCH':
        if (data && data.binary) {
            options.isfile = true;
            options.body = data.binary;
        } else options.form = data
        break
      default:
        options.data = data
    }
  }
  return options
}

request.get = function (url, data) {
  return request(parseMethodArgs(url, data, 'GET'))
}

request.post = function (url, data) {
  return request(parseMethodArgs(url, data, 'POST'))
}

request.put = function (url, data) {
  return request(parseMethodArgs(url, data, 'PUT'))
}

request.patch = function (url, data) {
  return request(parseMethodArgs(url, data, 'PATCH'))
}

request.delete = function (url, data) {
  return request(parseMethodArgs(url, data, 'DELETE'))
}

export default request
