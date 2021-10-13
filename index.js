const express = require('express');
const bosses = require('./bosses');
const app = express();
app.get('/', (request, response) => {
	const ping = new Date();
	ping.setHours(ping.getHours() - 3);
	console.log(
		`Ping recebido às ${(ping.getUTCHours() + 4) %
			24}:${ping.getUTCMinutes()}:${ping.getUTCSeconds()}`
	);
	response.sendStatus(200);
});
app.listen(process.env.PORT); // Recebe solicitações que o deixa online

const Discord = require('discord.js');
const client = new Discord.Client();
const config = require('./config.json');

function colorfulPhrases() {
	const phrases = [
		`https://media.discordapp.net/attachments/807638048325107724/807638085146771456/616108049463246877.png`,
		`https://media.discordapp.net/attachments/807638048325107724/807658987092049940/146220590_4077805148896685_7197757590518479823_n.png`,
		`Go back to Badlands, chump!`,
		`Do you expect to be carried? Keep dreaming \:rofl:`,
		`Autocorrect striked again`,
		`With exactly 2 more IQ points, you could be a medium portion of french fries!`,
		`https://media.discordapp.net/attachments/774665225248047118/807700495359279164/tenor.gif`,
		`https://tenor.com/view/pumba-are-you-talking-to-me-lion-king-gif-14654403`,
		`https://tenor.com/view/brule-what-ay-what-gif-14969459`,
		`https://tenor.com/view/idk-confused-kid-gif-9279274`
	];

	return phrases[Math.floor(Math.random() * phrases.length)];
}

client.on('ready', () => {
	console.log(
		`Bot foi iniciado, com ${client.users.cache.size} utilizadores, em ${
			client.channels.cache.size
		} canais, em ${client.guilds.cache.size} servidores.`
	);
	client.user.setActivity(`Ask me !raid`);
});

client.on('guildCreate', async message => {
	console.log(
		`Bot entrou no servidor ${message.guild.name} (id: ${
			message.guild.id
		}). Utilizadores: ${message.guild.memberCount}.`
	);
	client.user.setActivity(`Estou em ${client.guilds.size} servidores.`);
});

client.on('guildDelete', () => {
	console.log(
		`O bot foi removido do servidor: ${message.guild.name} (id: ${
			message.guild.id
		}).`
	);
	client.user.setActivity(`Estou em ${client.guilds.size} servidores.`);
});

client.on('message', async message => {
	if (message.author.bot) return;
	if (message.channel.type === 'dm') return;
	if (!message.content.startsWith(config.prefix)) return;

	const args = message.content
		.slice(config.prefix.length)
		.trim()
		.split(/ +/g);
	const comando = args.shift().toLowerCase();

	// RAIDS
	console.log('Request on: ' + message.guild.name);
	console.log('Content: ' + message.content);

	if (comando === 'raid') {
		const m = await message.channel.send(
			`Ask me strats for raids in this format "!boss" or "!boss creature". Check some of the examples bellow:\n**!carno**\n**!mortem phoru**\n\nBosses names: **!boss**`
		);
	}

	if (comando === 'boss') {
		const m = await message.channel.send(
			`You can use these commands to check bosses:\nRares: **!baja**, **!carno**, **!meio**, **!megalonyx**\nEpics: **!posti**, **!blue**, **!megalotops**, **!trex** \nLegendarys: **!indom**, **!glypto**, **!rinch**, **!scorp** \nUniques: **!andrew**, **!stygi**, **!indor**, **!phoru** \nApex: **!gorgo**, **!hadros**, **!mortem**, **!cera**, **!ref**, **!haast**, **!hydra**\n\nYou can **bosses** with **1 or more creatures** you want to use, check some examples:\n**!blue indom**\n**!glypto baja**\n**!mortem 2phoru spyx**\n`
		);
	}

	//RAID bosses
	let bossStrats = [];

	function filterBoss(strat) {
		return comando.startsWith(strat[0]);
	}
	function checkWords(word) {
		bossStrats = bossStrats.filter(function(el) {
			checked = 0;
			el[1].forEach(function(creature) {
				if (word.toLowerCase().startsWith(creature)) checked = 1;
			});
			return checked;
		});
	}
	function sendStrat(el) {
		m = message.channel.send(el[2]);
	}

	if (
		comando.startsWith('baja') ||
    comando.startsWith('carno') ||
		comando.startsWith('meio') ||
    comando.startsWith('megalonyx') ||
		
		comando.startsWith('posti') ||
		comando.startsWith('blue') ||
    comando.startsWith('megalotops') ||
		comando.startsWith('trex') ||

		comando.startsWith('indom') ||
		comando.startsWith('glypto') ||
		comando.startsWith('rinch') ||
		comando.startsWith('scorp') ||

		comando.startsWith('andrew') ||
		comando.startsWith('stygi') ||
		comando.startsWith('indor') ||
		comando.startsWith('phoru') ||
    
		comando.startsWith('gorgo') ||
		comando.startsWith('trebax') ||
		comando.startsWith('hadros') ||
		comando.startsWith('mortem') ||
		comando.startsWith('cera') ||
		comando.startsWith('ref') ||
		comando.startsWith('haast') ||
		comando.startsWith('hydra')
	) {
		let m = '';
		bossStrats = bosses.strats.filter(filterBoss);

		if (args.length > 0) {
			console.log(args.length);
			//let creatures=args.split(' ');
			args.forEach(checkWords);
			if (bossStrats.length > 0) bossStrats.forEach(sendStrat);
			else m = await message.channel.send(colorfulPhrases());
		} else {
			bossStrats.forEach(sendStrat);
		}
	}
});
client.login(config.token);
