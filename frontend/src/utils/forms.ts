export const serializeFormData = (formData: FormData) => {
	const serialized: Record<string, any> = {};

	formData.forEach((value, key) => {
		serialized[key] = value;
	});

	return serialized;
};
