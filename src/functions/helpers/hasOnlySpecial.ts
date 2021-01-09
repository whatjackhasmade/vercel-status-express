export const hasOnlySpecial = (val: string): boolean => {
	const pattern = /^[^a-zA-Z0-9]+$/;
	return pattern.test(val);
};

export default hasOnlySpecial;
