import { CloneRepoOptions } from "../models.ts";
import { getOwner } from "../utils.ts";

const getOwnerAndName = (repo: string) => {
  if (!repo.includes("/")) {
    return [getOwner(), repo];
  }

  return repo.split("/");
}

const fetchRepoInfo = async (owner: string, name: string) => {
  const request = new Request(`https://api.github.com/repos/${owner}/${name}`, {
    method: "GET",
    headers: {
      "Authorization": `token ${Deno.env.get("MY_GH_CLI_PAT")}`,
      "Content-Type": "application/json",
    },
  });

  const response = await fetch(request);

  if (!response.ok) {
    throw new Error(`Failed to fetch repository information: ${response.statusText}`);
  }
  return await response.json();

}

const clone = async (url: string, directory: string) => {
  // const command = ["git", "clone", url, directory];
  const command = new Deno.Command("git", {
    args: ["clone", url, directory],
    stdout: "piped",
    stderr: "piped",
  });
  await command.output();
}

const setUpstream = async (upstreamRemoteName: string, upstreamUrl: string, directory: string) => {
  const command = new Deno.Command("git", {
    args: ["remote", "add", upstreamRemoteName, upstreamUrl],
    cwd: directory, // Sets the working directory directly for Git
  });
  await command.output();
}

export const cloneRepo = async (repository: string, directory: string, options: CloneRepoOptions) => {
  const { noUpstream, upstreamRemoteName } = options;
  const [owner, name] = getOwnerAndName(repository);

  try {
    const { ssh_url, clone_url, full_name, fork } = await fetchRepoInfo(owner, name) as { ssh_url: string, clone_url: string, full_name: string, fork: boolean };
    console.log(`Cloning repository '${full_name}' into directory '${directory}'...`);
    const url = ssh_url || clone_url;
    await clone(url, directory);
    if (fork && upstreamRemoteName) {
      await setUpstream(upstreamRemoteName, upstreamUrl, directory);
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
    } else {
      console.error(error);
    };
  }


}