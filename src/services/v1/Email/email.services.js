import nodemailer from 'nodemailer';
import { user, pass } from '../../../config/mail.config.js';
import html from './templates/passwordRecovery.js';

export default class EmailServices {
	static async sendEmail(email, subject, text) {
		let transporter = nodemailer.createTransport({
			// host: 'smtp.gmail.com',
			// port: 587,
			service: 'gmail',
			auth: {
				user,
				pass,
			},
			tls: {
				rejectUnauthorized: false,
			},
		});

		let mailOptions = {
			from: `DELAF ${user}`,
			to: email,
			subject,
			text,
			html,
			attachments: [
				{
					filename: 'DELAF.jpg',
					path: '../../../../../public/images/DELAF.jpg',
					cid: 'logo',
				},
			],
		};

		transporter
			.sendMail(mailOptions)
			.then((info) => {
				console.log(info);
			})
			.catch(console.error);
	}
}
