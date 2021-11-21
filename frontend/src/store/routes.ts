export default {
	api: {
		stats: '/api/stats/',
		chat: {
			get: '/api/chat/',
			post: '/api/chat/',
			longpoll: '/api/chat/wait_new/',
		},
		users: {
			login: '/api/auth/',
			logout: '/api/auth/logout/',
			profile: '/api/profile/',
			drop: '/api/profile/drop/',
		},
	},

	pages: {
		index: '/',
		profile: '/profile/',
		profileChatWithSanta: '/profile/chat-with-santa/',
		profileChatWithReceiver: '/profile/chat-with-receiver/',
	},

	external: {
		glitchless: {
			vk: 'https://vk.com/team.glitchless',
			website: 'https://glitchless.ru',
			github: 'https://github.com/glitchless/SecretSanta',
		},
		other: {
			takataka: 'https://www.instagram.com/taka_taka_artist',
			nafanya: 'https://www.instagram.com/nafanya_pict/',
		},
	},
};
