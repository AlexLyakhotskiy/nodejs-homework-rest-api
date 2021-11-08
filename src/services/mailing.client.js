const sgMail = require('@sendgrid/mail');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const { SENDGRID_API_KEY, SENDGRID_SENDER, SERVER_URL } = process.env;

class MailingClient {
  async sendVerificationEmail(email, verificationToken) {
    this.setCredentials();

    const verificationUrl = `${SERVER_URL}/api/users/verify/${verificationToken}`;

    return sgMail.send({
      to: email,
      from: SENDGRID_SENDER,
      subject: 'Please verify your email',
      html: `<a href="${verificationUrl}">verify now</a>`,
    });
  }

  setCredentials() {
    sgMail.setApiKey(SENDGRID_API_KEY);
  }
}

exports.mailingClient = new MailingClient();
