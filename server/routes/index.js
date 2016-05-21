const path = require('path');
import messages from './messages';

module.exports = function(app){
  app.use('/messages', messages);
  app.get('*', (req, res) => res.sendFile('index.html', {
    root: process.env.STATIC_ROOT || path.join(__dirname,'../../public')
  }));
};
