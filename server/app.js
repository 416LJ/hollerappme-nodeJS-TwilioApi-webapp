require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 3000 || 80;
const twilioClient = require("twilio");
const client = new twilioClient(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;
app.use(cors());
// This is a single page application and it's all rendered in public/index.html
app.use(express.static("public"));
// Parse the body of requests automatically
app.use(bodyParser.json());

app.get("/api/hollers", async (req, res) => {
  
  const sentMessages = await client.messages.list({$from: twilioPhoneNumber});

  const hollers = sentMessages.map(message => message.body);
  res.json(hollers);
});

app.post("/api/hollers", async (req, res) => {
  const to = req.body.to;
  const from = process.env.TWILIO_PHONE_NUMBER;
  const body = `${req.body.sender} says: ${req.body.receiver} , ${req.body.holler}.`;

  try {
    await client.messages.create({to, from, body});
  }catch(err) {
    res.status(err.status).json({success: false, message: err.message});
  }
  
  res.json({ success: true });
});

app.listen(port, () => console.log(`Holler @PP Server is listening on port ${port}!`));

