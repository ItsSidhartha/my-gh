import { createRepoOptions } from "../models.ts";

export const createRepo = async (name: string, options: createRepoOptions) => {
  const { private: isPrivate, public: isPublic, "add-readme": autoInit, description } = options;
  if (isPrivate && isPublic) throw new Error("Cannot specify both public and private");
  const privateFlag = isPrivate || !isPublic;
  const request = new Request(`https://api.github.com/user/repos`, {
    method: "POST",
    headers: {
      "Authorization": `token ${Deno.env.get("MY_GH_CLI_PAT")}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name,
      private: privateFlag,
      description,
      auto_init: autoInit,
    }),
  });

  try {
    const response = await fetch(request);
    if (!response.ok) {
      throw new Error(`Failed to create repository: ${response.statusText}`);
    }

    const data = await response.json();
    console.log(`Repository '${data.name}' created successfully at ${data.html_url}`);
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
    } else {
      console.error(error);
    };
  }
}