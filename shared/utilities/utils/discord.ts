import axios from 'axios'

/**
 * Returns a valid Discord invite key from a given hCaptcha token
 * @param token - valid hCaptcha token
 */
export const getDiscordInvite = async (token: string) => {
  if (!!token) {
    let bodyFormData = new FormData()
    bodyFormData.append('h-captcha-response', token)

    const response = await axios({
      method: 'post',
      url: 'https://discord-invite.pooltogether-api.workers.dev/generateInvite',
      data: bodyFormData,
      headers: { 'Content-Type': 'multipart/form-data' }
    })

    if (response.status === 200) {
      const inviteToken = await response.data
      window.location.href = `https://discord.com/invite/${inviteToken}`
    }
  }
}
