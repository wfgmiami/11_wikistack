const router = require('express').Router();
const models = require('../models');
const Page = models.Page;
const User = models.User;


router.get('/', (req,res,next)=>{
  Page.findAll()
    .then( pages => {
      res.render('index', { pages: pages })
      //console.log(pages);
    })
    .catch(next);
})

router.get('/add', (req,res,next)=>{
  res.render('addpage')

})

router.get('/:urlTitle', (req,res,next)=>{

  Page.findOne({
    where: {urlTitle: req.params.urlTitle}
  })
  .then( page => {
    if (page === null)
      return next(new Error('That page was not found!'));

    res.render('wikipage', { page: page })
  })
  .catch(next)

})

router.post('/', (req,res,next)=>{
  var newPage = Page.build(req.body);
  newPage.save()
  .then((savedPage)=> {
    res.redirect(newPage.route)

  })
  .catch(next);
})


module.exports = router;

