import type { CollectionConfig } from "payload";

export const Users: CollectionConfig = {
	slug: "users",
	admin: {
		useAsTitle: "name",
	},
	auth: true,
	fields: [
		{
			type: "text",
			name: "name",
		},
	],
};
