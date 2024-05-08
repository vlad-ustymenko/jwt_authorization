import jwt from 'jsonwebtoken'
import tokenModel from '../models/token-model.js'

class TokenService {
  generateToken(payload) {
    const accesToken = jwt.sign(payload, process.env.JWT_ACCES_SECRET, {
      expiresIn: '15s',
    })
    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
      expiresIn: '30d',
    })
    return { accesToken, refreshToken }
  }

  async saveToken(userId, refreshToken) {
    const tokenData = await tokenModel.findOne({ user: userId })
    if (tokenData) {
      tokenData.refreshToken = refreshToken
      return tokenData.save()
    }
    const token = await tokenModel.create({
      user: userId,
      refreshToken,
    })
    return token
  }
}

export default new TokenService()
