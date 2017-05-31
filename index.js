let http = require('http'),
    url = require('url')

let PORT = process.env.PORT || 8080

http.createServer((req, res) => {
    let pUrl = url.parse(req.url, true)

    if (!pUrl.query || !pUrl.query.get) {
        res.writeHead(404, "text/plain")
        res.end("url not found!")
        return
    }

    let destUrl = url.parse(pUrl.query.get, true)

    //set cors
    res.setHeader('Access-Control-Allow-Origin', '*')

    let proxyRequest = http.request({
        port: destUrl.port || 80,
        host: destUrl.host,
        method: 'GET',
        path: destUrl.path
    })

    proxyRequest.end()

    proxyRequest.addListener('response', (proxyResponse) => {
        res.writeHead(proxyResponse.statusCode, proxyResponse.headers)

        proxyResponse.addListener('data', (chunk) => {
            res.write(chunk)
        })

        proxyResponse.addListener('end', () => {
            res.end()
        })
    })
}).listen( PORT, ()=>{
    console.log(`server is listening at ${PORT}`)
} )