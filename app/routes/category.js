var Category = require('../models/Category');
var config = require('../../config/database');
var async = require('async');

module.exports = function(apiRoutes) {

  //get all categories
  apiRoutes.get('/categories', function(req, res) {

    Category.find({}, function(err, categories) {
      if (err) {
        res.json({success: false, msg: "Error in getting categories", error: err.message});
      } else {
        res.json({success: true, msg: categories});
      }
    })

  });

  //add new category
  apiRoutes.post('/categories', function(req, res) {

    var category = new Category({name: req.body.name});

    category.save(function(err) {
      if (err) {
        res.json({success: false, msg: 'Error in saving category', error: err.message});
      } else {
        res.json({success: true, msg: 'Category has been successfully added'});
      }
    });

  });

};
