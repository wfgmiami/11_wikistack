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

router.get('/search/:tag', (req,res,next)=>{
  Page.findByTag(req.params.tag)
  .then( pages => {
    res.render('index', { pages: pages})
  })
  .catch(next);
})


router.get('/:urlTitle', (req,res,next)=>{
  Page.findOne({
    where: {urlTitle: req.params.urlTitle}
  })
  .then( page => {
    if (page === null)
      return next(new Error('That page was not found!'));

      return page.getAuthor()
      .then( author =>{
        page.author = author;
        res.render('wikipage',{page:page})
      })
  })
  .catch(next)

})

router.post('/', (req,res,next)=>{

  User.findOrCreate({
    where:{ name: req.body.authorName,
            email: req.body.authorEmail
    }
  })
    .spread ( (user, findBool) =>{

      return Page.create({
        title: req.body.title,
        content: req.body.content,
        status: req.body.status,
        tags: req.body.tags
      })
        .then( createdPage => {
         return createdPage.setAuthor(user);
        });
    })
      .then( createdPage=>{
         res.redirect(createdPage.route)
          })
    .catch(next);


})
router.get('/:urlTitle/similar', (req,res,next)=>{
  Page.findOne({
    where:{
      urlTitle: req.params.urlTitle
    }
  })
  .then( page =>{
    if (page === null){
      return next(new Error('page was not found'));
    }
    return page.findSimilar()
  })
  .then (similarPages => {
    res.render('index', { pages: similarPages })
  })
  .catch(next)
})

router.get('/:urlTitle/edit', (req,res,next)=>{

})


module.exports = router;


