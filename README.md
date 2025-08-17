# Professor Bloom

Professor Bloom is, in essence, a bot dedicated to helping the Welcome Committee onboard new Hack Clubbers, ensuring they feel at home from the moment they arrive.

![Professor Bloom](professor_bloom.jpg)
Credits for the logo: [!Eleeza Amin](https://github.com/E-Lee-Za)

## Prerequisites

- Node.js (v14 or later)
- pnpm
- A Slack workspace where you have permissions to install apps
- ngrok (for local development)

## Setting up the Slack App

1. Go to [https://api.slack.com/apps](https://api.slack.com/apps) and click "Create New App".
2. Choose "From an app manifest" and select your workspace.
3. Copy and paste the following manifest, replacing `YOUR_NGROK_URL` with your ngrok URL (we'll set this up later):

```yaml
display_information:
  name: Professor Bloom - Dev [your_name]
  description:
  background_color: "#FFFFFF"
  long_description:
features:
  app_home:
    home_tab_enabled: true
    messages_tab_enabled: true
    messages_tab_read_only_enabled: true
  bot_user:
    display_name: Bloom Dev
    always_online: true
oauth_config:
  redirect_urls:
    - YOUR_NGROK_URL/slack/oauth_redirect
  scopes:
    user:
      - chat:write
    bot:
      - app_mentions:read
      - channels:history
      - channels:join
      - channels:read
      - chat:write
      - chat:write.public
      - emoji:read
      - groups:history
      - groups:write
      - im:history
      - im:read
      - im:write
      - mpim:history
      - users:read
      - users:read.email
settings:
  event_subscriptions:
    request_url: YOUR_NGROK_URL/slack/events
    bot_events:
      - app_home_opened
      - app_mention
      - team_join
  interactivity:
    is_enabled: true
    request_url: YOUR_NGROK_URL/slack/events
  org_deploy_enabled: false
  socket_mode_enabled: false
  token_rotation_enabled: false
```

4. Review and create the app.
5. In the "Basic Information" section, note down the `App Id`, `Client Id`, `Client Secret`, `Signing Secret` .
6. Go to "OAuth & Permissions" and install the app to your workspace. Note down the "Bot User OAuth Token".

## Setting up the Project

1. Clone the repository:

   ```
   git clone https://github.com/your-repo/professor-bloom.git
   cd professor-bloom
   ```

2. Install dependencies:

   ```
   pnpm install
   ```

3. Copy the `sample.env` file to `.env`:

   ```
   cp sample.env .env
   ```

4. Edit the `.env` file and fill in the values:

   ```
   PORT=3000
   NODE_ENV="development"

   AIRTABLE_API_KEY="api-key"
   AIRTABLE_BASE_ID="base-id"
   SLACK_BOT_TOKEN="bot-token"
   SLACK_SIGNING_SECRET="signing-secret"
   SLACK_CLIENT_ID="client-id"
   SLACK_CLIENT_SECRET="client-secret"
   SLACK_APP_ID="app-id"
   SLACK_STATE_SECRET="state-secret"

   SLACK_CHANNEL_DEV_SPAM="channel-id"
   SLACK_CHANNEL_WELCOMERS="channel-id"
   SLACK_WELCOMER_COMMS_CHANNEL="channel-id"

   DATABASE_URL="postgres://<username>:<password>@localhost:5432/<database>?schema=bloom"
   SHADOW_DATABASE_URL="postgres://<username>:<password>@localhost:5432/<database>?schema=bloom_shadow"
   UPGRADE_WEBHOOK_TOKENS="first second"
   #ENABLE_TEAM_JOIN_EVENT=Uncomment to enable the team_join event
   ```

   Replace the values with your actual parameters.

5. Set up the database:
   ```
   pnpm prisma migrate dev
   ```

## Running the Application

1. Start ngrok:

   ```
   ngrok http 3000
   ```

   Note the HTTPS URL provided by ngrok.

2. Update your Slack app's request URLs:

   - Go to your Slack app's settings.
   - In "Event Subscriptions" and "Interactivity & Shortcuts", update the request URL to your ngrok HTTPS URL followed by `/slack/events`.
   - In "OAuth & Permissions", update `Redirect URLs` to your ngrok HTTPS URL followed by `/slack/oauth_redirect`.

3. Start the application:
   ```
   pnpm dev
   ```

Professor Bloom should now be running and connected to your Slack workspace!

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.
