import RunnersServices from '../../../services/v1/Runners/runners.services.js';
import SuuntoService from '../../../services/v1/Suunto/suunto.services.js';

class SuuntoController {
	static async getUser(req, res) {
		try {
		} catch (error) {
			return {
				error: true,
				data: error,
			};
		}
	}

	static async auth(req, res) {
		try {
			const id = req.params.db_id;
			const uri = SuuntoService.authorize(id);
			res.redirect(uri);
		} catch (error) {
			return {
				error: true,
				data: error,
			};
		}
	}

	static async getToken(req, res) {
		try {
			const id = req.params.db_id;
			const redirect_uri = req.href.split('?')[0];
			const { code } = req.query;
			const tokens = SuuntoService.token(redirect_uri, code);
			const { access_token, token_type, refresh_token } = tokens;

			const response = RunnersServices.update(id, {
				access_token,
				token_type,
				refresh_token,
			});
			if (response.error)
				res.send(
					'<h2>Ocurrió un error en la autorización, intenta nuevamente.</h2>'
				);
			else res.send('<h2>Vuelve a la app</h2>');
		} catch (error) {
			return {
				error: true,
				data: error,
			};
		}
	}
}

export default SuuntoController;
