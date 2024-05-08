import UserModel from '../models/user-model.js'
import bcrypt from 'bcrypt'
import { v4 as createLink } from 'uuid'
import mailService from './mail-service.js'
import tokenService from './token-service.js'
import UserDto from '../dtos/user-dto.js'
class UserService {
  async registration(email, password) {
    const candidate = await UserModel.findOne({ email })
    if (candidate) {
      throw new Error(`Пользователь с почтовым адресом ${email} уже существует`)
    }

    const hashpassword = await bcrypt.hash(password, 3)
    const activationLink = createLink()

    const user = await UserModel.create({
      email,
      password: hashpassword,
      activationLink,
    })
    await mailService.sendActivationMail(
      email,
      `${process.env.API_URL}/activated/${activationLink}`
    )

    const userDto = new UserDto(user)
    const tokens = tokenService.generateToken({ ...userDto })
    await tokenService.saveToken(userDto.id, tokens.refreshToken)

    return { ...tokens, user: userDto }
  }
}

export default new UserService()
