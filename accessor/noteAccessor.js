const queryString = require('query-string');
const configAccessor = require('./configAccessor');
const userAccessor = require('./userAccessor');

const NOTE_URL = `${configAccessor.getApiUrl()}notes/`;

if (typeof fetch === 'undefined') {
  global.fetch = require('node-fetch');
}

const noteAccessor = {
  /**
   * GET /api/notes/?rowPerPage=&pageNumber=&
   * Get all notes belonging to current user.
   * Pagination supported.
   * @param  {Object}  query {rowPerPage, pageNumber}
   *                         Note that pageNumber starts from 1.
   */
  async getNotesByQueryAsync(query) {
    let getNotesUrl = NOTE_URL;
    if (query) {
      const queryParams = {};
      queryParams.rowPerPage = query.rowPerPage;
      queryParams.pageNumber = query.pageNumber;
      getNotesUrl += `? + ${queryString.stringify(queryParams)}`;
    }
    const response = await fetch(getNotesUrl, {
      method: 'GET',
      headers: userAccessor.getAuthHeader(),
    });
    const responseJson = await response.json();
    console.log('getNotesByQueryAsync response:', responseJson);
    return responseJson;
  },
  /**
   * POST /api/notes/
   * @param  {String}  content
   */
  async createNoteAsync(content) {
    const createNoteUrl = NOTE_URL;
    const body = { content };
    const response = await fetch(createNoteUrl, {
      method: 'POST',
      headers: userAccessor.getAuthHeader(),
      body: JSON.stringify(body),
    });
    const responseJson = await response.json();
    console.log('createNoteAsync reponse:', responseJson);
    return responseJson;
  },
  /**
   * PUT /api/notes/:noteId
   * @param  {Number}  noteId  the id of the note being modified.
   * @param  {String}  content new content
   */
  async updateNoteAsync(noteId, content) {
    const updateNoteUrl = `${NOTE_URL}${noteId}/`;
    const body = { content };
    const response = await fetch(updateNoteUrl, {
      method: 'PUT',
      headers: userAccessor.getAuthHeader(),
      body: JSON.stringify(body),
    });
    const responseJson = await response.json();
    console.log('updateNoteUrl reponse:', responseJson);
    return responseJson;
  },
  /**
   * DELETE /api/notes/:noteId
   * @param  {Number}  noteId the id of the note being deleted.
   */
  async deleteNoteAsync(noteId) {
    const deleteNoteUrl = `${NOTE_URL}${noteId}/`;
    const response = await fetch(deleteNoteUrl, {
      method: 'DELETE',
      headers: userAccessor.getAuthHeader(),
    });
    const responseJson = await response.json();
    console.log('deleteNoteAsync reponse:', responseJson);
    return responseJson;
  },
};

module.exports = noteAccessor;
