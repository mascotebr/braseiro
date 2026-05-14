export class InternalServerError extends Error {
  constructor({ cause, statusCode }) {
    super('Um erro interno inesperado aconteceu.', {
      cause: cause,
    })
    this.name = 'InternalServerError'
    this.action = 'Entre em contato com o suporte'
    this.statusCode = statusCode || 500
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      action: this.action,
      status_code: this.statusCode,
    }
  }
}

export class ServiceError extends Error {
  constructor({ message, cause }) {
    super(message || 'O serviço está indisponivel.', {
      cause: cause,
    })
    this.name = 'ServiceError'
    this.action = 'Verfique a disponibilidade do serviço.'
    this.statusCode = 503
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      action: this.action,
      status_code: this.statusCode,
    }
  }
}

export class ValidatorError extends Error {
  constructor({ message, cause, action }) {
    super(message || 'Um erro de validação ocorreu.', {
      cause: cause,
    })
    this.name = 'ValidatorError'
    this.action = action || 'Ajuste os dados enviados.'
    this.statusCode = 400
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      action: this.action,
      status_code: this.statusCode,
    }
  }
}

export class NotFoundError extends Error {
  constructor({ message, cause, action }) {
    super(message || 'Um erro de não encontrado ocorreu.', {
      cause: cause,
    })
    this.name = 'NotFoundError'
    this.action = action || 'Tente novamente com outros dados.'
    this.statusCode = 404
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      action: this.action,
      status_code: this.statusCode,
    }
  }
}

export class UnauthorizedError extends Error {
  constructor({ message, cause, action }) {
    super(message || 'Um erro de não autenticado ocorreu.', {
      cause: cause,
    })
    this.name = 'UnauthorizedError'
    this.action = action || 'Tente novamente com outros dados.'
    this.statusCode = 401
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      action: this.action,
      status_code: this.statusCode,
    }
  }
}

export class MethodNotAllowedError extends Error {
  constructor() {
    super('Metodo não permitido por esse endpoint.')
    this.name = 'MethodNotAllowedError'
    this.action =
      'Verifique se o metodo HTTP enviado é valido para esse endpoint.'
    this.statusCode = 405
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      action: this.action,
      status_code: this.statusCode,
    }
  }
}
