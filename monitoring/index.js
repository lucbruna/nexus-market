const os = require('os')
const { performance } = require('perf_hooks')

class Monitoring {
  constructor() {
    this.metrics = []
    this.interval = null
  }

  start(intervalMs = 60000) {
    this.collect()
    this.interval = setInterval(() => this.collect(), intervalMs)
    console.log(`📊 Monitoramento iniciado (a cada ${intervalMs / 1000}s)`)
  }

  stop() {
    if (this.interval) clearInterval(this.interval)
  }

  collect() {
    const mem = process.memoryUsage()
    const cpu = os.cpus()
    const loadAvg = os.loadavg()

    const metric = {
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: {
        rss: mem.rss,
        heapTotal: mem.heapTotal,
        heapUsed: mem.heapUsed,
        external: mem.external,
        percentUsed: ((mem.heapUsed / mem.heapTotal) * 100).toFixed(1),
      },
      cpu: {
        cores: cpu.length,
        loadAvg1m: loadAvg[0],
        loadAvg5m: loadAvg[1],
        loadAvg15m: loadAvg[2],
        percent: (loadAvg[0] / cpu.length * 100).toFixed(1),
      },
      os: {
        freemem: os.freemem(),
        totalmem: os.totalmem(),
        memPercent: ((1 - os.freemem() / os.totalmem()) * 100).toFixed(1),
      },
    }

    this.metrics.push(metric)
    if (this.metrics.length > 1440) this.metrics.shift() // Keep last 24h at 1min intervals

    return metric
  }

  getMetrics(hours = 1) {
    const since = Date.now() - hours * 3600000
    return this.metrics.filter(m => new Date(m.timestamp).getTime() >= since)
  }

  getHealth() {
    const last = this.metrics[this.metrics.length - 1] || this.collect()
    return {
      status: last.memory.percentUsed < 90 && last.cpu.percent < 80 ? 'healthy' : 'degraded',
      memory: `${last.memory.percentUsed}%`,
      cpu: `${last.cpu.percent}%`,
      uptime: `${Math.floor(last.uptime / 86400)}d ${Math.floor((last.uptime % 86400) / 3600)}h`,
      timestamp: last.timestamp,
    }
  }

  async checkDependencies() {
    const checks = {
      postgres: await this.pingHost('localhost', 5432),
      redis: await this.pingHost('localhost', 6379),
      rabbitmq: await this.pingHost('localhost', 5672),
      minio: await this.pingHost('localhost', 9000),
    }
    return checks
  }

  pingHost(host, port, timeout = 3000) {
    return new Promise(resolve => {
      const net = require('net')
      const sock = new net.Socket()
      sock.setTimeout(timeout)
      sock.on('connect', () => { sock.destroy(); resolve(true) })
      sock.on('error', () => { sock.destroy(); resolve(false) })
      sock.on('timeout', () => { sock.destroy(); resolve(false) })
      sock.connect(port, host)
    })
  }
}

module.exports = new Monitoring()
