const queryString = require('query-string');
const configAccessor = require('./configAccessor');
const userAccessor = require('./userAccessor');

const SHARE_URL = `${configAccessor.getApiUrl()}sharing/`;

if (typeof fetch === 'undefined') {
  global.fetch = require('node-fetch');
}

const sharingAccessor = {
  /**
   * GET /api/sharing/
   * Get all notes shared to the current user.
   * Pagination supported.
   * @param  {Object}  query {rowPerPage, pageNumber}
   *                         Note that pageNumber starts from 1.
   */
  async getNotesSharedWithMeByQueryAsync(query) {
    let getSharingUrl = SHARE_URL;
    if (query) {
      const queryParams = {};
      queryParams.rowPerPage = query.rowPerPage;
      queryParams.pageNumber = query.pageNumber;
      getSharingUrl += `? + ${queryString.stringify(queryParams)}`;
    }
    const response = await fetch(getSharingUrl, {
      method: 'GET',
      headers: userAccessor.getAuthHeader(),
    });
    const responseJson = await response.json();
    console.log('getNotesSharedWithMeByQueryAsync response:', responseJson);
    return responseJson;
  },
  /**
   * POST /api/sharing/
   * Share noteId to userId with permission
   * @param  {Number}  noteId
   * @param  {Number}  userId
   * @param  {String}  permission  EDIT or VIEW
   */
  async shareNoteWithUserAsync(noteId, userId, permission) {
    const shareNoteUrl = SHARE_URL;
    const body = { noteId, userId, permission };
    const response = await fetch(shareNoteUrl, {
      method: 'POST',
      headers: userAccessor.getAuthHeader(),
      body: JSON.stringify(body),
    });
    const responseJson = await response.json();
    console.log('shareNoteWithUserAsync reponse:', responseJson);
    return responseJson;
  },
  /**
   * PUT /api/sharing/:noteId/:userId
   * update the permission of noteId shared with userId
   * @param  {Number}  noteId
   * @param  {Number}  userId
   * @param  {String}  permission  EDIT or VIEW
   */
  async updatePermissionForSharedNoteAsync(noteId, userId, permission) {
    const updatePermissionUrl = `SHARE_URL${noteId}/${userId}/`;
    const body = { permission };
    const response = await fetch(updatePermissionUrl, {
      method: 'PUT',
      headers: userAccessor.getAuthHeader(),
      body: JSON.stringify(body),
    });
    const responseJson = await response.json();
    console.log('updatePermissionForSharedNoteAsync reponse:', responseJson);
    return responseJson;
  },
  /**
   * DELETE /api/sharing/:noteId/:userId
   * Stop sharing noteId with userId.
   * @param  {Number}  noteId
   * @param  {Number}  userId
   */
  async stopSharingNoteWithUserAsync(noteId, userId) {
    const deleteSharingUrl = `SHARE_URL${noteId}/${userId}/`;
    const response = await fetch(deleteSharingUrl, {
      method: 'DELETE',
      headers: userAccessor.getAuthHeader(),
    });
    const responseJson = await response.json();
    console.log('stopSharingNoteWithUserAsync reponse:', responseJson);
    return responseJson;
  },
};

module.exports = sharingAccessor;
