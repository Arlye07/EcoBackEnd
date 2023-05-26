const {Router} = require('express')
const router = Router()
const Message = require('../models/messages.models')

router.get('/', async (req, res) => {
  const messages = await Message.find().lean();
  res.render('chat.handlebars', { messages });
});

module.exports = router