import { Dealer, standardDeck } from 'card-dealer';
import { Message, MessageEmbed } from 'discord.js';
import { CommandoMessage } from 'discord.js-commando';
import { createEmbedMessage } from '../util/MessageUtil';

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

export type Card = {
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
		icon: '♦️',
		color: 'RED',
		rank: 4,
	},
	HEARTS: {
		name: 'HEARTS',
		code: 'H',
		icon: '♥️',
		color: 'RED',
		rank: 3,
	},

	SPADES: {
		name: 'SPADES',
		code: 'S',
		icon: '♠️',
		color: 'BLACK',
		rank: 2,
	},
	CLUBS: {
		name: 'CLUBS',
		code: 'C',
		icon: '♣️',
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

export const resolveCard = (deck: typeof standardDeck[0]): Card => {
	const rawRank = deck.rank.toUpperCase();
	const rawSuit = deck.suit.toUpperCase();

	const suit = CARD_SUIT_MAP[rawSuit as CardSuitName];
	const rankMatch = Object.keys(CARD_RANK_MAP).find(
		(x) =>
			CARD_RANK_MAP[x as CardRankCode]?.code === rawRank ||
			CARD_RANK_MAP[x as CardRankCode]?.name === rawRank
	);

	const rank = rankMatch
		? CARD_RANK_MAP[rankMatch as CardRankCode]
		: CARD_RANK_MAP.ACE;

	const code = `${rank.code}${suit.code}`;

	return {
		suit,
		rank,
		code,
	};
};

export default class HighLowGame {
	dealer: Dealer<any>;
	prevCard: Card | undefined = undefined;
	currentCard: Card | undefined = undefined;
	status: 'SETUP' | 'WAITING' | 'END' = 'SETUP';
	ownerId: string;
	streak = 0;

	constructor(
		public origMessage: CommandoMessage,
		public responseMessage: CommandoMessage,
		public embed: MessageEmbed
	) {
		this.dealer = new Dealer(standardDeck).shuffle();
		this.ownerId = origMessage.author.id;
	}

	editResponseMessage = async (
		editEmbed: (embed: MessageEmbed) => MessageEmbed
	): Promise<Message> => {
		this.embed = editEmbed(this.embed);
		return this.responseMessage.edit(this.embed);
	};

	cleanUp = async (): Promise<void> => {
		this.embed = this.embed.setFooter('');
		await this.responseMessage.reactions.removeAll();
	};

	incStreak = (): void => {
		this.streak++;
	};
}
