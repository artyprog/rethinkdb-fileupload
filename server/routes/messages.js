import express from 'express';
import Message from '../models/message';

const router = express.Router();

router.get('/:id', (req, res, next) => {
  Message.get(req.params.id)
    .then(message => {
      res.set('Content-Type', message.type);
      res.set('Content-Disposition', `attachment; filename=${message.name}`);
      message.stream().pipe(res);
    })
    .catch(e => next(e));
});
router.get('/', (req, res, next) => {
  Message.getAll(true,{index:'complete'}).then(function(docs) {
      res.json(docs);
  }).catch(e => next(e));
});

module.exports = router;
