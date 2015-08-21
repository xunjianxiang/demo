var crypto = require('crypto')

var shaCrypto = crypto.createHash('sha1')
var data = {
	ad: 1,
	length: 2,
	age: 3
}
data.ad = null
data.id || console.log("data.id is deleted")
console.log(data)
shaCrypto.update('password')
shaCrypto.digest('hex')
console.log(shaCrypto.digest('hex'))
// url_link = 'http://localhost:3000/api?appid=4513545FHSj&apptoken=sadfasda545665'

// var url = require('url')
// var p = url.parse(url_link, true).query
// console.log(p.appid, p.apptoken)