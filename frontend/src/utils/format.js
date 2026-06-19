export const fmt = v => 'R$ ' + parseFloat(v||0).toFixed(2).replace('.',',').replace(/\B(?=(\d{3})+(?!\d))/g, '.')
export const fmtNum = v => parseFloat(v||0).toLocaleString('pt-BR')

export function esc(str) {
  const d = document.createElement('div')
  d.textContent = str
  return d.innerHTML
}

export function toast(msg, type='info') {
  const tc = document.getElementById('toast-container')
  const t = document.createElement('div')
  t.className = 'toast ' + type
  t.textContent = msg
  tc.appendChild(t)
  setTimeout(() => t.remove(), 4000)
}

export function openModal(id) {
  const m = document.getElementById(id)
  if (m) m.classList.remove('hidden')
}

export function closeModal(id) {
  const m = document.getElementById(id)
  if (m) m.classList.add('hidden')
}

window.fmt = fmt
window.esc = esc
window.toast = toast
window.openModal = openModal
window.closeModal = closeModal

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal-overlay:not(.hidden)').forEach(m => m.classList.add('hidden'))
  }
})
