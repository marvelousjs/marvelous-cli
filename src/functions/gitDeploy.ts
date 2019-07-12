import { exec } from 'child_process';

export const gitDeploy = (cwd: string) => {
  return new Promise((resolve) => {
    // create new daemon process
    const branch = process.env.BRANCH;
    if (branch !== 'staging' && branch !== 'production') {
      throw new Error('BRANCH must be one of the following: staging, production');
    }
    exec(
      `git checkout -b ${branch} ; git checkout ${branch} ; git merge master ; git push origin ${branch} ; git checkout master`,
      { cwd },
      (result, res) => {
        console.log(res);
        resolve();
      }
    );
  });
};
