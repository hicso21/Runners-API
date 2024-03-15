import { config } from 'dotenv';
config();

export default {
	base_url: 'https://api.brevo.com',
	host: process.env.brevo_smtp,
	port: process.env.brevo_port,
	user: process.env.brevo_user,
	pass: process.env.brevo_pass,
	api_key: process.env.brevo_api_key,
	recovery_template_id: process.env.brevo_recovery_password_template_id,
};
