import chalk from "chalk";
import config from "../config/config.js";
export default ({ type, statusCode, statusText, context = undefined, message, details = {}, stack = null, }) => {
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
//# sourceMappingURL=logError.js.map