import path from "node:path";
import { fileURLToPath } from "node:url";

import { mongooseAdapter } from "@payloadcms/db-mongodb";
import { resendAdapter } from "@payloadcms/email-resend";
import { s3Storage } from "@payloadcms/storage-s3";

import { buildConfig } from "payload";
import sharp from "sharp";

import { Users } from "./collections/users";
import { Media } from "./collections/media";
import { Articles } from "./collections/articles";
import { Categories } from "./collections/categories";
import { defaultLexical } from "./fields/default-lexical";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
	admin: {
		user: Users.slug,
		importMap: {
			baseDir: path.resolve(dirname),
		},
	},
	routes: {
		admin: "/",
	},
	collections: [Users, Media, Articles, Categories],
	editor: defaultLexical,
	email: resendAdapter({
		defaultFromAddress: "admin@triumphansfides.com",
		defaultFromName: "Triumphans Fides",
		apiKey: process.env.RESEND_API_KEY || "",
	}),
	secret: process.env.PAYLOAD_SECRET || "",
	typescript: {
		outputFile: path.resolve(dirname, "payload-types.ts"),
	},
	db: mongooseAdapter({
		url: process.env.DATABASE_URI || "",
	}),
	sharp,
	plugins: [
		s3Storage({
			collections: {
				media: true,
			},
			bucket: process.env.S3_BUCKET || "",
			config: {
				credentials: {
					accessKeyId: process.env.S3_ACCESS_KEY_ID || "",
					secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || "",
				},
				region: process.env.S3_REGION,
			},
		}),
	],
});
