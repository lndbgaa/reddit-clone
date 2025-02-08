import config from "@config/config.js";
import chalk from "chalk";

interface LogErrorArgs {
  type: string;
  statusCode: number;
  statusText: string;
  context?: string;
  message: string;
  details?: Record<string, unknown>;
  stack?: string | null;
}

export default ({
  type,
  statusCode,
  statusText,
  context = undefined,
  message = "Unknown Error",
  details = {},
  stack = null,
}: LogErrorArgs) => {
  const formattedStack = stack ? stack.split("\n").slice(1).join("\n") : undefined;

  console.error(chalk.red(`❌ ${type}`));
  console.error(chalk.red(`----------------------------------------`));
  console.error(chalk.red(`- Error: (${statusCode}) ${statusText}`));
  console.error(chalk.red(`- Context: ${context}`));
  console.error(chalk.red(`- Message: ${message}`));
  if (Object.keys(details).length > 0) {
    console.error(chalk.red(`- Details:`));
    for (const [key, value] of Object.entries(details)) {
      console.error(chalk.red(`  - ${key}: ${value}`));
    }
  }
  if (formattedStack && config.env === "development") {
    console.error(chalk.red(`----------------------------------------`));
    console.error(chalk.red(`Stack Trace:\n${formattedStack}`));
  }
};
