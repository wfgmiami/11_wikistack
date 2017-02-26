const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const swig = require('swig');
swig.setDefaults( { cache: false });
const models = require('./models');
const wikiRouter = require('./routes/wiki');
const usersRouter = require('./routes/users');


const Page = models.Page;
const User = models.User;

const app = express();

app.set('view engine', 'html');
app.engine('html', swig.renderFile);
app.set('views', __dirname + '/views');

app.use(express.static(__dirname + '/node_modules'));
app.use(express.static(__dirname + '/public'));
app.use(morgan('dev'));

app.use(bodyParser.urlencoded( { extended: false }));
app.use(bodyParser.json());

//app.use(methodOverride('_method'));

app.get('/', (req,res,next)=>{
  res.render('index');
})

app.use('/wiki', wikiRouter);
app.use('/users', usersRouter);

app.use((err,req,res,next)=>{
  console.error(err);
  res.status(500).send(err.message);;
});

const port = process.env.PORT || 3000;

User.sync()
  .then(function(){
    return Page.sync();
  })
  .then(function(){
    app.listen(port,function(){
      console.log('Server is listening on port ' + port);
    })
  })




