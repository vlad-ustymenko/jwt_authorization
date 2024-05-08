export default class UserDto {
  email
  id
  isActivayed

  constructor(model) {
    this.email = model.email
    this.id = model._id
    this.isActivated = model.isActivated
  }
}
