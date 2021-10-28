require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = process.env.PORT || 3000 || 80;
const twilioClient = require("twilio");
const client = new twilioClient(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

// This is a single page application and it's all rendered in public/index.html
app.use(express.static("public"));
// Parse the body of requests automatically
app.use(bodyParser.json());

app.get("/api/hollers", async (req, res) => {
  // TODO: Get a list of messages sent from a specific number
  const sentMessages = await client.messages.list({$from: twilioPhoneNumber});
  // TODO: Gather only the body of those messages for sending to the client
  const hollers = sentMessages.map(message => message.body);
  res.json(hollers);
});

app.post("/api/hollers", async (req, res) => {
  const to = req.body.to;
  const from = process.env.TWILIO_PHONE_NUMBER;
  const body = `${req.body.sender} says: ${req.body.receiver} is ${req.body.holler}. See more Hollers at ${req.headers.referer}`;
  // TODO: Send a message
  res.json({ success: false });
});

app.listen(port, () => console.log(`Prototype is listening on port ${port}!`));
