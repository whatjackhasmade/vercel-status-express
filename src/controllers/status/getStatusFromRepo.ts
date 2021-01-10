import fetch from "node-fetch";
import path from "path";

// Type definitions
import type { Request, Response } from "express";

// Common
import { cache } from "vercel-status";
import { logger } from "vercel-status";

declare type DeployStatus = "error" | "failure" | "inactive" | "in_progress" | "pending" | "queued" | "success";

const getStatus = async ({ headers, url }): Promise<DeployStatus> => {
  const res = await fetch(url, { headers });
  const data = await res.json();
  const latest = data?.[0];
  const state = latest.state;
  return state;
};

const SECONDS_CACHED = Number(process.env.SECONDS_CACHED) || 10;

const getStatusFromRepo = async (req: Request, res: Response): Promise<void> => {
  const repo: string = req.params.repo;
  const username: string = req.params.username;

  // This should be set in your .ENV file
  const GITHUB_TOKEN = process.env.GITHUB_TOKEN || "";

  // Using headers means we get an increase in the amount of requests we can make to Github
  const headers = { Authorization: `token ${GITHUB_TOKEN}` };

  // Build the repository deployments URL from the parameters in the URL
  const repoDeployments = `https://api.github.com/repos/${username}/${repo}/deployments`;
  const key = repoDeployments;

  // If you don't have a token set, you might want to
  if (!GITHUB_TOKEN)
    console.warn("You can increase your request rate by adding a GITHUB_TOKEN to your enviromental variables");

  try {
    // Tell the browser we are returning an SVG file
    res.setHeader("Content-Type", "image/svg+xml");

    const cachedStatus: { status: DeployStatus } | undefined = cache.get(key);

    let status: DeployStatus | undefined = undefined;
    if (cachedStatus) status = cachedStatus?.status;

    if (!cachedStatus) {
      // Get an array of all the deployments Vercel has attempted for this repository
      const allDeploymentsRes = await fetch(repoDeployments, { headers });
      const allDeploymentsData = await allDeploymentsRes.json();

      // Get the latest deployment from the list of all deployments
      const latestDeployment = allDeploymentsData?.[0];

      // Get the URL with the detailed status object
      const url: string = latestDeployment.statuses_url;

      // Get the status of the latest deployment
      status = await getStatus({ headers, url });
    }

    const value = { status };

    console.log({ status });

    switch (status) {
      case "error": {
        if (!cachedStatus) cache.set(key, value, SECONDS_CACHED);
        res.sendFile(path.join(__dirname + "../../../views/failure.html"));
        break;
      }

      case "failure": {
        if (!cachedStatus) cache.set(key, value, SECONDS_CACHED);
        res.sendFile(path.join(__dirname + "../../../views/failure.html"));
        break;
      }

      case "in_progress": {
        if (!cachedStatus) cache.set(key, value, SECONDS_CACHED);
        res.sendFile(path.join(__dirname + "../../../views/pending.html"));
        break;
      }

      case "pending": {
        if (!cachedStatus) cache.set(key, value, SECONDS_CACHED);
        res.sendFile(path.join(__dirname + "../../../views/pending.html"));
        break;
      }

      case "queued": {
        if (!cachedStatus) cache.set(key, value, SECONDS_CACHED);
        res.sendFile(path.join(__dirname + "../../../views/pending.html"));
        break;
      }

      case "inactive": {
        if (!cachedStatus) cache.set(key, value, SECONDS_CACHED);
        res.sendFile(path.join(__dirname + "../../../views/success.html"));
        break;
      }

      case "success": {
        if (!cachedStatus) cache.set(key, value, SECONDS_CACHED);
        res.sendFile(path.join(__dirname + "../../../views/success.html"));
        break;
      }

      default: {
        if (!cachedStatus) cache.set(key, value, SECONDS_CACHED);
        res.sendFile(path.join(__dirname + "../../../views/success.html"));
        break;
      }
    }
  } catch (error) {
    logger.error(error.message);
    res.status(500);
    res.json({ error: error.message });
  }
};

export { getStatusFromRepo };
export default getStatusFromRepo;
