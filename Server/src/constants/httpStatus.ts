const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  APPECTED: 202,
  NO_CONTENT: 204,
  UNPROCESSABLE_ENITY: 422,
  UNAUTHORIED: 401,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 501
} as const
// giúp không thể sửa thông số của object
export default HTTP_STATUS
