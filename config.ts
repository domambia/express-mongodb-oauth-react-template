const configs = {
  appName: "ExpressMongoOAuthTemp",
  port: 3000,
  jwt: {
    secret: "34567890-09876543456789098765",
  },
  db: {
    mongoDb: "mongodb://localhost:27017/express-mongodb-oauth-db",
  },
  passport: {
    google: {
      clientID:
        "50483665817-mtl05rrg3rit6bktvhvfqghtdkq9bd8b.apps.googleusercontent.com",
      clientSecret: "qIW0NlU98FapXjDkIWiJRpZc",
    },
  },
};

export { configs };
