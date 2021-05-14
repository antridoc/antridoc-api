const dotenv = require('dotenv').config();

export default dotenv.parsed;

export const firebase_admin_sdk = require(`../../storage/firebase/antridoc-firebase-adminsdk.json`);

export const projectDir = `${__dirname}/../../`;