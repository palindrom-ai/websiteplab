const to = 'gabor.soter@progressionlabs.com'
const subject = encodeURIComponent("Let's schedule a brainstorm")
const body = encodeURIComponent(
  "Hi Gabor,\n\nI'm [your name] from [your company]. I'd love to schedule a call to discuss how Progression Labs could help us with AI.\n\n"
)

export const BRAINSTORM_HREF = `https://mail.google.com/mail/?view=cm&fs=1&to=${to}&su=${subject}&body=${body}`

export function openBrainstormEmail(e: React.MouseEvent) {
  e.preventDefault()
  window.open(BRAINSTORM_HREF, '_blank', 'noopener,noreferrer')
}
