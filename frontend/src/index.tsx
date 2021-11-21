import 'antd/dist/antd.less';

import React from 'react';
import ReactDOM from 'react-dom';
import App from 'components/App/App';
import { initMessages } from '@/store/messages';
import { initFeatures } from '@/store/features';

import '@fortawesome/fontawesome-free/js/all.min';

const mountElement = document.getElementById('app');

fetch(`/config/base.json?rnd=${Math.random()}`, {
	method: 'GET',
})
	.then((response) => response.json())
	.then((config) => {
		document.title = config.title;

		initMessages(config.messages);
		initFeatures(config);

		ReactDOM.render(<App />, mountElement);
	})
	.catch((err) => {
		mountElement!.innerText = 'Произошла ошибка :(';

		// eslint-disable-next-line no-console
		console.error(err);
	});
