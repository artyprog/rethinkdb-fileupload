import path from 'path';
import messages from './messages';

export default function(app){
  app.use('/messages', messages);
  app.get('*', (req, res) => res.sendFile('index.html', {
    root: process.env.STATIC_ROOT || path.join(__dirname,'../../public')
  }));
}