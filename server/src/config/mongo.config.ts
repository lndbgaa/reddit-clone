import dotenvSafe from "dotenv-safe";
dotenvSafe.config();

interface MongoConfig {
  uri: string;
  options: {
    auth: {
      username: string;
      password: string;
    };
  };
}

const mongoConfig: MongoConfig = {
  uri: process.env.MONGO_URI as string,
  options: {
    auth: {
      username: process.env.MONGO_USER as string,
      password: process.env.MONGO_PASSWORD as string,
    },
  },
};

export default mongoConfig;
