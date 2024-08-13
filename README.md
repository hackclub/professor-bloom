# Professor Bloom

> Next to the station in the Hack Club neighbourhood, is a cafe run by an old man. Well-beloved by the community, he knows everything about every place in the neighbourhood. He was once a professor at a local high school, seeing through the progression of hackers through the ages. Nowadays, he has retired, with fond memories of his experiences. When a newcomer arrives in the community, he invites them in to his cafe for a nice chat and a cup of tea (or other warm beverage of their choice), to help them settle in. When they leave, he gives them a bouquet of home-grown flowers and a warm smile. He keeps an Orpheus plush with a flower crown on the counter of the cafe.

Professor Bloom is, in essence, a bot dedicated to helping the Welcome Committee onboard new Hack Clubbers, ensuring they feel at home from the moment they arrive.

## Running locally

Contributions are encouraged and welcome!

In order to run Professor Bloom locally, you'll need to [join the Hack Club Slack](https://hackclub.com/slack). From there, ask @creds to be added to the Toriel app on Slack.

1. Clone this repository
   `git clone https://github.com/hackclub/toriel && cd toriel`
2. Install [ngrok](https://dashboard.ngrok.com/get-started/setup) (if you haven't already)
3. Install dependencies
   `npm install`
4. Create `.env` file
   - `touch .env`
   - Copy `sample.env` and fill your own values
5. Start server
   `npm run dev`
6. Forward your local server to [underpass](https://github.com/cjdenio/underpass), an open source alternative made by a Hack Club team member.

