import { GridFsStorage } from 'multer-gridfs-storage';
import Multimedias from '../../../db/models/Multimedia.js';
import mongoose from 'mongoose';
import crypto from 'crypto';
import multer from 'multer';

class MultimediaController {
	static async getAll(req, res) {
		try {
			const data = await Multimedias.find({});
			res.send({
				error: false,
				data,
			});
		} catch (error) {
			return {
				error: true,
				data: error,
			};
		}
	}

	static async getVideos(req, res) {
		try {
			const data = await Multimedias.find({ type: 'video' });
			res.send({
				error: false,
				data,
			});
		} catch (error) {
			return {
				error: true,
				data: error,
			};
		}
	}

	/* { type: 'video', data: { name: String, description: String, src: String }} */
	static async postVideo(req, res) {
		try {
			const body = req.body;
			if (body.type != 'video')
				return res.send({
					error: true,
					data: 'Type must be "video" to upload some video on multimedia',
				});
			const data = await Multimedias.create(body);
			res.send({
				error: false,
				data,
			});
		} catch (error) {
			res.send({
				error: true,
				data: error,
			});
		}
	}

	static async getAudios(req, res) {
		try {
			const data = await Multimedias.find({ type: 'audio' });
			res.send({
				error: false,
				data,
			});
		} catch (error) {
			return {
				error: true,
				data: error,
			};
		}
	}

	/* { type: 'audio', data: { name: String, description: String, src: String }} */
	static async postAudio(req, res) {
		try {
			const body = req.body;
			if (body.type != 'audio')
				return res.send({
					error: true,
					data: 'Type must be "audio" to upload some audio on multimedia',
				});
			const data = await Multimedias.create(body);
			res.send({
				error: false,
				data,
			});
		} catch (error) {
			res.send({
				error: true,
				data: error,
			});
		}
	}

	static async getTips(req, res) {
		try {
			const data = await Multimedias.find({ type: 'tip' });
			res.send({
				error: false,
				data,
			});
		} catch (error) {
			return {
				error: true,
				data: error,
			};
		}
	}

	/* { type: 'tip', data: { name: String, description: String }} */
	static async postTip(req, res) {
		try {
			const body = req.body;
			if (body.type != 'tip')
				return res.send({
					error: true,
					data: 'Type must be "tip" to upload some tip on multimedia',
				});
			const data = await Multimedias.create(body);
			res.send({
				error: false,
				data,
			});
		} catch (error) {
			res.send({
				error: true,
				data: error,
			});
		}
	}

	static async getTexts(req, res) {
		try {
			const data = await Multimedias.find({ type: 'text' });
			res.send({
				error: false,
				data,
			});
		} catch (error) {
			return {
				error: true,
				data: error,
			};
		}
	}

	/* { type: 'text', data: { name: String, description: String }} */
	static async postText(req, res) {
		try {
			const body = req.body;
			if (body.type != 'text')
				return res.send({
					error: true,
					data: 'Type must be "text" to upload some text on multimedia',
				});
			const data = await Multimedias.create(body);
			res.send({
				error: false,
				data,
			});
		} catch (error) {
			res.send({
				error: true,
				data: error,
			});
		}
	}

	static async upload(req, res) {
		try {
			const file = req?.file;
			res.json({ file });
		} catch (error) {
			return {
				error: true,
				data: error,
			};
		}
	}

	static async delete(req, res) {
		const id = req.params.id;
		try {
			await Multimedias.findByIdAndDelete(id);
			return {
				error: false,
				data: 'Deleted successfully',
			};
		} catch (error) {
			return {
				error: true,
				data: error,
			};
		}
	}
}

export default MultimediaController;
