import { config } from 'dotenv';
config();

export default {
    client_id: process.env.polar_client_id,
    client_secret: process.env.polar_client_secret,
    base_url: 'https://www.polaraccesslink.com',
    response_type: 'code',
    oauth_endpoint: 'https://flow.polar.com',
    redirect_uri: 'https://delaf.click/api/v1/polar/exchange_token',
};
