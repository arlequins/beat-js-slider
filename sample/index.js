const express = require('express')
const app = express()
const port = 3000
const path = require('path')

app.use('/sample/public', express.static(path.join(__dirname, 'public')))
app.use('/dist', express.static(path.join(__dirname, '..', 'dist')))

app.use('/banner-*', (_req, res) => {
  res.sendFile(
    path.resolve(__dirname, 'public', 'banner.html')
  )
})

app.use('/', (_req, res) => {
  res.sendFile(
    path.resolve(__dirname, 'public', 'index.html')
  )
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
