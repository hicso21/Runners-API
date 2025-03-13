import GlobalChats from '../../../db/models/GlobalChat';

export default class GlobalChatServices {
    static async createGlobalChat(msg) {
        const globalChatCreated = await GlobalChats.create({
            ...msg,
            timestamp: Date.now(),
        });
        return globalChatCreated;
    }
}
