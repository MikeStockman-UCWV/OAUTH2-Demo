oauth demo

Here's a step-by-step guide, assuming you're integrating GitHub's OAuth 2.0.

### Step 1: **Create a GitHub OAuth App**
This is the first step in integrating GitHub OAuth 2.0 into your demo app.

1. **Log in to GitHub**: Go to [GitHub.com](https://github.com) and log in.

2. **Go to Developer Settings**:
   - Click on your profile picture in the top right corner.
   - Select **Settings** from the dropdown.
   - On the left sidebar, scroll down to **Developer settings**.
   - Click **OAuth Apps**.

3. **Create a New OAuth App**:
   - Click on **New OAuth App**.
   - Fill out the required fields:
     - **Application Name**: Enter a name for your demo app (e.g., “College OAuth Demo”).
     - **Homepage URL**: Enter a URL for your demo app, such as `http://localhost:3000` for local testing or a demo link.
     - **Authorization callback URL**: This is where GitHub will redirect after the user authorizes your app. For local development, use `http://localhost:3000/callback`.
   
4. **Register Your Application**:
   - Once you’ve filled out the form, click **Register Application**. GitHub will then provide a **Client ID** and **Client Secret**.
   - Keep these values handy—they are necessary for your OAuth 2.0 flow.

### Step 2: **Set Up the Demo Application**
Now, let's create a basic Node.js Express application to demonstrate the OAuth 2.0 flow with GitHub.

#### a. **Install Required Packages**

You'll need some packages for handling OAuth, making HTTP requests, and managing the web server. In your project directory, run:

```bash
npm init -y
npm install express axios
```

#### b. **Basic Server Setup**

Create a file called `app.js` and add the following code:

```javascript
const express = require('express');
const axios = require('axios');
const app = express();

const clientID = 'YOUR_CLIENT_ID';
const clientSecret = 'YOUR_CLIENT_SECRET';

// Step 1: Redirect user to GitHub for authorization
app.get('/login', (req, res) => {
  const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${clientID}&redirect_uri=http://localhost:3000/callback&scope=user`;
  res.redirect(githubAuthUrl);
});

// Step 2: GitHub redirects back to your app with a code
app.get('/callback', async (req, res) => {
  const { code } = req.query;

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
```

#### c. **Replace Client ID and Secret**
Make sure to replace `YOUR_CLIENT_ID` and `YOUR_CLIENT_SECRET` with the values GitHub gave you when you registered your OAuth app.

### Step 3: **Run the Application**
1. **Start your Node.js server**:

```bash
node app.js
```

2. **Navigate to `http://localhost:3000/login`**:
   - In your browser, go to `http://localhost:3000/login`.
   - This will redirect you to GitHub’s OAuth login screen, where you’ll authorize your demo app to access your GitHub account.

3. **Authorize the App**:
   - GitHub will ask you to authorize the app and list the permissions it’s requesting (in this case, basic user info).
   - After you authorize the app, GitHub will redirect you back to your application at `http://localhost:3000/callback` with an authorization code.

4. **Access the User Data**:
   - Your app will exchange the authorization code for an access token and use the access token to retrieve your GitHub user information (e.g., your username and avatar).
   - The user information will be displayed on the screen.

### Step 4: **Explain the OAuth Flow to Students**
This is a great opportunity to explain the OAuth 2.0 process in detail:

1. **Authorization Request**:
   - The user clicks the login button (`/login` route) and gets redirected to GitHub to grant access.
   
2. **Authorization Code**:
   - After granting access, GitHub sends an authorization code to your app’s callback URL (`/callback` route).

3. **Access Token Exchange**:
   - Your app exchanges the authorization code for an access token by making a POST request to GitHub's `/login/oauth/access_token` endpoint.

4. **API Request**:
   - Using the access token, your app makes an API request to GitHub’s user info endpoint to retrieve the user's GitHub profile.

### Step 5: **Secure the App (Optional for Demo)**
If you want to take the demo further, you can introduce security measures, such as:
- **Storing Access Tokens**: Show how tokens can be stored in sessions or a database.
- **HTTPS**: Discuss the importance of using HTTPS for the callback URL in production to protect sensitive data.
- **Error Handling**: Show how to handle different types of errors that might occur during the OAuth flow.

### Conclusion
This setup should give students a clear understanding of how OAuth 2.0 works, specifically with GitHub. You can walk them through the steps of creating an OAuth app, setting up a simple demo application, and understanding the OAuth 2.0 flow from the user's perspective.

