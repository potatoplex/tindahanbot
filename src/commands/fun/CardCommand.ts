import { MessageReaction } from 'discord.js';
import { CommandoClient, CommandoMessage } from 'discord.js-commando';
import BaseCommand from '../../common/BaseCommand';
import CommandGroup from '../../enums/CommandGroup';
import HighLowGame, { resolveCard } from '../../helper/HighLowGame';
import { AsyncCommandRunType } from '../../typings';
import {
	bold,
	createEmbedMessage,
	mentionAuthor,
} from '../../util/MessageUtil';
import { getRandomColor } from '../../util/RngUtil';
import CardImages from '../../data/cards/minimal.json';

type CardColor = 'BLACK' | 'RED';
type CardSuitName = 'HEARTS' | 'DIAMONDS' | 'SPADES' | 'CLUBS';

type CardSuit = {
	color: CardColor;
	name: CardSuitName;
	icon: string;
	code: string;
	rank: number;
};

type CardRankCode =
	| 'ACE'
	| 'TWO'
	| 'THREE'
	| 'FOUR'
	| 'FIVE'
	| 'SIX'
	| 'SEVEN'
	| 'EIGHT'
	| 'NINE'
	| 'TEN'
	| 'JACK'
	| 'QUEEN'
	| 'KING';

type CardRank = {
	name: CardRankCode;
	code: string;
	numericValue: number;
};

type Card = {
	suit: CardSuit;
	rank: CardRank;
	code: string;
	image?: string;
};

const CARD_SUIT_MAP: {
	[key in CardSuitName]: CardSuit;
} = {
	DIAMONDS: {
		name: 'DIAMONDS',
		code: 'D',
		icon: ':diamond:',
		color: 'RED',
		rank: 4,
	},
	HEARTS: {
		name: 'HEARTS',
		code: 'H',
		icon: ':heart:',
		color: 'RED',
		rank: 3,
	},

	SPADES: {
		name: 'SPADES',
		code: 'S',
		icon: ':spade:',
		color: 'BLACK',
		rank: 2,
	},
	CLUBS: {
		name: 'CLUBS',
		code: 'C',
		icon: ':club:',
		color: 'BLACK',
		rank: 1,
	},
};

const CARD_RANK_CODE_MAP: Record<
	CardRankCode,
	Pick<CardRank, 'code' | 'numericValue'>
> = {
	ACE: { code: 'A', numericValue: 1 },
	TWO: { code: '2', numericValue: 2 },
	THREE: { code: '3', numericValue: 3 },
	FOUR: { code: '4', numericValue: 4 },
	FIVE: { code: '5', numericValue: 5 },
	SIX: { code: '6', numericValue: 6 },
	SEVEN: { code: '7', numericValue: 7 },
	EIGHT: { code: '8', numericValue: 8 },
	NINE: { code: '9', numericValue: 9 },
	TEN: { code: '10', numericValue: 10 },
	JACK: { code: 'J', numericValue: 11 },
	QUEEN: { code: 'Q', numericValue: 12 },
	KING: { code: 'K', numericValue: 13 },
};

type CardRankMapType = Record<CardRankCode, CardRank>;
const CARD_RANK_MAP: CardRankMapType = (Object.keys(CARD_RANK_CODE_MAP).reduce(
	(prev, next) => ({
		...prev,
		[next as CardRankCode]: {
			name: next as CardRankCode,
			...CARD_RANK_CODE_MAP[next as CardRankCode],
		},
	}),
	{}
) as unknown) as CardRankMapType;

const HIGHER = '⬆️';
const LOWER = '⬇️';

export default class CardCommand extends BaseCommand {
	gameMap: Map<string, HighLowGame>;
	constructor(client: CommandoClient) {
		super(client, {
			name: 'hilo',
			memberName: 'hilo',
			group: CommandGroup.GAME.name,
			description: 'Play High Low',
		});

		this.gameMap = new Map();
	}

	checkIfHigher = (userId: string): boolean => {
		const match = this.gameMap.get(userId);

		if (!match) return false;

		const { prevCard, currentCard } = match;

		if (!prevCard || !currentCard) return false;
		const {
			rank: { numericValue, code: rankCode },
			suit: { rank: suitRank },
		} = currentCard;
		const {
			rank: { numericValue: prevNumericValue, code: prevRankCode },
			suit: { rank: prevSuitRank },
		} = prevCard;

		if (rankCode === prevRankCode) {
			return suitRank > prevSuitRank;
		}
		return numericValue > prevNumericValue;
	};

	setup = async (message: CommandoMessage): AsyncCommandRunType => {
		const member = message.guild.members.cache.find(
			({ id }) => id === message.author.id
		);

		const userAvatar = message.author?.displayAvatarURL({ size: 256 });
		const embed = createEmbedMessage(getRandomColor())
			.setAuthor(
				`HIGH LOW (${member?.nickname || message.author.username})`,
				userAvatar
			)
			.setFooter('Setting up...');

		const m = await message.say(embed);

		await m.react(HIGHER);
		await m.react(LOWER);

		const game = new HighLowGame(message, m, embed);
		this.drawCard(game);

		this.gameMap.set(game.ownerId, game);

		return this.updateMessage(game);
	};

	drawCard = (game: HighLowGame): void => {
		game.prevCard = game.currentCard;
		const hand = game.dealer.draw();
		const card = resolveCard(hand[0]);
		game.currentCard = card;
	};

	assembleCollector = async (game: HighLowGame): Promise<void> => {
		const { responseMessage, ownerId } = game;
		const PREDICTION_WAIT = 30000;
		const collector = responseMessage.createReactionCollector(
			(reaction: MessageReaction) => {
				return [HIGHER, LOWER].includes(reaction.emoji.name);
			},
			{ time: PREDICTION_WAIT }
		);

		collector.on('collect', async (reaction, user) => {
			await reaction.users.remove(user.id);
			if (user.id === ownerId) {
				const predictionIsHigher = reaction.emoji.name === HIGHER;
				collector.stop(
					predictionIsHigher ? 'predictedHigher' : 'predictedLower'
				);
			}
		});

		collector.on('end', async (_, reason) => {
			const GAME_OVER = 'GAME OVER!';
			const endResponse = (m: string) =>
				game.responseMessage.say(
					createEmbedMessage(getRandomColor())
						.setTitle(GAME_OVER)
						.setDescription(`${m}\n\nStreak: ${game.streak}`)
				);

			if (reason === 'predictedHigher' || reason === 'predictedLower') {
				const predictionIsHigher = reason === 'predictedHigher';
				this.drawCard(game);
				const actualResult = this.checkIfHigher(ownerId);
				const correctPrediction =
					(actualResult && predictionIsHigher) ||
					(!actualResult && !predictionIsHigher);
				await this.updateMessage(game, correctPrediction);
				if (!correctPrediction) {
					await game.cleanUp();
					await game.editResponseMessage((embed) => {
						return embed.setDescription(GAME_OVER);
					});
					await endResponse(
						`${mentionAuthor(
							game.origMessage
						)} gave the wrong prediction`
					);
				} else {
					game.incStreak();
				}
			} else if (reason === 'time') {
				await game.cleanUp();
				await game.editResponseMessage((embed) => {
					return embed.setDescription(GAME_OVER);
				});
				await endResponse(
					`${mentionAuthor(game.origMessage)} did not respond in time`
				);
			}
		});
	};

	updateMessage = async (
		game: HighLowGame,
		createCollector = true
	): AsyncCommandRunType => {
		const { embed, responseMessage, currentCard, prevCard } = game;

		if (!currentCard) return null;

		const cardSpiel = (card?: Card) =>
			card
				? `${bold(`${card.rank.code} ${card.suit.icon}`).toUpperCase()}`
				: 'N/A';

		const fields = [
			{
				name: 'Previous',
				value: cardSpiel(prevCard),
				inline: true,
			},
			{
				name: 'Current',
				value: cardSpiel(game.currentCard),
				inline: true,
			},
			{
				name: 'Remaining',
				value: `${game.dealer.remainingCards()}  out of 52`,
				inline: true,
			},
		];

		const img: string = (CardImages as Record<
			string,
			Record<string, string>
		>)[currentCard.rank.code][currentCard.suit.code];

		game.embed = embed
			.setImage(img)
			.setFooter(
				`Predict whether next card will be Higher ${HIGHER} or Lower ${LOWER}`
			);

		if (game.embed.fields.length >= 2) {
			game.embed = game.embed.spliceFields(0, fields.length, fields);
		} else {
			game.embed = game.embed.addFields(fields);
		}

		if (createCollector) {
			await this.assembleCollector(game);
		}

		return responseMessage.edit(game.embed);
	};

	async run(message: CommandoMessage): AsyncCommandRunType {
		return await this.setup(message);
	}
}
