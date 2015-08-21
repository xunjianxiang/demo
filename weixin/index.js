var http = require('http')
var https = require('https')
var url = require('url')
var crypto = require('crypto')

var shaCrypto = crypto.createHash('sha1')

var appid = 'wx74f3c101ef7229fb'

var jsapi_ticket = null

// 初始化access_token和jsapi_ticket
getAccessToken()			

http
	.createServer(function (request, response) {
		
		response.writeHead(200, {'Content-Type': 'text/plain'})
		// 直接返回配置
		// response.end('success')
		response.end(JSON.stringify(getSignture()))

	})
	.listen(80)





function getSignture (argument) {
	/* 生成权限验证签名开始 */

	console.warn(jsapi_ticket)
	var noncestr = 'Wm3WZYTPz0wzccnW'
	var timestamp = new Date().getTime()
	var require_url='http://mp.weixin.qq.com?params=value'


	var signature = 'jsapi_ticket=' + jsapi_ticket + '&noncestr=' + noncestr + 'timestamp=' + timestamp + 'url=' + require_url
	
	shaCrypto.update(signature)
	signature = shaCrypto.digest('hex')


	/* 生成权限验证签名结束 */

	return {
		appId: appid,
	    timestamp: timestamp,
	    nonceStr: noncestr, 
	    signature: signature
	}
}

/* 获取access_token */
function getAccessToken () {
	var date = new Date()
	console.log(date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds(), 'getAccessToken')
	var appsecret = '2f026eddf5a6bb4990043618bc98fac9'
	https
		.get('https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=' + appid + '&secret=' + appsecret, function (response) {
			var html = ""

			response.on("data", function (data) {
				html += data
			})

			response.on("end", function () {
				console.log('access_token', html)
				html = JSON.parse(html)
				getJsapiTicket(html.access_token)
			})
		})
		.on("error", function  (error) {
			console.log(error)
		})
}

/* 获取jsapi_ticket */
function getJsapiTicket (access_token) {
	var date = new Date()
	console.log(date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds(), 'getJsapiTicket')
	https
		.get('https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=' + access_token + '&type=jsapi', function (response) {
			var html = ""

			response.on("data", function (data) {
				html += data
			})

			response.on("end", function () {
				console.log('jsapi_ticket', html)
				html = JSON.parse(html)
				jsapi_ticket = html.ticket
				// {
				// "errcode":0,
				// "errmsg":"ok",
				// "ticket":"bxLdikRXVbTPdHSM05e5u5sUoXNKd8-41ZO3MhKoyN5OfkWITDGgnr2fwJ0m9E8NYzWKVZvdVtaUgWvsdshFKA",
				// "expires_in":7200
				// }
				
				/* 提前2分钟刷新签名 */
				setTimeout(function () {
					getAccessToken(appid)
				}, (html.expires_in - 60) * 1000)
			})
		})
		.on("error", function  (error) {
			console.log(error)
		})
}


				