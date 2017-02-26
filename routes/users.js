const router = require('express').Router();
const models = require('../models');
const Page = models.Page;
const User = models.User;

router.get('/', (req,res,next)=>{
  User.findAll()
  .then( users => {
    res.render('users', { users: users})
  })
  .catch(next)
})

// router.get('/:userId', (req,res,next)=>{
//  let user;

//  User.findById(req.params.userId)
//  .then( _user => {
//    user = _user;
//    return Page.findAll({
//      where: { authorId: req.params.userId }
//    })

//  })
//  .then ( pages => {
//    res.render('userpage', {user:user, pages: pages })
//  })
//  .catch(next);
// })

router.get('/:userId',(req,res,next)=>{

  var findingUser = User.findById(req.params.userId)
  //alex
  var findingPages = Page.findAll({
    where: {authorId: req.params.userId}
  })
  Promise.all([findingUser, findingPages])
  .then( values => {
    var user = values[0];
    var pages = values[1];
    user.pages = pages;

    res.render('userpage', {user: user, pages:pages})
  })
  .catch(next);

})


module.exports = router;
