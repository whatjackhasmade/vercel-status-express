import fetch from "node-fetch";
import path from "path";

// Type definitions
import type { Request, Response } from "express";

// Common
import { logger } from "vercel-status";

const getStatus = async ({ headers, url }): Promise<"pending" | "success"> => {
  const res = await fetch(url, { headers });
  const data = await res.json();
  const latest = data?.[0];
  const state = latest.state;
  return state;
};

const getStatusFromRepo = async (req: Request, res: Response): Promise<void> => {
  const username: string = req.params.username;
  const repo: string = req.params.repo;

  const GITHUB_TOKEN = process.env.GITHUB_TOKEN || "";
  const headers = {
    Authorization: `token ${GITHUB_TOKEN}`,
  };

  const url = `https://api.github.com/repos/${username}/${repo}/deployments`;

  try {
    const allDeploymentsRes = await fetch(url, {
      headers,
    });
    const allDeploymentsData = await allDeploymentsRes.json();

    const latestDeployment = allDeploymentsData?.[0];
    const latestDeploymentStatusURL = latestDeployment.statuses_url;

    const status = await getStatus({ headers, url: latestDeploymentStatusURL });

    console.log(status);

    switch (status) {
      case "pending": {
        res.sendFile(path.join(__dirname + "../../../views/pending.html"));
        break;
      }

      case "success": {
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
