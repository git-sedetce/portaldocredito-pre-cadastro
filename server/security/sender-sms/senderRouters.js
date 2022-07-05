const express = require("express");
const router = express.Router();
const myService = require("./senderService");
require("dotenv").config();

router.post("/sender-sms", async function (req, res) {
  res.json(await myService.postSenderSMS(req.body, req.headers));
});

router.post("/sender-email", async function (req, res) {
  res.json(await myService.postSenderEMAIL(req.body, req.headers));
});

router.get("/resend-code/:id", async function (req, res) {
  res.json(await myService.getResendCode(req.params.id, req.headers));
});

router.get("/comunicado", async function (req, res) {
  res.json(await myService.getComunicado(req.headers));
});

router.post('code-verify-to-password', async function (req, res) {
  res.json(await myService.postCodeNewPassword(req.body, req.headers));
});

module.exports = router;
