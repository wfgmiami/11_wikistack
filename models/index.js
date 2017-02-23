const Sequelize = require('sequelize');
const db = new Sequelize('postgres://localhost/wikistack', { logging: false });

const Page = db.define('page', {
  title:{
    type: db.Sequelize.STRING,
    allowNull: false
  },
  urlTitle: {
    type: db.Sequelize.STRING,
    allowNull: false
  },
  content: {
    type: db.Sequelize.TEXT,
    allowNull: false
  },
  status: {
    type: db.Sequelize.ENUM('open', 'closed')
  }

},{
  hooks: {
    beforeValidate: function(page){
      if (page.title)
        page.urlTitle = page.title.replace(/\s+/g,'_').replace(/\W/g,'')

    }
  },
  getterMethods:{
    route: function(){
      return '/wiki/' + this.urlTitle;
    }
  }

})

const User = db.define('user', {
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  }
})

module.exports = {
  Page: Page,
  User: User
}
