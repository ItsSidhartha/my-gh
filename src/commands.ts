import { Command } from "commander/esm.mjs";
import { createRepo } from "./handlers/createRepo.ts";
import { cloneRepo } from "./handlers/cloneRepo.ts";
import { CloneRepoOptions, createRepoOptions, DeleteRepoOptions } from "./models.ts";
import { deleteRepo } from "./handlers/deleteRepo.ts";

const repoCommand = () => {
  const command = new Command("repo")
    .description("Manage GitHub repositories")

  command
    .command("create <name>")
    .description("Create a new GitHub repository")
    .option("-d, --description <description>", "Description of the repository", "Created via My gh CLI tool")
    .option("--add-readme", "Automatically initialize the repository with a README", false)
    .option("--private", "Make the repository private")
    .option("--public", "Make the repository public")
    .action(async (name: string, options: createRepoOptions) => {
      await createRepo(name, options);
    });

  command
    .command("clone <repository> [<directory>]")
    .description("Clone an existing GitHub repository")
    .option("--no-upstream", "Do not add an upstream remote when cloning a fork")
    .option("-u --upstream-remote-name <name>", "Upstream remote name when cloning a fork (default \"upstream\")")
    .action(async (repository: string, directory: string, options: CloneRepoOptions) => {
      await cloneRepo(repository, directory, options);
    });

  command
    .command("delete <repository>")
    .description("Delete a GitHub repository")
    .option("--yes", "Confirm deletion without prompting")
    .action(async (repository: string, options: DeleteRepoOptions) => {
      await deleteRepo(repository, options);
    });

  return command;
}

const authCommand = () => {
  const command = new Command("auth")
    .description("Manage GitHub authentication")

  command
    .command("login")
    .description("Login to GitHub")
    .action(() => {
      console.log("Logging in to GitHub...");
      // Implement login logic here
    });

  return command;
}

export { repoCommand, authCommand };