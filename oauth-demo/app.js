const express = require('express');
const axios = require('axios');
const app = express();

// Your provided Client ID and Client Secret
const clientID = 'Ov23lihm7v3oTo17CveH';
const clientSecret = '9e4b268011c576e1c8ae0b8b9dd8d6e88005dc9d';

console.log(clientID);

// Step 1: Redirect user to GitHub for authorization
app.get('/login', (req, res) => {
  const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${clientID}&redirect_uri=http://localhost:3000/callback&scope=user`;
  console.log(githubAuthUrl);

  res.redirect(githubAuthUrl);
});

// Step 2: GitHub redirects back to your app with a code
app.get('/callback', async (req, res) => {
  const { code } = req.query;
    console.log("Authorization code: ", code);
    if (!code){
        return res.send("Authorization code is missing.");
    }
  try {
    // Step 3: Exchange the code for an access token
    const tokenResponse = await axios.post('https://github.com/login/oauth/access_token', {
      client_id: clientID,
      client_secret: clientSecret,
      code: code,
    }, {
      headers: {
        accept: 'application/json',
      },
    });

    const accessToken = tokenResponse.data.access_token;

    // Step 4: Use the access token to get user info
    const userResponse = await axios.get('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    // Display user information (you could save this in a session or database)
    res.send(`<h1>Hello, ${userResponse.data.login}!</h1><p><img src="${userResponse.data.avatar_url}" width="100"></p>`);
  } catch (error) {
    res.send('Error during OAuth process');
  }
});

// Start the server on port 3000
app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
