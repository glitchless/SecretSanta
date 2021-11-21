import React, { Component, MouseEventHandler } from 'react';
import { Link } from 'react-router-dom';

import classNames from 'classnames';

import './Button.scss';

enum ButtonTypes {
	block = 'type:block',
	link = 'type:link',
	a = 'type:a',
	submit = 'type:submit',
}

interface Props {
	text: string;
	type?: ButtonTypes;
	to?: string;

	// TODO: разбить на несколько кнопок и сделать обязательным атрибутом
	onAction?: MouseEventHandler;

	repulsive?: boolean;
	stretch?: boolean;
}

export class Button extends Component<Props> {
	static get types() {
		return ButtonTypes; // TODO: зачем геттер? Удалить к
	}

	private getButtonBody() {
		const {
			text, type, to, stretch, onAction,
		} = this.props;

		/*
		 * if (repulsive) {
		 *     _classNames.push('button_repulsive');
		 * }
		 */
		const className = classNames('button', {
			button_stretch: stretch,
		});

		switch (type) {
			case ButtonTypes.a:
				return <a className={className} href={to} onClick={onAction}>{text}</a>;
			case ButtonTypes.link:
				return <Link className={className} to={to!} onClick={onAction}>{text}</Link>;
			case ButtonTypes.submit:
				return <input className={className} type="submit" value={text} onClick={onAction} />;
			case ButtonTypes.block:
			default:
				return (
					<div className={className} onClick={onAction}>
						{text}
					</div>
				);
		}
	}

	render() {
		const {
			repulsive,
		} = this.props;

		const buttonBody = this.getButtonBody();

		if (repulsive) {
			return (
				<div className="button-container">
					{buttonBody}
				</div>
			);
		}

		return buttonBody;
	}
}
