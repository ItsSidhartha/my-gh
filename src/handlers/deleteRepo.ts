import { DeleteRepoOptions } from "../models.ts";
import { fetchWithAuth, getOwnerAndName } from "../utils.ts";

const confirmDelete = (owner: string, repo: string) => {
  const deleteText = `${owner}/${repo}`;
  const userInput = prompt(`Write '${deleteText}' to confirm deletion: `);
  return userInput === deleteText;
}

export const deleteRepo = async (repository: string, options: DeleteRepoOptions) => {
  try {
    const [owner, repo] = getOwnerAndName(repository);
    const isPermitted = options.yes || confirmDelete(owner, repo);
    if (isPermitted) {
      const url = `https://api.github.com/repos/${owner}/${repo}`;
      console.log(`Deleting repository '${owner}/${repo}'...`);
      await fetchWithAuth(
        url,
        {
          method: "DELETE",
        },
        {
          "Accept": "application/vnd.github+json",
          "X-GitHub-Api-Version": "2022-11-28",
        });
      console.log(`Repository '${owner}/${repo}' deleted successfully.`);
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
    } else {
      console.error(error);
    };
  }
} 