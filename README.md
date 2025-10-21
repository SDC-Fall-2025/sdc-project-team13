# SDC Project Management Bot

A Discord bot for managing Software Development Club project teams, tracking progress, and providing AI-powered assistance.

## Features

### Current Implementation (Week 1-2)
- ✅ Basic Discord bot setup with slash commands
- ✅ Team registration and management
- ✅ User registration and role management
- ✅ Project setup (title and description)
- ✅ Message logging for context tracking
- ✅ Discord role management for team leaders and members

### Commands Available

#### Team Management
- `/register-team` - Register a new team (Team leaders only)
- `/add-member` - Add a member to your team (Team leaders only)
- `/remove-member` - Remove a member from your team (Team leaders only)
- `/set-project` - Set project title and description (Team leaders only)
- `/team-info` - View your team's information
- `/list-teams` - List all teams in the server

#### Basic Commands
- `/hello` - Basic greeting command
- `!hello` - Prefix-based greeting (fallback)

## Setup Instructions

### Prerequisites
- Node.js 18+ 
- PostgreSQL database
- Discord bot token and application ID

### Installation

1. **Clone and install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   Create a `.env` file in the root directory:
   ```env
   DISCORD_TOKEN=your_discord_bot_token
   DISCORD_APP_ID=your_discord_application_id
   DISCORD_GUILD_ID=your_discord_server_id
   DATABASE_URL=postgresql://username:password@localhost:5432/sdc_bot
   PORT=3000
   ```

3. **Set up the database:**
   ```bash
   npm run prisma:migrate
   npm run prisma:generate
   ```

4. **Register slash commands:**
   ```bash
   npm run register
   ```

5. **Start the bot:**
   ```bash
   npm run dev
   ```

## Usage Guide

### Setting Up a Team

1. **Register your team:**
   - Go to your team's Discord channel (e.g., #team-1, #team-2, etc.)
   - Use `/register-team team-number:1 team-name:"My Awesome Team"`
   - This will create the team and assign you as the leader

2. **Add team members:**
   - Use `/add-member user:@username` to add members
   - Members will automatically get the appropriate Discord role

3. **Set up your project:**
   - Use `/set-project title:"Project Name" description:"Detailed description"`
   - This helps the bot understand your project context

4. **View team information:**
   - Use `/team-info` to see your team's details
   - Use `/list-teams` to see all teams in the server

### Discord Server Structure

The bot is designed to work with the SDC Discord server structure:
- **Teams category:** Contains channels #team-1 through #team-22
- **Each team channel:** Automatically linked to its corresponding team number
- **Role management:** Automatic role assignment for team leaders and members

## Database Schema

### Models
- **User:** Discord user information
- **Team:** Team details and project information
- **TeamMember:** User-team relationships with roles
- **MessageLog:** Message history for context tracking

### Roles
- **LEADER:** Can manage team members and project details
- **MEMBER:** Regular team member

## Development Roadmap

### Week 1 ✅
- Basic bot setup and slash commands
- Team registration system

### Week 2 ✅
- Message logging for context
- User and team management
- Discord role integration

### Week 3 (Next)
- AI integration for intelligent responses
- Context-aware command switching

### Week 4
- AI optimization for project-specific advice

### Week 5
- GitHub integration for commit/PR tracking

### Week 6-8
- Additional integrations (Linear, Cal.com, etc.)
- Reporting and analytics

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

ISC License - see LICENSE file for details