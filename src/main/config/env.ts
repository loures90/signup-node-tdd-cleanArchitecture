export default {
  mongoUrl: process.env.MONGO_URL ?? 'mongodb://127.0.0.1:27017/clean-node',
  port: process.env.PORT ?? '5050',
  jwt_secret: process.env.JWT_SECRET ?? 'gyto05345WWWW/*-.'
}
