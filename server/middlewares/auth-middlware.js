import ApiError from '../exceptions/api-errors.js'
import tokenService from '../service/token-service.js'

export default function (req, res, next) {
  try {
    const authorizationHeader = req.headers.authorization
    if (!authorizationHeader) {
      return next(ApiError.UnuatorizedError())
    }
    const accesToken = authorizationHeader.split(' ')[1]
    if (!accesToken) {
      return next(ApiError.UnuatorizedError())
    }

    const userData = tokenService.validateAccesToken(accesToken)
    if (!userData) {
      return next(ApiError.UnuatorizedError())
    }
    req.user = userData
    next()
  } catch (e) {
    return next(ApiError.UnuatorizedError())
  }
}
