export type Client = {
  id: string,
  secret: string,
}

export type AccessTokenResponse = {
  access_token: string,
  expires_in: number,
  scope: string,
  refresh_token: string,
  created_time: number
}