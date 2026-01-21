export class InternalServerError extends Error {
  constructor({ cause }) {
    super('Um erro interno inesperado aconteceu.', {
      cause: cause,
    })
    this.name = 'InternalServerError'
    this.action = 'Entre em contato com o suporte'
    this.statusCode = 500
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
