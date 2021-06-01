import { Storage } from '@google-cloud/storage';

export const get = async ({ query }) => {
  const storage = new Storage({
    projectId: import.meta.env.VITE_PROJECT_ID as string,
    credentials: {
      client_email: import.meta.env.VITE_CLIENT_EMAIL as string,
      private_key: import.meta.env.VITE_PRIVATE_KEY as string
    }
  });

  const bucket = storage.bucket(import.meta.env.VITE_BUCKET_NAME as string);
  const file = bucket.file(query.get('file'));
  const options = {
    expires: Date.now() + 1 * 60 * 1000, //  1 minute,
    fields: { 'x-goog-meta-test': 'data' }
  };

  const [response] = await file.generateSignedPostPolicyV4(options);

  return { body: response };
};
