const getDefaultOwner = () => {
  return "ItsSidhartha";
};

export const getOwnerAndName = (repo: string) => {
  if (!repo.includes("/")) {
    return [getDefaultOwner(), repo];
  }

  return repo.split("/");
}

export const fetchRepoInfo = async (repository: string) => {
  const [owner, name] = getOwnerAndName(repository);
  return await fetchWithAuth(`https://api.github.com/repos/${owner}/${name}`);
}


export const runShellCommand = async (command: Deno.Command) => {
  const { success, code, stderr, stdout } = await command.output();

  if (!success) {
    const errorText = new TextDecoder().decode(stderr).trim();
    throw new Error(`Command failed (exit code ${code}): ${errorText}`);
  }

  const outputText = new TextDecoder().decode(stdout).trim();
  if (outputText) {
    console.log(outputText);
  }
};

export const fetchRequest = async (request: Request) => {
  const response = await fetch(request);
  if (!response.ok) {
    throw new Error(`Failed to fetch request: ${response.statusText}`);
  }
  const contentType = response.headers.get("content-type");
  const isJson = contentType && contentType.includes("application/json");

  return isJson ? await response.json() : null;
};

export const fetchWithAuth = async (url: string, additionOptions: Record<string, string> = {}, additionalHeaders: Record<string, string> = {}) => {
  const headers = {
    "Authorization": `token ${Deno.env.get("MY_GH_CLI_PAT")}`,
    "Content-Type": "application/json",
    ...additionalHeaders,
  };

  const request = new Request(url, {
    method: "GET",
    headers,
    ...additionOptions,
  });

  return await fetchRequest(request);
}
