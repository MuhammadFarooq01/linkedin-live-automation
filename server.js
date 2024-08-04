const express = require("express");
const LinkedInLive = require("./LinkedInLive");
const app = express();
const port = 3000;

let linkedInLiveInstance;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("LinkedIn Live Automation API");
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send("Email and password are required.");
  }

  if (password.length < 6) {
    return res.status(400).send("Password must be at least 6 characters long.");
  }

  try {
    linkedInLiveInstance = new LinkedInLive(email, password);
    await linkedInLiveInstance.login();
    res.status(200).send("Login successful");
  } catch (error) {
    console.error("An error occurred:", error);
    res.status(500).send("An error occurred during login.");
  }
});

app.post("/logout", async (req, res) => {
  try {
    if (linkedInLiveInstance) {
      await linkedInLiveInstance.logout();
      linkedInLiveInstance = null;
      res.status(200).send("Logout successful");
    } else {
      res.status(400).send("No active session found.");
    }
  } catch (error) {
    console.error("An error occurred:", error);
    res.status(500).send("An error occurred during logout.");
  }
});

app.post("/create-channel", async (req, res) => {
  if (!linkedInLiveInstance) {
    return res.status(400).send("No active session found.");
  }

  const {
    name,
    uniqueAddress,
    website,
    industry,
    organizationSize,
    organizationType,
    tagline,
  } = req.body;
  if (
    !name ||
    !uniqueAddress ||
    !website ||
    !industry ||
    !organizationSize ||
    !organizationType ||
    !tagline
  ) {
    return res.status(400).send("All channel details are required.");
  }

  const channelDetails = {
    name,
    uniqueAddress,
    website,
    industry,
    organizationSize,
    organizationType,
    tagline,
  };

  try {
    await linkedInLiveInstance.createChannel(channelDetails);
    res.status(200).send("Channel created successfully");
  } catch (error) {
    console.error("An error occurred:", error);
    res.status(500).send("An error occurred while creating the channel.");
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
