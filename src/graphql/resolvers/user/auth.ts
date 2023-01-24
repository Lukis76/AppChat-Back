import jwt from 'jsonwebtoken'


export const authContext = (constext) => {
  const authHeader = context.req.headers.authorization
  if(authHeader) {
    const token = authHeader.split('Bearer ')[1]
    if(token) {
      try {
       const user = jwt.verify(token, '123')
      return user
      } catch (error) {
  throw new Error('Invalid / Expired Token')         
      }
      throw new Error('auhentication token must be bearer')
    }
  }
}
