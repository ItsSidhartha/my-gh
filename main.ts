import { execute } from "./src/execute.ts";

const main = () => {
  const command = Deno.args;
  execute(command);
}

main();