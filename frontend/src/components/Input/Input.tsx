import React, { InputHTMLAttributes } from 'react';

import classNames from 'classnames';

import './Input.scss';

import Popover from 'antd/lib/popover';

type InputProps = InputHTMLAttributes<any>;

// TODO: исчерпывающий тайпинг и прокидывание всех пропсов инпуту
interface Props {
	type?: 'textarea' | 'input' | 'email';

	value?: InputProps['value'];
	defaultValue?: InputProps['defaultValue'];
	name: InputProps['name'];
	id?: InputProps['id'];
	disabled?: InputProps['disabled'];
	title?: string;

	maxlength: InputProps['maxLength'];

	label?: string;
	grow?: boolean;
	error?: string;
	placeholder?: InputProps['placeholder'];

	onChange?: InputProps['onChange'];
	onKeyDown?: InputProps['onKeyDown'];
}

export const Input: React.FC<Props> = (props) => {
	const {
		type,
		defaultValue,
		value,
		name,
		label,
		id,
		disabled,
		grow,
		maxlength,
		error,
		title,
		onChange,
		onKeyDown,
		placeholder,
	} = props;

	const className = classNames('input', {
		input_grow: grow,
	});

	return (
		<div className={className}>
			{label && (
				<label className="input__label" htmlFor={id}>
					<div>{label}</div>
					{title && (
						<Popover content={title} trigger="hover">
							<div className="input__title">
								<i className="fas fa-info-circle" />
							</div>
						</Popover>
					)}
				</label>
			)}
			{type === 'textarea'
				? (
					<textarea
						id={id}
						name={name}
						defaultValue={defaultValue}
						disabled={disabled}
						maxLength={maxlength}
					/>
				)
				: (
					<input
						placeholder={placeholder}
						id={id}
						type={type}
						value={value}
						defaultValue={defaultValue}
						name={name}
						disabled={disabled}
						maxLength={maxlength}
						onChange={onChange}
						onKeyDown={onKeyDown}
					/>
				)}
			{error && <div className="input__error">{error}</div>}
		</div>
	);
};
