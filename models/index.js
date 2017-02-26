const Sequelize = require('sequelize');
const marked = require('marked');

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
  },
  tags: {
    type: Sequelize.ARRAY(Sequelize.TEXT),
    set: function(value){
      var arrayOfTags;
      if (typeof value === 'string'){
        arrayOfTags = value.split(',').map( tag => tag.trim());
        this.setDataValue('tags', arrayOfTags);
      }else{
        this.setDataValue('tags', value);
      }
    }
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
    },
    renderedContent: function(){
      return marked(this.content);
    }
  },
  classMethods:{
    findByTag: function(tag){
      return Page.findAll({
        where: {
          tags: {
            $overlap: [tag]
          }
        }
      })
    }
  },
  instanceMethods:{
    findSimilar: function(){
      return Page.findAll({
        where: {
          tags: {
            $overlap: this.tags
          },
          id: { $ne: this.id }
        }
      })
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

Page.belongsTo(User,{ as: 'author'});

module.exports = {
  Page: Page,
  User: User
}
