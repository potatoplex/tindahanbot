import DeletedMessage from '../models/DeletedMessage';
import BaseService from './BaseService';

export type DeletedMessageType = {
	content: string;
	user: string;
	channel: string;
	createdAt: string;
};

class MessageService extends BaseService {
	async getDeletedMessages(
		channel: string,
		limit: number
	): Promise<DeletedMessageType[]> {
		try {
			const mins = 5;
			const response = await DeletedMessage.find({
				channel,
				createdAt: {
					$gt: new Date(Date.now() - mins * 60 * 1000),
				},
			})
				.sort({ createdAt: -1 })
				.limit(+limit)
				.exec();
			return (response as unknown) as DeletedMessageType[];
		} catch (error) {
			return [];
		}
	}

	async getExpiredDeletedMessages(
		channel: string
	): Promise<DeletedMessageType[]> {
		try {
			const mins = 5;
			const response = await DeletedMessage.find({
				channel,
				createdAt: {
					$lt: new Date(Date.now() - mins * 60 * 1000),
				},
			}).sort({ createdAt: -1 });

			return (response as unknown) as DeletedMessageType[];
		} catch (error) {
			return [];
		}
	}

	async addDeletedMessage(
		data: Omit<DeletedMessageType, 'createdAt'>
	): Promise<DeletedMessageType | null> {
		try {
			const entry = new DeletedMessage(data);
			return ((await entry.save()) as unknown) as DeletedMessageType;
		} catch (error) {
			return null;
		}
	}

	async cleanUpDeletedMessages(channel: string): Promise<void> {
		const mins = 5;
		await DeletedMessage.deleteMany({
			channel,
			createdAt: {
				$lte: new Date(Date.now() - 3 * 60 * 1000),
			},
		});
	}
}

export default new MessageService();
