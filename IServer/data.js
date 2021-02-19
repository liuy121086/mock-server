const Mock = require('mockjs');
let list = [];
const count = 3;

const http = require("http");
const url = require("url");



for (let i = 0; i < count; i++) {
  list.push(
    Mock.mock({
      id: '@increment',
      stuNo: 20220000 + parseInt(`${i + 1}`),
      stuName: '@cname',
      stuGender: '@integer(0,1)',
      stuPhone: /^1[0-9]{10}$/,
      stuBirthday: '@date("yyyy-MM-dd")',
      classNo: '@integer(201901,201912)'
    })
  );
}


//测试
exports.radom = (req,res) =>{
  console.log(req.headers);
  var posturl = req.protocol+"://"+req.get('host')+"/data/add";
  console.log(posturl);
  request.post({url:posturl, form:Mock.mock({
        id: '@increment',
        stuNo: 'number|100000000-999999999'+'X',
        stuName: '@cname',
        stuGender: '@integer(0,1)',
        stuPhone: /^1[0-9]{10}$/,
        stuBirthday: '@date("yyyy-MM-dd")',
        classNo: '@integer(201901,201912)'
      })}, function(error, response, body) {
          body = JSON.parse(body);
          res.status(200).json(body);
      })
}








//测试
exports.mock2 = (req,response) =>{
    var d = Mock.mock({    
            "usercode":"@name",
            "temp_a":"@word",
            "screenName": "@cword(4)识别系统",
            "screenIp": "@ip",
            "screenTime": "@datetime",
            "screenGs": "@integer(0, 1)",
            "screenIsEmp": "@integer(0, 1)",
            "screenIsFk": "@integer(0, 1)",
            "screenIsNum": "@integer(0, 1)",
            "screenIsOrg": "@integer(0, 1)",
            "screenIsComp": "@integer(0, 1)"

            });
    var strJson=JSON.stringify(d);
    let config = {
      hostname:'172.16.4.246',
      port: 8081,
      path: '/screenset/saveScreenSet',  
      method: "POST",
      headers: {
        'token':'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxIn0.yfxKdLyJJ4JqIPdKoP0OY7H2dzXQs5zG18Dtm9eP9n0',
        "Content-type": "application/json"
      }
    };
    http.request(config, res => {
      // 接收服务器返回的数据
      let buffers = [];
      res.on("data", data => buffers.push(data));
      res.on("end", () => {
          let data = Buffer.concat(buffers).toString();
          data = JSON.parse(data);
         response.status(200).json(data);
      });
    }).end(strJson);
}









//  增加学生
exports.add = (req, res) => {
  const { classNo, stuBirthday, stuGender, stuName, stuPhone } = req.body;
  console.log( classNo, stuBirthday, stuGender, stuName, stuPhone);
  list.push({
    id: list[list.length - 1].id + 1,
    stuNo: list[list.length - 1].stuNo + 1,
    classNo: classNo,
    stuBirthday: stuBirthday,
    stuGender: stuGender,
    stuName: stuName,
    stuPhone: stuPhone
  });
  let msg = {
    code: 20000,
    data: {
      listNum: list.length,
      message: '添加成功!'
    }
  };
  res.status(200).json(msg);
};

//  删除学生
exports.delete = (req, res) => {
  const id = req.params.id;

  //  判断id是否存在
  let flag = list.some(item => {
    if (item.id == id) {
      return true;
    }
  });

  if (flag) {
    // id 存在
    list = list.filter(item => item.id !== parseInt(id));
    const msg = {
      code: 20000,
      data: {
        listNum: list.length,
        message: '删除成功!'
      }
    };
    res.status(200).json(msg);
  } else {
    //  id不存在
    const msg = {
      code: 40000,
      data: {
        msg: 'id不存在!'
      }
    };
    res.status(500).json(msg);
  }
};
//  更新学生信息
exports.update = (req, res) => {
  const { id, classNo, stuBirthday, stuGender, stuName, stuPhone } = req.body;

  //  判断id是否存在
  let flag = list.some(item => {
    if (item.id == id) {
      return true;
    }
  });

  if (flag) {
    //  id存在
    list.some(item => {
      if (item.id === id) {
        item.classNo = classNo;
        item.stuBirthday = stuBirthday;
        item.stuGender = stuGender;
        item.stuName = stuName;
        item.stuPhone = stuPhone;
      }
    });
    let msg = {
      code: 20000,
      data: {
        message: '更新成功!'
      }
    };
    res.status(200).json(msg);
  } else {
    //  id不存在
    const msg = {
      code: 40000,
      data: {
        msg: 'id不存在!'
      }
    };
    res.status(500).json(msg);
  }
};
//  查询学生信息
exports.find = (req, res) => {
  let { queryStr, page = 1, limit = 10 } = req.body;
  //  根据学生姓名查询学生或者返回所有学生信息

  const mockList = queryStr && queryStr.length > 0 ? list.filter(item => item.stuName.includes(queryStr)) : list;
  //  数据分页
  const pageList = mockList.filter((item, index) => index < limit * page && index >= limit * (page - 1));
  let msg = {
    code: 20000,
    count: mockList.length,
    data: pageList
  };
  res.status(200).json(msg);
};

//  根据id返回学生信息
exports.findById = (req, res) => {
  const id = req.query.id;
  const pageList = list.filter(item => item.id == id);
  const msg = {
    code: 20000,
    data: pageList
  };
  res.status(200).json(msg);
};