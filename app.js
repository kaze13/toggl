var bluebird = require('bluebird')
var fs = bluebird.promisifyAll(require('fs'))
var request = bluebird.promisifyAll(require('request'))

getCapcha()
//login('cml_hawke0@163.com', 'kaze131021', 'sr6p');
function getCapcha() {
  return request.getAsync('https://www.zhihu.com/captcha.gif?r=' + new Date().getTime(), {encoding: 'binary'}).then(function (data) {
    var response = data[0]
    var body = data[1]
    saveCookie(response)
    return fs.writeFileAsync('capcha.jpg', body, 'binary')
  })
}

function login(username, password, capcha) {
  var j = request.jar();
  var cookie = request.cookie(fs.readFileSync('cookie', {encoding: 'utf-8'}));
  var url = 'http://www.zhihu.com/login/email'
  j.setCookie(cookie, url);
  request.post({
    url: url, jar: j, form: {
      email: username,
      password: password,
      capcha: capcha,
      remember_me: true
    }
  }, function (err, response, body) {
    if(err) throw err;
    console.log(body)
  })
}

function saveCookie(response) {
  var setcookie = response.headers["set-cookie"]
  var cookie = '';
  if (setcookie) {
    console.log(setcookie);
    setcookie.forEach((str)=> {
      cookie = cookie + ';' + str
    })
    fs.writeFileSync('cookie', cookie);
  }
}


