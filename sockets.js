import GlobalChats from './src/db/models/GlobalChat.js';
import UserChats from './src/db/models/UserChat.js';
import NotificationsServices from './src/services/v1/Notifications/notifications.services.js';

// let onlineUsers = {};

export default async function sockets(io) {
    io.on('connection', async (socket) => {
        console.log('An user has connected!');

        socket.on('global chat', async (msg) => {
            let result;
            try {
                result = await GlobalChats.create({
                    ...msg,
                    timestamp: Date.now(),
                });
                result.save();
            } catch (error) {
                console.error(error);
                return;
            }
            io.emit('global chat', {
                ...result._doc,
            });
        });

        socket.on('user chat', async (msg) => {
            let result;
            try {
                NotificationsServices.setToTrue(msg?.user_id);
                result = await UserChats.create({
                    ...msg,
                    timestamp: Date.now(),
                });
                result.save();
            } catch (error) {
                console.error(error);
                return;
            }
            io.emit('user chat', {
                ...result._doc,
            });
        });

        // socket.on('connected users', async (user) => {
        // 	try {
        // 		onlineUsers[socket.id] = user;
        // 		io.emit('connected users', onlineUsers);
        // 	} catch (error) {
        // 		console.error(error);
        // 		return;
        // 	}
        // });

        socket.on('disconnect', () => {
            console.log('An user has disconnected');
            // delete onlineUsers[socket.id];
            // io.emit('connected users', onlineUsers);
        });

        if (!socket.recovered) {
            // <- recuperase los mensajes sin conexión
            try {
                if (socket.handshake.auth.user_id) {
                    const userChat = await UserChats.find({
                        createdAt: {
                            $gt: socket.handshake.auth.serverOffset ?? 0,
                        },
                        user_id: socket.handshake.auth.user_id,
                    });
                    // Enviarselo a los usuarios que se conecten
                    userChat.forEach((item) => {
                        socket.emit('user chat', item);
                    });
                } else {
                    const globalChat = await GlobalChats.find({
                        createdAt: {
                            $gt: socket.handshake.auth.serverOffset ?? 0,
                        },
                    });
                    globalChat.forEach((item) => {
                        socket.emit('global chat', item);
                    });
                }
            } catch (e) {
                console.error(e);
                return;
            }
        }
    });
}
