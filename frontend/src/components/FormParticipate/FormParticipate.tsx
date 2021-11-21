import React from 'react';
import RouteStore from '@/store/routes';
import { Input } from '@/components/Input/Input';
import { Button } from '@/components/Button/Button';
import { DeliveryInfoErrors, IUserInstance } from '@/models/UserData';
import Carrier from '@/services/carrier';
import { serializeFormData } from '@/utils/forms';
import { ISeasonDataInstance } from '@/models/SeasonData';
import { CurrentUserSeasonState, IStoreInstance } from '@/models';
import { ErrorBlock } from '@/components/ErrorBlock/ErrorBlock';
import { InputGroup } from '@/components/InputGroup/InputGroup';
import { observer } from 'mobx-react';

export interface State {
	formErrors?: DeliveryInfoErrors | null;
	error?: {
		code: number;
		message: any;
	} | null;
}

export interface Props {
	stats: ISeasonDataInstance;
	user: IUserInstance;
	// debug: boolean;
	store: IStoreInstance;
}

@observer
export class FormParticipate extends React.Component<Props, State> {
	state: State = {
		error: null,
		formErrors: null,
	};

	handleParticipateSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		const { user } = this.props;

		event.preventDefault();
		const form = event.target as HTMLFormElement;

		// const action = form.getAttribute('action')!;

		const formData = new FormData(form);
		const payload = serializeFormData(formData);

		user.saveDeliveryInfo(payload as any).then((formErrors) => {
			this.setState({
				formErrors,
			});
		});
	};

	handleRevokeSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const form = event.target;

		// @ts-expect-error TODO: deal with getAttribute typing
		const action = form.getAttribute('action');

		const payload = {
			is_active: false,
		};

		Carrier.post(action, { payload }).then((data) => {
			const { code, message } = data;

			if (code !== 200) {
				this.setState({
					error: {
						code,
						message,
					},
				});

				return;
			}

			const { store } = this.props;

			store.setUser(message);
		});
	};

	render() {
		// const { isRevoke, user } = this.props;
		const { user, store } = this.props;
		const { formErrors, error } = this.state;

		const currentUserSeasonState = store.getCurrentUserSeasonState();
		const isRevoke = currentUserSeasonState === CurrentUserSeasonState.Applied;

		const baseInputProps = {
			disabled: isRevoke,
			maxlength: 64,
		};

		return (
			<div className="form-participate">
				<div className="form-participate__error">
					{error && <ErrorBlock error={error!} />}
				</div>
				<form
					method="post"
					action={RouteStore.api.users.profile}
					className="form-participate__form"
					onSubmit={isRevoke ? this.handleRevokeSubmit : this.handleParticipateSubmit}
				>
					<Input
						{...baseInputProps}
						name="name"
						label="Имя Фамилия Отчество"
						error={formErrors?.name}
						defaultValue={user.delivery_information.name}
					/>
					<InputGroup>
						<Input
							{...baseInputProps}
							grow
							name="index"
							label="Почтовый индекс"
							error={formErrors?.index}
							defaultValue={user.delivery_information.index}
						/>
						<Input
							{...baseInputProps}
							grow
							type="email"
							name="email"
							label="Email адрес (для получения оповещений)"
							defaultValue={user.email}
							disabled
							title="Если вы не хотите получать оповещений на этот адрес, пожалуйста, напишите администрации на support@glitchless.ru"
						/>
					</InputGroup>
					<Input
						{...baseInputProps}
						type="textarea"
						name="address"
						label="Почтовый адрес"
						error={formErrors?.address}
						defaultValue={user.delivery_information.address}
						maxlength={1024}
						grow
					/>
					<Input
						{...baseInputProps}
						type="textarea"
						name="comment"
						label="Комментарий"
						error={formErrors?.comment}
						defaultValue={user.delivery_information.comment}
						maxlength={1024}
						grow
					/>
					<Button type={Button.types.submit} text={isRevoke ? 'Я передумал' : 'Участвовать'} />
				</form>
			</div>
		);
	}
}
