import { createRepoOptions } from "../models.ts";
import { fetchWithAuth } from "../utils.ts";

export const createRepo = async (name: string, options: createRepoOptions) => {
  const { private: isPrivate, public: isPublic, "add-readme": autoInit, description } = options;
  if (isPrivate && isPublic) throw new Error("Cannot specify both public and private");
  const privateFlag = isPrivate || !isPublic;

  try {
    const url = `https://api.github.com/user/repos`;
    const body = JSON.stringify({
      name,
      private: privateFlag,
      description,
      auto_init: autoInit,
    });

    const data = await fetchWithAuth(url, { method: "POST", body, });
    
    console.log(`Repository '${data.name}' created successfully at ${data.html_url}`);
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
    } else {
      console.error(error);
    };
  }
}