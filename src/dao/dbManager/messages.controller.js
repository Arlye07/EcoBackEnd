const {Router} = require('express')
const router = Router()
const Message = require('../../models/message.models')
const userAcces = require('../../middlewares/userAcces.middleword')

router.get('/', userAcces, async (req, res) => {
  const messages = await Message.find().lean();
  res.render('chat.handlebars', { messages });
});

module.exports = router