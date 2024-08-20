const nodemailer = require('nodemailer');
const pug = require('pug');
const htmlToText = require('html-to-text');

module.exports = class Email {
    constructor(user, url) {
        this.to = user.email;
        this.firstname = user.name.split(' ')[0];
        this.url = url;
        this.from = `Janos Stelli <${process.env.EMAIL_FROM}>`;
    }

    newTransport() {
        if (process.env.NODE_ENV === 'production') {
            // Configure for production (example with SendGrid)
            return nodemailer.createTransport({
                service: 'SendGrid',
                auth: {
                    user: process.env.SENDGRID_USERNAME,
                    pass: process.env.SENDGRID_PASSWORD,
                },
            });
        }

        // Development transport
        return nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            auth: {
                user: process.env.EMAIL_USERNAME,
                pass: process.env.EMAIL_PASSWORD,
            },
        });
    }

    // send the actual email
    async send(template, subject) {
        // 1) render html based on a pug template

        const html = pug.renderFile(
            `${__dirname}/../views/emails/${template}.pug`,
            {
                firstname: this.firstname,
                url: this.url,
                subject,
            },
        );

        // 2) define email options
        const mailOptions = {
            from: this.from,
            to: this.to,
            subject,
            html,
            text: htmlToText.convert(html),
            // html:
        };

        // 3) create a transport and send email
        await this.newTransport().sendMail(mailOptions);
    }

    async sendWelcome() {
        await this.send('signedUp', 'Welcome to the Natours Website!');
    }
};
