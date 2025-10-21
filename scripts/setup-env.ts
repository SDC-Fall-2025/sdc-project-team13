#!/usr/bin/env node

import { writeFileSync, existsSync } from 'fs';
import { join } from 'path';

const envPath = join(process.cwd(), '.env');

if (existsSync(envPath)) {
  console.log('✅ .env file already exists');
  process.exit(0);
}

const envTemplate = `# Discord Bot Configuration
DISCORD_TOKEN=your_discord_bot_token_here
DISCORD_APP_ID=your_discord_application_id_here
DISCORD_GUILD_ID=your_discord_server_id_here

# Database Configuration
DATABASE_URL=postgresql://username:password@localhost:5432/sdc_bot

# Server Configuration
PORT=3000

# Optional: For future integrations
# GITHUB_TOKEN=your_github_token_here
# LINEAR_API_KEY=your_linear_api_key_here
# OPENAI_API_KEY=your_openai_api_key_here
`;

try {
  writeFileSync(envPath, envTemplate);
  console.log('✅ Created .env file template');
  console.log('📝 Please edit .env with your actual configuration values');
} catch (error) {
  console.error('❌ Failed to create .env file:', error);
  process.exit(1);
}
