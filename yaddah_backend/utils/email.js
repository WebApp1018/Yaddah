const mailConfig = require('../mailConfig.json');

const nodemailer = require('nodemailer');
const postmarkTransport = require('nodemailer-postmark-transport');
const { SES } = require('aws-sdk');
const pug = require('pug');

module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    // this.firstName = user.name.split(' ')[0];
    this.firstName = user?.firstName || user?.fullName;
    this.url = url;
    this.from = `Yaddah <${mailConfig.EMAIL_FROM}>`;
  }

  newTransport() {
    if (mailConfig.SERVICE === 'SENDGRID') {
      // Sendgrid
      return nodemailer.createTransport({
        service: 'SendGrid',
        auth: {
          user: mailConfig.SENDGRID_USERNAME,
          pass: mailConfig.SENDGRID_PASSWORD,
        },
      });
    } else if (mailConfig.SERVICE === 'POSTMARK') {
      return nodemailer.createTransport(
        postmarkTransport({ auth: { apiKey: mailConfig.POSTMARK_KEY } })
      );
    } else if (mailConfig.SERVICE === 'GMAIL') {
      return nodemailer.createTransport({
        host: mailConfig.HOST,
        port: mailConfig.PORT,
        auth: { user: mailConfig.USER, pass: mailConfig.PASSWORD },
      });
      // transporter.verify().then(console.log).catch(console.error);
    } else if (mailConfig.SERVICE === 'OFFICE365') {
      return nodemailer.createTransport({
        host: mailConfig.HOST,
        port: mailConfig.PORT,
        auth: { user: mailConfig.USER, pass: mailConfig.PASSWORD },
      });
      // transporter.verify().then(console.log).catch(console.error);
    } else if (mailConfig.SERVICE === 'SMTP') {
      return nodemailer.createTransport({
        host: mailConfig.HOST,
        port: mailConfig.PORT,
        auth: { user: mailConfig.USER, pass: mailConfig.PASSWORD },
      });
      // transporter.verify().then(console.log).catch(console.error);
    }
  }

  // Send the actual email
  async send(template, subject, payload) {
    // 1) Render HTML based on a pug template
    const html = pug.renderFile(`${__dirname}/../views/email/${template}.pug`, {
      firstName: this.firstName,
      url: this.url,
      to: this.to,
      subject,
      payload,
    });

    if (mailConfig.SERVICE === 'AWSSES') {
      // Amazon SES configuration
      const SESConfig = {
        apiVersion: mailConfig.API_VERSION,
        accessKeyId: mailConfig.AWS_ACCESS_KEY,
        secretAccessKey: mailConfig.AWS_SECRET_KEY,
        region: mailConfig.AWS_SES_REGION,
      };

      const params = {
        Source: mailConfig.EMAIL_FROM,
        Destination: { ToAddresses: [this.to] },
        ReplyToAddresses: [],
        Message: {
          Body: { Html: { Charset: 'UTF-8', Data: html } },
          Subject: { Charset: 'UTF-8', Data: subject || '' },
        },
      };

      await new SES(SESConfig)
        .sendEmail(params)
        .promise()
        .catch((err) => console.log(err));
    } else {
      // 2) Define email options
      const mailOptions = { from: this.from, to: this.to, subject, html };

      // 3) Create a transport and send email
      await this.newTransport().sendMail(mailOptions);
      console.log('in1');
    }
  }

  async sendWelcomeEmail(payload) {
    await this.send('welcome', 'Welcome To Yaddah!', payload);
  }

  async sendPasswordReset() {
    await this.send(
      'passwordReset',
      'Your password reset token (valid for only 10 minutes)'
    );
  }

  async accountRejectionEmail(payload) {
    await this.send(
      'accountRejectionEmail',
      'Account Request Rejected',
      payload
    );
  }

  async bookingConfirmedEmail(payload) {
    await this.send(
      'bookingConfirmedEmail',
      'Your Booking Has Been Confirmed',
      payload
    );
  }

  async sendPasswordEmail(payload) {
    await this.send('sendPasswordEmail', 'Password Email', payload);
  }

  async sendPasswordResetConfirmation() {
    await this.send('passwordReset', 'Yaddah Password Change Notification');
  }
};
