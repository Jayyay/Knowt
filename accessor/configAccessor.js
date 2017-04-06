const configAccessor = {
  getUrl() {
    let url = window.location.href;
    const hashTagIndex = url.indexOf('#');
    const questionMarkIndex = url.indexOf('?');
    if (hashTagIndex >= 0) {
      url = url.substring(0, hashTagIndex);
    }
    if (questionMarkIndex >= 0 && questionMarkIndex < url.length) {
      url = url.substring(0, questionMarkIndex);
    }
    return url;
  },
  getApiUrl() {
    const url = this.getUrl();
    if (url.endsWith('/')) {
      return `${url}api/`;
    }
    return `${url}/api/`;
  },
};

module.exports = configAccessor;
