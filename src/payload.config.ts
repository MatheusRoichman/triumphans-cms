import path from "node:path";
import { fileURLToPath } from "node:url";

import { mongooseAdapter } from "@payloadcms/db-mongodb";

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
	collections: [Users, Media, Articles, Categories],
	editor: defaultLexical,
	secret: process.env.PAYLOAD_SECRET || "",
	typescript: {
		outputFile: path.resolve(dirname, "payload-types.ts"),
	},
	db: mongooseAdapter({
		url: process.env.DATABASE_URI || "",
	}),
	sharp,
});
