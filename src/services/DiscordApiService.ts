import { Guild, Snowflake } from 'discord.js';
import BaseService from './BaseService';

export type Member = {
	roles: string[];
	nick: string | null;
	premium_since: string | null;
	joined_at: string | string;
	is_pending: boolean;
	pending: boolean;
	user: {
		id: Snowflake;
		username: string;
		avatar: string;
		discriminator: string;
		public_flags: number;
		bot: boolean;
	};
	mute: boolean;
	deaf: boolean;
};

export default class DiscordApiService extends BaseService {
	async getMembersByGuildId(
		guildId: string,
		limit = 1000
	): Promise<Member[]> {
		try {
			const result = await this.httpClient.get(
				`/guilds/${guildId}/members`,
				{
					params: { limit },
				}
			);

			return (result.data as unknown) as Member[];
		} catch (error) {
			return [];
		}
	}

	async getMembersByRoleIds(
		guildId: string,
		roleIds: string[]
	): Promise<Member[]> {
		const members = await this.getMembersByGuildId(guildId);

		return members.filter((member) =>
			member.roles.some((role) => roleIds.includes(role))
		);
	}
	async getMembersByRoleId(
		guildId: string,
		roleId: string
	): Promise<Member[]> {
		return await this.getMembersByRoleIds(guildId, [roleId]);
	}
}
