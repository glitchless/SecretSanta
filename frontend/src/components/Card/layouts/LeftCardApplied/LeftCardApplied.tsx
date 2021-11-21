import React from 'react';
import RouteStore from '@/store/routes';
import { Input } from '@/components/Input/Input';
import { Button } from '@/components/Button/Button';
import { DeliveryInfoErrors, IUserInstance } from '@/models/UserData';

export interface Props {
	isRevoke: boolean;
	user: IUserInstance;
	handleRevokeSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
	handleParticipateSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
	formErrors?: DeliveryInfoErrors | null;
}

export const LeftCardApplied: React.FC<Props> = ({
	isRevoke,
	user,
	handleRevokeSubmit,
	handleParticipateSubmit,
	formErrors,
}) => {
	const baseInputProps = {
		disabled: isRevoke,
		maxlength: 64,
	};

	return (
		<form
			method="post"
			action={RouteStore.api.users.profile}
			className="profile-view__participate-form"
			onSubmit={isRevoke ? handleRevokeSubmit : handleParticipateSubmit}
		>
			<Input
				{...baseInputProps}
				name="name"
				label="Имя Фамилия Отчество"
				error={formErrors?.name}
				value={user.delivery_information.name}
			/>
			<Input
				{...baseInputProps}
				type="email"
				name="email"
				label="Email адрес (для получения оповещений)"
				value={user.email}
				disabled
				title="Если вы не хотите получать оповещений на этот адрес, пожалуйста, напишите администрации на support@glitchless.ru"
			/>
			<Input
				{...baseInputProps}
				name="index"
				label="Почтовый индекс"
				error={formErrors?.index}
				value={user.delivery_information.index}
			/>
			<Input
				{...baseInputProps}
				type="textarea"
				name="address"
				label="Почтовый адрес"
				error={formErrors?.address}
				value={user.delivery_information.address}
				maxlength={1024}
				grow
			/>
			<Input
				{...baseInputProps}
				type="textarea"
				name="comment"
				label="Комментарий"
				error={formErrors?.comment}
				value={user.delivery_information.comment}
				maxlength={1024}
				grow
			/>
			<Button type={Button.types.submit} text={isRevoke ? 'Я передумал' : 'Участвовать'} stretch />
		</form>
	);
};
