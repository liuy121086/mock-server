module.exports = function(app) {
  const student = require('./data');

  //  新增学生
  app.post('/data/add', student.add);

  //  删除学生
  app.delete('/data/delete/:id', student.delete);

  //  更新学生信息
  app.put('/data/update', student.update);

  //  查询学生信息
  app.post('/data/list', student.find);

  //  查询单个学生接口
  app.get('/data', student.findById);

  app.post('/data/radom', student.radom);
  app.post('/data/mock2', student.mock2);
};