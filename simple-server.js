import { createServer } from 'http'

const server = createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/html' })
    res.end('Hello <b>misterBIT</b>\n')
})

const port = 3030
server.listen(port, '127.0.0.1')
console.log(`Server running at http://127.0.0.1:${port}/`)
