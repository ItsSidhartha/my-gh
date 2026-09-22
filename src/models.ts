export interface createRepoOptions {
  private?: boolean;
  public?: boolean;
  "add-readme"?: boolean;
  description?: string;
}


export interface CloneRepoOptions {
  noUpstream?: boolean;
  upstreamRemoteName?: string;
}
