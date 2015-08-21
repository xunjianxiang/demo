var http = require('http')
var https = require('https')
var url = require('url')
var crypto = require('crypto')

var shaCrypto = crypto.createHash('sha1')

var config = null

http
	.createServer(function (request, response) {
		var params = url.parse(request.url, true).query
		access_token || getAccessToken(params.appid, params.appsecret)
		response.writeHead('Content-type', 'text/plain')
		response.end(access_token)

	})
	.listen(3000)
/* 获取access_token开始 */
function getAccessToken (appid, appsecret) {
	https
		.get('https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=' + appid + '&secret=' + appsecret, function (response) {
			var html = ""

			response.on("data", function (data) {
				html += data
			})

			response.on("end", function () {
				html = JSON.parse(html)
				getJsapiTicket(appid, html.access_token)
			})
		})
		.on("error", function  (error) {
			console.log(error)
		})
}
/* 获取access_token结束 */

/* 获取jsapi_ticket开始 */
function getJsapiTicket (appid, access_token) {
	https
		.get('https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=' + access_token + '&type=jsapi', function (response) {
			var html = ""

			response.on("data", function (data) {
				html += data
			})

			response.on("end", function () {
				html = JSON.parse(html)
				// {
				// "errcode":0,
				// "errmsg":"ok",
				// "ticket":"bxLdikRXVbTPdHSM05e5u5sUoXNKd8-41ZO3MhKoyN5OfkWITDGgnr2fwJ0m9E8NYzWKVZvdVtaUgWvsdshFKA",
				// "expires_in":7200
				// }
				
				/* 生成权限验证签名开始 */

				var jsapi_ticket = html.ticket
				var noncestr = 'Wm3WZYTPz0wzccnW'
				var timestamp = new Date().getTime()
				var require_url='http://mp.weixin.qq.com?params=value'


				var signature = 'jsapi_ticket=' + jsapi_ticket + '&noncestr=' + noncestr + 'timestamp=' + timestamp + 'url=' + require_url
				/* 生成权限验证签名结束 */
				
				shaCrypto.update(signature)
				signature = shaCrypto.digest('hex')

				config = {
					appId: appid, 
				    timestamp: timestamp, 
				    nonceStr: noncestr, 
				    signature: signature
				}

				/* 提前2分钟刷新签名 */
				setTimeout(function () {
					config = null
					getAccessToken(appid, appsecret)
				}, (html.expires_in - 60) * 1000)
			})
		})
		.on("error", function  (error) {
			console.log(error)
		})
}
/* 获取jsapi_ticket结束 */

