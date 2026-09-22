import { Command } from "commander";
import { repoCommand } from "./commands.ts";

export const execute = (inputStrings: string[]) => {
  const program = new Command();

  program
    .name("My gh")
    .description("A CLI tool for GitHub")
    .version("1.0.0");
  
  program.addCommand(repoCommand());

  program.parse(inputStrings, { from: "user" });
}