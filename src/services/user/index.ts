import { v4 as uuidv4 } from 'uuid'

import { checkRequired, createBodyUser, getFieldsUserValidation } from '../../utils'

import { RESPONSE_MESSAGES, STATUS_CODES } from '../../constants'
import { IUser } from '../../interfaces'

import { dataBase } from '../../db'

export class UserService {
  static getUsers() {
    return {
      code: STATUS_CODES['200'],
      users: dataBase.users,
    }
  }

  static getUser(id: string) {
    const currentUser = dataBase.users.find((user) => user.id === id)
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

  static addUser(user: IUser) {
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

    // @ts-ignore
    dataBase.users.push(newUser)

    return {
      code: STATUS_CODES['201'],
      user: newUser,
    }
  }

  static updateUser(id: string, user: IUser) {
    if (!user) {
      return {
        code: STATUS_CODES['400'],
        message: RESPONSE_MESSAGES.BODY_IS_REQUIRED,
      }
    }

    const currentUser: IUser | undefined = dataBase.users.find((user) => user.id === id)
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

    dataBase.users = dataBase.users.map((userDB) => (userDB.id === newUser.id ? newUser : userDB))
    return {
      code: STATUS_CODES['200'],
      user: newUser,
    }
  }

  static deleteUser(id: string) {
    const currentUser = dataBase.users.find((user) => user.id === id)

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
    dataBase.users = dataBase.users.filter((user) => user.id !== id)
    return {
      code: STATUS_CODES['204'],
      message: RESPONSE_MESSAGES.USER_WAS_REMOVED,
    }
  }
}
