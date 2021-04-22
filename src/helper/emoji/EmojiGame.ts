import { Snowflake } from 'discord.js';

type EmojiGameParticipant = {
	id: string;
	username: string;
	score: number;
};

type EmojiGameQuestion = {
	status: 'SETUP' | 'ONGOING' | 'ENDED';
	question: string;
	answer: string;
	alias: string[];
	category: string;
	producerLocation: string;
	done: boolean;
};

export default class EmojiGame {
	round = 0;
	participants: EmojiGameParticipant[] = [];

	constructor(public pool: EmojiGameQuestion[], public totalRounds: number) {
		this.pool = pool.map((p) => ({ ...p, done: false }));
		this.totalRounds = !totalRounds ? pool.length : totalRounds;
	}

	addParticipant({ id, username }: { id: string; username: string }): number {
		return this.participants.push({
			id,
			username,
			score: 0,
		});
	}

	currentEmoji(): EmojiGameQuestion {
		return this.pool[this.round];
	}

	markDone(): void {
		this.pool[this.round] = {
			...this.pool[this.round],
			done: true,
		};
	}

	nextRound(): void {
		this.round++;
	}

	isLastRound(): boolean {
		return this.round === this.totalRounds - 1;
	}

	addScore(participant: Snowflake): void {
		this.participants = this.participants.reduce(
			(acc: EmojiGameParticipant[], curr) => {
				if (participant === curr.id) {
					return [
						...acc,
						{
							...curr,
							score: +curr.score + 1,
						},
					];
				}

				return [...acc, curr];
			},
			[]
		);
	}
}
