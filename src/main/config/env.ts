export default {
  mongoUrl: process.env.MONGO_URL ?? 'mongodb://mongo:27017/clean-node',
  port: process.env.PORT ?? '5050',
  jwt_secret: process.env.JWT_SECRET ?? 'gyto05345WWWW/*-.'
}
