import { v4 as uuidv4 } from 'uuid'

import { checkRequired, createBodyUser, getFieldsUserValidation } from '../../utils'

import { RESPONSE_MESSAGES, STATUS_CODES } from '../../constants'
import { IReq, IUser } from '../../interfaces'

// import { dataBase } from '../../db'

export class UserService {
  static getUsers(req: IReq) {
    const users = req.dataBase.data.users

    return {
      code: STATUS_CODES['200'],
      users,
    }
  }

  static getUser(id: string, req: IReq) {
    const dataBase = req.dataBase

    const currentUser = dataBase.data.users.find((user: IUser) => user.id === id)
    const regexExpUUID = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/gi

    const testUUID = regexExpUUID.test(id)
    if (!testUUID) {
      return {
        code: STATUS_CODES['400'],
        message: RESPONSE_MESSAGES.ID_IS_NOT_UUID,
      }
    }

    if (!currentUser) {
      return {
        code: STATUS_CODES['404'],
        message: RESPONSE_MESSAGES.USER_IS_NOT_EXIST,
      }
    }
    return { code: STATUS_CODES['200'], user: currentUser }
  }

  static addUser(user: IUser, req: IReq) {
    const dataBase = req.dataBase

    if (!user) {
      return {
        code: STATUS_CODES['400'],
        message: RESPONSE_MESSAGES.BODY_IS_REQUIRED,
      }
    }

    const newUser: IUser = { id: uuidv4(), ...createBodyUser(user) }

    const fieldsUserValidation = getFieldsUserValidation(newUser)
    const requiredMessage = checkRequired(fieldsUserValidation, 'required', 'requiredMessage')
    if (requiredMessage) {
      return {
        code: STATUS_CODES['400'],
        message: requiredMessage,
      }
    }

    const validationRulesMessage = checkRequired(fieldsUserValidation, 'validationRules', 'validationMessage')
    if (validationRulesMessage) {
      return {
        code: STATUS_CODES['400'],
        message: validationRulesMessage,
      }
    }

    dataBase.data.users.push(newUser)

    dataBase.update(dataBase.data)

    return {
      code: STATUS_CODES['201'],
      user: newUser,
    }
  }

  static updateUser(id: string, user: IUser, req: IReq) {
    const dataBase = req.dataBase

    if (!user) {
      return {
        code: STATUS_CODES['400'],
        message: RESPONSE_MESSAGES.BODY_IS_REQUIRED,
      }
    }

    const currentUser: IUser | undefined = dataBase.data.users.find((user: IUser) => user.id === id)
    const fieldsUserValidation = getFieldsUserValidation({ ...createBodyUser(user), id })

    const regexExpUUID = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/gi
    const testUUID = regexExpUUID.test(id)
    if (!testUUID) {
      return {
        code: STATUS_CODES['400'],
        message: RESPONSE_MESSAGES.ID_IS_NOT_UUID,
      }
    }

    if (!currentUser) {
      return {
        code: STATUS_CODES['404'],
        message: RESPONSE_MESSAGES.USER_IS_NOT_EXIST,
      }
    }
    const requiredMessage = checkRequired(fieldsUserValidation, 'required', 'requiredMessage')
    if (requiredMessage) {
      return {
        code: STATUS_CODES['400'],
        message: requiredMessage,
      }
    }
    const validationRulesMessage = checkRequired(fieldsUserValidation, 'validationRules', 'validationMessage')
    if (validationRulesMessage) {
      return {
        code: STATUS_CODES['400'],
        message: validationRulesMessage,
      }
    }
    const newUser = { ...currentUser, ...createBodyUser(user), id }

    dataBase.data.users = dataBase.data.users.map((userDB: IUser) => (userDB.id === newUser.id ? newUser : userDB))

    dataBase.update(dataBase.data)

    return {
      code: STATUS_CODES['200'],
      user: newUser,
    }
  }

  static deleteUser(id: string, req: IReq) {
    const dataBase = req.dataBase

    const currentUser = dataBase.data.users.find((user: IUser) => user.id === id)

    const regexExpUUID = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/gi
    const testUUID = regexExpUUID.test(id)
    if (!testUUID) {
      return {
        code: STATUS_CODES['400'],
        message: RESPONSE_MESSAGES.ID_IS_NOT_UUID,
      }
    }

    if (!currentUser) {
      return {
        code: STATUS_CODES['404'],
        message: RESPONSE_MESSAGES.USER_IS_NOT_EXIST,
      }
    }
    dataBase.data.users = dataBase.data.users.filter((user: IUser) => user.id !== id)

    dataBase.update(dataBase.data)

    return {
      code: STATUS_CODES['204'],
      message: RESPONSE_MESSAGES.USER_WAS_REMOVED,
    }
  }
}
