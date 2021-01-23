const bcrypt = require('bcrypt')
const helper = require('../helper/response')
const jwt = require('jsonwebtoken')
const { registerModel, signInModel } = require('../model/user')

module.exports = {
  registerUser: async (request, response) => {
    try {
      const { user_email, user_password } = request.body

      const salt = bcrypt.genSaltSync(10)
      const encryptPassword = bcrypt.hashSync(user_password, salt)

      const setData = {
        user_email,
        user_password: encryptPassword,
        user_created_at: new Date()
      }

      const register = await registerModel(setData)
      return helper.response(response, 200, 'Register Success', register)
    } catch (error) {
      console.log(error)
      return helper.response(response, 400, 'Bad request', error)
    }
  },
  signInUser: async (request, response) => {
    try {
      const { user_email, user_password } = request.body
      const cekEmail = await signInModel(user_email)
      if (cekEmail.length > 0) {
        const checkPass = bcrypt.compareSync(
          user_password,
          cekEmail[0].user_password
        )

        if (checkPass) {
          const { user_id, user_name, user_email } = cekEmail[0]
          const payload = {
            user_id,
            user_name,
            user_email
          }
          const token = jwt.sign(payload, `${process.env.KEY}`, {
            expiresIn: '12h'
          })
          const result = { ...payload, token }
          return helper.response(response, 200, 'Success Login', result)
        } else {
          return helper.response(response, 400, 'Wrong Password')
        }
      } else {
        return helper.response(response, 400, 'Email not registered')
      }
    } catch (error) {
      console.log(error)
      return helper.response(response, 400, 'Bad request', error)
    }
  }
}