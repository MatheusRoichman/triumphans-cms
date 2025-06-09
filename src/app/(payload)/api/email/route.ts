import { getPayload } from "payload";

import config from "@payload-config";

export async function POST() {
  const payload = await getPayload({ config })

  await payload.sendEmail({
    to: 'roichmankill@gmail.com',
    subject: 'This is a test email',
    text: 'This is my message body',
  });
}