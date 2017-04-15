const queryBuilder = {
  /**
   * DIRECTLY modify the query object's limit and offset based on the params.
   * @param  {Object}  query the query object to be filled in
   * @param  {Number}  rowPerPage
   * @param  {Number}  pageNumber
   */
  page(query, rowPerPage, pageNumber) {
    if (query && rowPerPage && !isNaN(rowPerPage) && Number(rowPerPage) > 0) {
      const pageNum = (pageNumber && !isNaN(pageNumber)) ? Number(pageNumber) : 1;
      query.limit = Number(rowPerPage);// total number tuples returned
      query.offset = Number(rowPerPage * (pageNum - 1));// skip this many tuples
    }
  },
  orderByCreatedAt(query) {
    if (query) {
      query.order = [['createdAt', 'DESC']];
    }
  },
  orderBy(query, fieldString, isAscending) {
    if (query) {
      query.order = [[fieldString, (isAscending ? 'ASC' : 'DESC')]];
    }
  },
};

module.exports = queryBuilder;
