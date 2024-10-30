import { config } from 'dotenv';
config();

export default {
    client_id: process.env.coros_client_id,
    client_secret: process.env.coros_client_secret,
    base_url: 'https://open.coros.com',
    production: {
		account: 'delaf@coros.com',
        password: '123456',
        url: 'http://open.coros.com',
	},
    test: {
        account: 'delaf@coros.com',
        password: '123456',
        url: 'http://opentest.coros.com',
    },
    grant_type: 'authorization_code',
    redirect_uri: 'https://delaf.click',
};
