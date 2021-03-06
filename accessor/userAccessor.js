const queryString = require('query-string');
const configAccessor = require('./configAccessor');
const _ = require('lodash');

const URL = configAccessor.getUrl();
const API_URL = configAccessor.getApiUrl();
const USER_KEY = 'userInfo';
const OAUTH_URL = 'https://oauth.oit.duke.edu/oauth/authorize.php';
const CLIENT_ID = 'knowt';

if (typeof fetch === 'undefined') {
  global.fetch = require('node-fetch');
}

function _getAccessTokenFromURL() {
  const url = window.location.href;
  const regex = new RegExp('access_token(=([^&#]*)|&|#|$)');
  const results = regex.exec(url);
  return results ? results[2] : undefined;
}

function _getLoginQueryString() {
  const qs = queryString.stringify({
    response_type: 'token',
    redirect_uri: URL,
    client_id: CLIENT_ID,
    scope: 'basic identity:netid:read',
    state: 17283,
  });
  return `?${qs}`;
}

async function _loginAsync(credentials) {
  const loginUrl = `${URL}login/`;
  const body = {
    username: credentials.username || undefined,
    password: credentials.password || undefined,
    accessToken: credentials.accessToken || undefined,
  };
  const response = await fetch(loginUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const responseJson = await response.json();
  console.log(responseJson);
  if (responseJson.status === 'success') {
    localStorage.setItem(USER_KEY, JSON.stringify(responseJson.data));
  } else {
    localStorage.removeItem(USER_KEY);
  }
  return responseJson;
}

const userAccessor = {
  getAuthHeader() {
    return {
      Authorization: `JWT ${this.getToken()}`,
      'Content-Type': 'application/json',
    };
  },
  getUserInfo() {
    return JSON.parse(localStorage.getItem(USER_KEY));
  },
  isLoggedIn() {
    const token = this.getToken();
    const id = this.getId();
    return token && !isNaN(id);
  },
  isRedirected() {
    return !!_getAccessTokenFromURL();
  },
  getCachedUserInfo() {
    return JSON.parse(localStorage.getItem(USER_KEY));
  },
  getId() {
    const user = this.getUserInfo();
    return user ? user.id : undefined;
  },
  getToken() {
    const user = this.getUserInfo();
    return user ? user.token : undefined;
  },
  getEmail() {
    const user = this.getUserInfo();
    return user ? user.email : undefined;
  },
  getDisplayName() {
    const user = this.getUserInfo();
    return user ? user.displayName : undefined;
  },
  /**
   * @param {string} username
   * @param {string} password
   */
  async loginAsync(username, password) {
    return _loginAsync({ username, password });
  },
  async loginWithAccessToken() {
    await _loginAsync({ accessToken: _getAccessTokenFromURL() });
    window.location.replace(URL);
  },
  loginWithNetId() {
    window.location.replace(OAUTH_URL + _getLoginQueryString());
  },
  logout() {
    localStorage.removeItem(USER_KEY);
  },
  /**
   * POST /signup
   * No error checking is done so make sure you pass in the valid data
   * Which means some basic sanity checking should be performed in client side.
   *  (e.g. email format, username length, password strength etc)
   * @param  {String}  username
   * @param  {String}  password
   * @param  {String}  displayName
   * @param  {String}  email
   */
  async signUpAsync(username, password, displayName, email) {
    const signUpUrl = `${URL}signup/`;
    const body = { username, password, displayName, email };
    const response = await fetch(signUpUrl, {
      method: 'POST',
      headers: this.getAuthHeader(),
      body: JSON.stringify(body),
    });
    const responseJson = await response.json();
    console.log('signUpAsync response:', responseJson);
    return responseJson;
  },
  /**
   * GET /api/users/all
   * Get all users with their basic information.
   * Pagination supported.
   * @param  {Object}  query {rowPerPage, pageNumber}
   *                         Note that pageNumber starts from 1.
   */
  async getAllUsersByQueryAsync(query) {
    let getUsersUrl = `${API_URL}users/all`;
    if (query) {
      const queryParams = {};
      queryParams.rowPerPage = query.rowPerPage;
      queryParams.pageNumber = query.pageNumber;
      getUsersUrl += `? + ${queryString.stringify(queryParams)}`;
    }
    const response = await fetch(getUsersUrl, {
      method: 'GET',
      headers: this.getAuthHeader(),
    });
    const responseJson = await response.json();
    console.log('getAllUsersByQuery response:', responseJson);
    return responseJson;
  },
  /**
   * GET /api/user/
   * Get all current user's information, excluding password.
   */
  async getUserAsync() {
    const getUsersUrl = `${API_URL}users/`;
    const response = await fetch(getUsersUrl, {
      method: 'GET',
      headers: this.getAuthHeader(),
    });
    const responseJson = await response.json();
    console.log('getUser response:', responseJson);
    return responseJson;
  },
  /**
   * PUT /api/user/
   * @param  {Object}  update {displayName, email, password} (fields are all optional)
   */
  async updateUserAsync(update) {
    const updateUserUrl = `${API_URL}users/`;
    const body = {
      displayName: update.displayName || undefined,
      email: update.email || undefined,
      password: update.password || undefined,
    };
    const response = await fetch(updateUserUrl, {
      method: 'PUT',
      headers: this.getAuthHeader(),
      body: JSON.stringify(body),
    });
    const responseJson = await response.json();
    console.log('updateUserInfoAsync reponse:', responseJson);
    return responseJson;
  },
};

module.exports = userAccessor;
