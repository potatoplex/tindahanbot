import { Message, MessageEmbed, User } from 'discord.js';
import EmojiGame from '../../helper/emoji/EmojiGame';

import { CommandoClient, CommandoMessage } from 'discord.js-commando';
import CommandGroup from '../../enums/CommandGroup';
import { AsyncCommandRunType } from '../../typings';
import { bold, createEmbedMessage, mentionUser } from '../../util/MessageUtil';
import HehemojiQuestion from '../../models/HehemojiQuestion';
import Colors from '../../enums/Colors';
import BaseCommand from '../../common/BaseCommand';
import { shuffle } from '../../util/RngUtil';

type EmojiGameArgType = { rounds: number };

const participantWaitDuration = 10000;
const nextQuestionDelay = 5000;
const questionDuration = 15000;

const KOALA_ICON = '🐨';

function createMessage() {
	return createEmbedMessage(Colors.INFO).setTitle('Emoji Game');
}

export default class EmojiGameCommand extends BaseCommand {
	games: Map<string, EmojiGame>;
	constructor(client: CommandoClient) {
		super(client, {
			name: 'hehemoji',
			memberName: 'hehemoji',
			aliases: ['emo'],
			group: CommandGroup.GAME.name,
			description: 'Play the Hehemoji game',
			args: [
				{
					key: 'rounds',
					prompt: 'How many rounds do you want to play?',
					type: 'integer',
					default: 5,
				},
			],
		});
		this.games = new Map();
	}

	async showScores(
		game: EmojiGame,
		message: CommandoMessage
	): Promise<Message> {
		const { participants } = game;
		const sorted = participants.sort((a, b) => b.score - a.score);

		const [winner] = sorted;
		await message.channel.send(
			createMessage().setDescription(
				`🏆 ${mentionUser(winner.id)} won the game. Congratulations! 🏆`
			)
		);

		const spiel = createMessage()
			.setDescription('Scoreboard:')
			.addFields(
				sorted.map(({ username, score }, i) => ({
					name: `#${i + 1} ${username}${i === 0 ? ' 🏆' : ''}`,
					value: `${score} points`,
				}))
			);

		return await message.channel.send(spiel);
	}

	async gatherParticipants(
		game: EmojiGame,
		message: CommandoMessage
	): Promise<Message> {
		this.games.set(message.channel.id, game);
		const potchi = this.getEmoji('potchi', KOALA_ICON);
		const spiel = createMessage().addField(
			`Starting Emoji Game in ${participantWaitDuration / 1000} seconds.`,
			`Please react ${potchi} to this message to participate`
		);
		const collectorMessage = await message.channel.send(spiel);
		await collectorMessage.react(potchi);

		const collector = collectorMessage.createReactionCollector(
			(reaction) =>
				reaction.emoji.name ===
				(typeof potchi === 'object' ? potchi.name : potchi),
			{
				time: participantWaitDuration,
			}
		);

		collector.on('collect', (_, user: User) => {
			const { participants } = game;
			if (!participants.map(({ id }) => id).includes(user.id)) {
				game.addParticipant(user);
			}
		});

		collector.on('end', async () => {
			if (game.participants.length > 0) {
				const emojis = await HehemojiQuestion.find({});
				game.pool = shuffle(emojis);
				this.showQuestion(game, message);
			} else {
				const spiel = createMessage().setDescription(
					'No participants found :cry:'
				);
				this.endGame(message.channel.id);
				message.channel.send(spiel);
			}
		});

		return collectorMessage;
	}

	async showNextQuestion(
		game: EmojiGame,
		message: CommandoMessage,
		spiel: MessageEmbed
	): Promise<Message | void> {
		if (!game.isLastRound()) {
			await message.channel.send(
				spiel.setFooter(`Showing next question in 5s...`)
			);
			game.nextRound();
			setTimeout(
				() => this.showQuestion(game, message),
				nextQuestionDelay
			);
		} else {
			console.log('GAME OVER');
			await message.channel.send(spiel);
			this.endGame(message.channel.id);
			return await this.showScores(game, message);
		}
	}

	async showQuestion(
		game: EmojiGame,
		message: CommandoMessage
	): Promise<void> {
		const { round, totalRounds } = game;
		const {
			question,
			answer,
			alias,
			category,
			producerLocation,
		} = game.currentEmoji();

		const spiel = createMessage()
			.setTitle(`Guess the ${category.toLowerCase()}:`)
			.setDescription(question)
			.setFooter(
				`Hint: ${producerLocation}\n\nRound ${
					round + 1
				} of ${totalRounds}`
			);
		await message.channel.send(spiel);

		const filter = (m: CommandoMessage) =>
			game.participants.some(({ id }) => id === m.author.id);

		const collector = message.channel.createMessageCollector(filter, {
			time: questionDuration,
		});

		collector.on('collect', async (m: CommandoMessage) => {
			const {
				content,
				author: { id: authorId },
			} = m;
			console.log(`Collected ${content}`);

			const isDone = game.currentEmoji().done;

			if (!isDone) {
				const c = content.trim().toLowerCase();
				const match = c === answer.toLowerCase();
				console.log('alias', alias);
				const aliasMatch =
					alias && alias.map((a) => a.toLowerCase()).includes(c);

				if (match || aliasMatch) {
					game.markDone();
					game.addScore(authorId);

					const spiel = createMessage().setDescription(
						`🏆 ${mentionUser(
							authorId
						)} got the correct answer: ${bold(
							answer.toUpperCase()
						)} 🏆`
					);

					collector.stop('answered');
					return await this.showNextQuestion(game, message, spiel);
				}
			}
		});

		collector.on('end', async (m, reason) => {
			if (reason !== 'answered') {
				const spiel = createMessage()
					.setTitle("Time's Up!")
					.addField(
						bold(game.currentEmoji().answer.toUpperCase()),
						'was the correct answer'
					);

				await this.showNextQuestion(game, message, spiel);
			}
		});
	}

	endGame(channelId: string): void {
		this.games.delete(channelId);
	}

	async run(
		message: CommandoMessage,
		{ rounds }: EmojiGameArgType
	): AsyncCommandRunType {
		if (this.games.has(message.channel.id)) {
			return message.say(
				createEmbedMessage(Colors.ERROR).setDescription(
					`There's an Emoji Game still in Progress for this Channel`
				)
			);
		}
		const game = new EmojiGame([], rounds);
		return this.gatherParticipants(game, message);
	}
}
