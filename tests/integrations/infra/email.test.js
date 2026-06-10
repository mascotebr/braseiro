import email from 'infra/email'
import orchastrador from 'tests/orchastrador.js'

beforeAll(async () => {
  await orchastrador.waitForAllServices()
})
describe('infra/email.js', () => {
  test('send()', async () => {
    await orchastrador.deleteAllEmails()
    await email.send({
      from: 'Braseiro <contato@braseiro.com.br>',
      to: 'contato@braseiro.com.br',
      subject: 'Teste de assunto',
      text: 'Teste de corpo.',
    })

    const lastEmail = await orchastrador.getLastEmail()

    expect(lastEmail.sender).toBe('<contato@braseiro.com.br>')
    expect(lastEmail.recipients[0]).toBe('<contato@braseiro.com.br>')
    expect(lastEmail.subject).toBe('Teste de assunto')
    expect(lastEmail.text).toBe('Teste de corpo.\n')
  })
})
