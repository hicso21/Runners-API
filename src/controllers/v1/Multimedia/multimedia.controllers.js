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
