export const killPid = async (pid: number) => {
  return new Promise(resolve => {
    console.log(`Killing pid ${pid}...`);
    const timer = setInterval(() => {
      try {
        process.kill(pid);
      } catch (error) {
        if (error.code !== 'ESRCH') {
          return;
        }
        clearInterval(timer);
        resolve();
      }
    }, 100);
  });
};
