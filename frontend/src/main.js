import { App } from './App.js'
import { Database } from './services/database.js'

window.db = new Database()

document.addEventListener('DOMContentLoaded', async () => {
  await window.db.init()
  window.app = new App()
  await window.app.init()
})
