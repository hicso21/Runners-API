import GlobalChats from './src/db/models/GlobalChat.js';
import UserChats from './src/db/models/UserChat.js';

export default async function sockets(io) {
	io.on('connection', async (socket) => {
		console.log('An user has connected!');

		socket.on('global chat', async (msg, serverOffset) => {
 			let result;
			try {
				result = await GlobalChats.create(msg);
				result.save();
                console.log(result.createdAt);
                console.log(new Date(result.createdAt).getTime());
			} catch (error) {
				console.error(error);
				return;
			}
			io.emit('global chat', msg, result.createdAt);
		});

		// socket.on('user chat', (msg) => {
		// 	console.log(msg);
		// 	io.emit('user chat', msg);
		// });

		socket.on('disconnect', () => {
			console.log('An user has disconnected');
		});

		if (!socket.recovered) {
			// <- recuperase los mensajes sin conexión
			try {
				//Traer los mensaje desde db
				// const results = db.execute({
				// 	sql: 'SELECT id, content, user FROM messages WHERE id > ?',
				// 	args: [socket.handshake.auth.serverOffset ?? 0],
				// });
				//Enviarselo a los usuarios que se conecten
				// results.rows.forEach((row) => {
				// 	socket.emit('chat message', row.content, row.id.toString());
				// });
			} catch (e) {
				console.error(e);
			}
		}
	});
}
