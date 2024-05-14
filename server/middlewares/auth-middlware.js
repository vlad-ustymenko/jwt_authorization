import ApiError from '../exceptions/api-errors.js'
import tokenService from '../service/token-service.js'

export default function (req, res, next) {
  try {
    const authorizationHeader = req.headers.authorization
    if (!authorizationHeader) {
      return next(ApiError.UnuatorizedError())
    }
    const accessToken = authorizationHeader.split(' ')[1]
    if (!accessToken) {
      return next(ApiError.UnuatorizedError())
    }

    const userData = tokenService.validateaccessToken(accessToken)
    if (!userData) {
      return next(ApiError.UnuatorizedError())
    }
    req.user = userData
    next()
  } catch (e) {
    return next(ApiError.UnuatorizedError())
  }
}
