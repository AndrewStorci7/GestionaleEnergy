// env-loader.js
import dotenv from 'dotenv';
import { spawn } from "child_process";

const envTarget = process.argv[2]; // es: 'local' o 'server'

if (!envTarget || (envTarget !== "local" && envTarget !== "server")) {
  console.error("Specifica l'ambiente: local o server (es: npm run server:local)");
  process.exit(1);
}

// Carica il file .env
dotenv.config();

const envVars = {
  NEXT_PUBLIC_APP_DB_HOST: process.env[`NEXT_PUBLIC_APP_DB_HOST_${envTarget.toUpperCase()}`],
  NEXT_PUBLIC_APP_DB_USERNAME: process.env[`NEXT_PUBLIC_APP_DB_USERNAME_${envTarget.toUpperCase()}`],
  NEXT_PUBLIC_APP_DB_PASSWORD: process.env[`NEXT_PUBLIC_APP_DB_PASSWORD_${envTarget.toUpperCase()}`],
  NODE_ENV: 'development'
};

// Avvia next dev con le variabili ambiente
const child = spawn('node', ['./src/server/app.js'], {
  stdio: 'inherit',
  env: { ...process.env, ...envVars }
});

child.on('close', code => {
  process.exit(code);
});