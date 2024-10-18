import nodemailer from 'nodemailer'


const emailRegister = async (datos) => {
const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  const {email, name, token} = datos;
  //Enviar el mail
  await transport.sendMail({
    from: 'BienesRaices.com',
    to: email,
    subject: 'Confirmar cuenta en Bienes Raices',
    text: 'Confirmar cuenta en Bienes Raices',
    html: `
    <p>Hola ${name}, comprueba tu cuenta en Bienes Raices </p>
    <p>Debes clickear en el enlace para confirmar la creación de tu cuenta: 
    <a href="${process.env.BACKEND_URL}:${process.env.PORT ?? 3000}/auth/confirm-user/${token}">Confirmar cuenta</a></p>
    `
  })
}

const emailForgotPassword = async (datos) => {
  const transport = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
  
    const {email, name, token} = datos;
    //Enviar el mail
    await transport.sendMail({
      from: 'BienesRaices.com',
      to: email,
      subject: 'Reestablecer tu contraseña en Bienes Raices',
      text: 'Reestablecer tu contraseña en Bienes Raices',
      html: `
      <p>Hola ${name}, reestablece tu contraseña en Bienes Raices </p>
      <p>Debes clickear en el enlace para reestablecer la contraseña de tu cuenta: 
      <a href="${process.env.BACKEND_URL}:${process.env.PORT ?? 3000}/auth/forgot-password/${token}">Confirmar nueva contraseña</a></p>
      `
    })
  }


export {
    emailRegister,
    emailForgotPassword
}