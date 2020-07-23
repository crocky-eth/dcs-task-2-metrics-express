const mem = {}

const EXCEED_1HR = (60 * 60 * 1000) / (6 * 60)
const CLEAR_CYCLE = 0.5

setInterval(() => {
  Object.keys(mem).map((key) => {
    const now = Date.now()
    const data = mem[key]
    const exceed = now - EXCEED_1HR
    if (data.base < exceed) data.values = data.values.filter((v) => v.timestamp > exceed)
    if (data.values.length) {
      data.base = data.values[0].timestamp
    } else {
      delete mem[key]
    }
  })
  console.log(mem)
}, EXCEED_1HR * CLEAR_CYCLE)

module.exports = {
  getAll: (key) =>
    new Promise((resolve, reject) => {
      resolve(mem[key] || { base: Date.now(), values: [] })
    }),
  get: (key) =>
    new Promise((resolve, reject) => {
      const now = Date.now()
      if (mem[key]) {
        const data = mem[key]
        const exceed = now - EXCEED_1HR
        if (data.base > exceed) {
          resolve(data.values.reduce((a, c) => a + c.value, 0))
        } else {
          data.values = data.values.filter((v) => v.timestamp > exceed)
          if (data.values.length) {
            data.base = data.values[0].timestamp
          } else {
            delete mem[key]
          }
          resolve(data.values.reduce((a, c) => a + c.value, 0))
        }
      } else {
        resolve(0)
      }
    }),
  put: (key, data) =>
    new Promise((resolve, reject) => {
      const now = Date.now()
      if (mem[key]) {
        mem[key].values.push({ ...data, timestamp: now })
      } else {
        mem[key] = {
          base: Date.now(),
          values: [{ ...data, timestamp: now }],
        }
      }
      resolve(mem[key])
    }),
}
