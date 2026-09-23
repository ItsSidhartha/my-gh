import { CloneRepoOptions } from "../models.ts";
import { fetchRepoInfo, runShellCommand } from "../utils.ts";

interface RepoInfo {
  ssh_url: string;
  clone_url: string;
  full_name: string;
  fork: boolean;
  parent?: {
    ssh_url: string;
    clone_url: string;
  };
}

const clone = async (url: string, directory: string) => {
  const args = directory ? ["clone", url, directory] : ["clone", url];
  console.log(`Executing command: git ${args.join(" ")}`);
  prompt("Press Enter to continue...");
  const command = new Deno.Command("git", { args, stdout: "piped", stderr: "piped" });
  await runShellCommand(command);
}

const setUpstream = async (upstreamUrl: string, upstreamRemoteName: string, directory: string) => {
  const command = new Deno.Command("git", {
    args: ["remote", "add", upstreamRemoteName, upstreamUrl],
    cwd: directory,
  });

  await runShellCommand(command);
};

export const cloneRepo = async (repository: string, directory: string, options: CloneRepoOptions) => {
  const { noUpstream = false, upstreamRemoteName = "upstream" } = options;

  try {
    const { ssh_url, clone_url, full_name, fork, parent } = await fetchRepoInfo(repository) as RepoInfo;
    console.log(`Cloning repository '${full_name}' into directory '${directory}'...`);
    const isSsh = Boolean(ssh_url);
    const url = isSsh ? ssh_url : clone_url;

    await clone(url, directory);


    if (fork && !noUpstream) {
      const upstreamUrl = isSsh ? parent?.ssh_url : parent?.clone_url;
      if (!upstreamUrl) {
        throw new Error("Failed to determine upstream URL for the forked repository.");
      }
      console.log(`Adding upstream remote '${upstreamRemoteName}' with URL '${upstreamUrl}'...`);
      await setUpstream(upstreamUrl, upstreamRemoteName, directory);
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
    } else {
      console.error(error);
    };
  }
}