import { api } from 'src/boot/axios'

export const UsersService = {
  getMe: () =>
    api.get('/api/v2/users/Me').then((r) => r.data),

  updateAvatar: (file) => {
    const form = new FormData()
    form.append('file', file)
    return api
      .patch('/api/v2/users/Avatar', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then((r) => r.data)
  },
}
