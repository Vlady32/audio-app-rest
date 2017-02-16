module.exports = function (apiRoutes) {
  require('./auth')(apiRoutes);
  require('./checkTokenMDW')(apiRoutes);
  require('./users')(apiRoutes);
  require('./track')(apiRoutes);
  require('./category')(apiRoutes);
  require('./comment')(apiRoutes);
};
