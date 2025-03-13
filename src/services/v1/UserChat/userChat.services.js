import UserChats from '../../../db/models/UserChat.js';

export default class UserChatServices {
    static async createUserChat(msg) {
        const userChatCreated = await UserChats.create({
            ...msg,
            timestamp: Date.now(),
        });
        return userChatCreated;
    }
}
