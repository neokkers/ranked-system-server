const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_LOGIN,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const getPasswordResetURL = (user, token) =>
  `https://loyaltip.net/set-new-password/${user._id}/${token}`;
const getEmailConfirmationURL = (user, token) =>
  `https://loyaltip.net/email-confirmation/${user._id}/${token}`;

const resetPasswordTemplate = (user, url) => {
  const from = process.env.EMAIL_LOGIN;
  const to = user.email;
  const subject = "Восстановление пароля";
  const html = `
  <p>Здравствуйте ${user.name || user.email}!</p>
  <p>Данная ссылка поможет вам сбросить пароль</p>
  <a href=${url}>${url}</a>
  <p>Срок действия ссылки - 1 час</p>
  <p>Хорошего дня, не забывайте проводить больше времени на свежем воздухе!</p>
  <p>Ваша команда Loyaltip</p>
  `;

  return { from, to, subject, html };
};
const getRegisterTemplate = (user) => {
  const from = process.env.EMAIL_LOGIN;
  const to = user.email;
  const subject = "Регистрация на Loyaltip.net";
  const html = `
  <p>Здравствуйте ${user.name || user.email}!</p>
  <p>Вы успешно зарегистрированы на платформе программ лояльности Loyaltip</p>
  <p>Хорошего дня!</p>
  `;

  return { from, to, subject, html };
};

module.exports = {
  transporter,
  getPasswordResetURL,
  resetPasswordTemplate,
  getRegisterTemplate,
  getEmailConfirmationURL,
};
