const cluster = require('cluster')
const numCPUs = require('os').cpus().length

const clusterAll = (promises, cb) => {
  const length = promises.length
  const clusters = numCPUs > length ? length : numCPUs
  if (cluster.isMaster) {
    let values = []
    let workers = clusters
    for (let i = 0; i < clusters; i++) {
      let worker = cluster.fork()
      worker.send({index: i})
      worker.on('message', (msg) => {
        values[msg.index] = msg.values
        worker.kill()
        workers -= 1
        if (workers === 0) {
          cb(null, [].concat.apply([], values))
        }
      })
    }
  } else {
    process.on('message', (msg) => {
      const index = msg.index
      const begin = Math.round(length / clusters * index)
      const end = Math.round(length / clusters * (index + 1))
      let all = promises.slice(begin, end)
      Promise.all(all).then((values) => {
        process.send({index: index, values: values});
      })
    })
  }
}

module.exports = clusterAll
