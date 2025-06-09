import {
	BlocksFeature,
	FixedToolbarFeature,
	HeadingFeature,
	HorizontalRuleFeature,
	InlineToolbarFeature,
	lexicalEditor,
} from "@payloadcms/richtext-lexical";
import {
	MetaDescriptionField,
	MetaImageField,
	MetaTitleField,
	OverviewField,
	PreviewField,
} from "@payloadcms/plugin-seo/fields";
import type { CollectionConfig } from "payload";

import { slugField } from "@/fields/slug";

export const Articles: CollectionConfig = {
	slug: "articles",
	fields: [
		{
			name: "title",
			type: "text",
			required: true,
		},
		{
			type: "tabs",
			tabs: [
				{
					fields: [
						{
							name: "heroImage",
							type: "upload",
							relationTo: "media",
						},
						{
							name: "content",
							type: "richText",
							editor: lexicalEditor({
								features: ({ rootFeatures }) => {
									return [
										...rootFeatures,
										HeadingFeature({
											enabledHeadingSizes: ["h1", "h2", "h3", "h4"],
										}),
										FixedToolbarFeature(),
										InlineToolbarFeature(),
										HorizontalRuleFeature(),
									];
								},
							}),
							label: false,
							required: true,
						},
					],
					label: "Content",
				},
				{
					fields: [
						{
							name: "relatedArticles",
							type: "relationship",
							admin: {
								position: "sidebar",
							},
							
							filterOptions: ({ id }) => {
								return {
									id: {
										not_in: [id],
									},
								};
							},
							hasMany: true,
							relationTo: "articles",
						},
						{
							name: "categories",
							type: "relationship",
							admin: {
								position: "sidebar",
							},
							hasMany: true,
							relationTo: "categories",
						},
					],
					label: "Meta",
				},
				{
					name: "meta",
					label: "SEO",
					fields: [
						OverviewField({
							titlePath: "meta.title",
							descriptionPath: "meta.description",
							imagePath: "meta.image",
						}),
						MetaTitleField({
							hasGenerateFn: true,
						}),
						MetaImageField({
							relationTo: "media",
						}),

						MetaDescriptionField({}),
						PreviewField({
							// if the `generateUrl` function is configured
							hasGenerateFn: true,

							// field paths to match the target field for data
							titlePath: "meta.title",
							descriptionPath: "meta.description",
						}),
					],
				},
			],
		},
		{
			name: "publishedAt",
			type: "date",
			admin: {
				date: {
					pickerAppearance: "dayAndTime",
				},
				position: "sidebar",
			},
			hooks: {
				beforeChange: [
					({ siblingData, value }) => {
						if (siblingData._status === "published" && !value) {
							return new Date();
						}
						return value;
					},
				],
			},
		},
		{
			name: "authors",
			type: "relationship",
			admin: {
				position: "sidebar",
			},
			hasMany: true,
			relationTo: "users",
		},
		// This field is only used to populate the user data via the `populateAuthors` hook
		// This is because the `user` collection has access control locked to protect user privacy
		// GraphQL will also not return mutated user data that differs from the underlying schema
		{
			name: "populatedAuthors",
			type: "array",
			access: {
				update: () => false,
			},
			admin: {
				disabled: true,
				readOnly: true,
			},
			fields: [
				{
					name: "id",
					type: "text",
				},
				{
					name: "name",
					type: "text",
				},
			],
		},
		...slugField(),
	],
};
