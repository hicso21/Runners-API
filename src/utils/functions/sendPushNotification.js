export default async function sendPushNotification(token, senderName, message) {
    try {
        const notificationMessage = {
            to: token,
            sound: 'default',
            title: `Nuevo mensaje de ${senderName}`,
            body: message,
            data: {
                chatType: 'DELAF',
                timestamp: Date.now(),
            },
        };

        await fetch('https://exp.host/--/api/v2/push/send', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Accept-encoding': 'gzip, deflate',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(notificationMessage),
        });

        console.log('Notificación push enviada correctamente');
    } catch (error) {
        console.error('Error al enviar notificación push:', error);
    }
}
