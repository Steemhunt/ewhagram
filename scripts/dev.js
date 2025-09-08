import { execSync, spawn } from "child_process";
import dotenv from "dotenv";
import { createServer } from "net";
import path from "path";
import { fileURLToPath } from "url";

// Load environment variables
dotenv.config({ path: ".env.local" });

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(path.normalize(path.join(__dirname, "..")));

let ngrokProcess;
let nextDev;
let isCleaningUp = false;

// Parse command line arguments for port
const args = process.argv.slice(2);
let port = 3000; // default port

// Look for --port=XXXX, --port XXXX, -p=XXXX, or -p XXXX
args.forEach((arg, index) => {
  if (arg.startsWith("--port=")) {
    port = parseInt(arg.split("=")[1]);
  } else if (arg === "--port" && args[index + 1]) {
    port = parseInt(args[index + 1]);
  } else if (arg.startsWith("-p=")) {
    port = parseInt(arg.split("=")[1]);
  } else if (arg === "-p" && args[index + 1]) {
    port = parseInt(args[index + 1]);
  }
});

async function checkPort(port) {
  return new Promise((resolve) => {
    const server = createServer();

    server.once("error", () => {
      resolve(true); // Port is in use
    });

    server.once("listening", () => {
      server.close();
      resolve(false); // Port is free
    });

    server.listen(port);
  });
}

async function killProcessOnPort(port) {
  try {
    if (process.platform === "win32") {
      // Windows: Use netstat to find the process
      const netstat = spawn("netstat", ["-ano", "|", "findstr", `:${port}`]);
      netstat.stdout.on("data", (data) => {
        const match = data.toString().match(/\s+(\d+)$/);
        if (match) {
          const pid = match[1];
          spawn("taskkill", ["/F", "/PID", pid]);
        }
      });
      await new Promise((resolve) => netstat.on("close", resolve));
    } else {
      // Unix-like systems: Use lsof
      const lsof = spawn("lsof", ["-ti", `:${port}`]);
      lsof.stdout.on("data", (data) => {
        data
          .toString()
          .split("\n")
          .forEach((pid) => {
            if (pid) {
              try {
                process.kill(parseInt(pid), "SIGKILL");
              } catch (e) {
                if (e.code !== "ESRCH") throw e;
              }
            }
          });
      });
      await new Promise((resolve) => lsof.on("close", resolve));
    }
  } catch (e) {
    // Ignore errors if no process found
  }
}

function checkNgrokInstalled() {
  try {
    execSync("ngrok version", { stdio: "ignore" });
    return true;
  } catch (error) {
    return false;
  }
}

function installNgrok() {
  console.log("📦 Installing ngrok...");
  try {
    if (process.platform === "darwin") {
      // macOS - try brew first, fallback to npm
      try {
        execSync("brew install ngrok", { stdio: "inherit" });
      } catch (error) {
        console.log("Homebrew not available, installing via npm...");
        execSync("npm install -g ngrok", { stdio: "inherit" });
      }
    } else if (process.platform === "win32") {
      // Windows - use npm
      execSync("npm install -g ngrok", { stdio: "inherit" });
    } else {
      // Linux - use npm
      execSync("npm install -g ngrok", { stdio: "inherit" });
    }
    console.log("✅ ngrok installed successfully");
    return true;
  } catch (error) {
    console.error("❌ Failed to install ngrok:", error.message);
    return false;
  }
}

async function startNgrokTunnel(port) {
  return new Promise((resolve, reject) => {
    console.log("🌐 Starting ngrok tunnel...");

    ngrokProcess = spawn("ngrok", ["http", port.toString()], {
      stdio: ["ignore", "pipe", "pipe"],
    });

    let tunnelUrl = null;
    let dataBuffer = "";

    ngrokProcess.stdout.on("data", (data) => {
      dataBuffer += data.toString();

      // Look for the tunnel URL in the output
      const urlMatch = dataBuffer.match(
        /https:\/\/[a-z0-9-]+\.ngrok-free\.app/
      );
      if (urlMatch && !tunnelUrl) {
        tunnelUrl = urlMatch[0];
        resolve(tunnelUrl);
      }
    });

    ngrokProcess.stderr.on("data", (data) => {
      const output = data.toString();
      console.log("ngrok:", output);

      // Also check stderr for URL (sometimes ngrok outputs there)
      const urlMatch = output.match(/https:\/\/[a-z0-9-]+\.ngrok-free\.app/);
      if (urlMatch && !tunnelUrl) {
        tunnelUrl = urlMatch[0];
        resolve(tunnelUrl);
      }
    });

    ngrokProcess.on("error", (error) => {
      reject(error);
    });

    ngrokProcess.on("close", (code) => {
      if (code !== 0 && !tunnelUrl) {
        reject(new Error(`ngrok process exited with code ${code}`));
      }
    });

    // Timeout after 10 seconds if no URL is found
    setTimeout(() => {
      if (!tunnelUrl) {
        reject(new Error("Timeout waiting for ngrok tunnel URL"));
      }
    }, 10000);
  });
}

async function startDev() {
  // Check if the specified port is already in use
  const isPortInUse = await checkPort(port);
  if (isPortInUse) {
    console.error(
      `Port ${port} is already in use. To find and kill the process using this port:\n\n` +
        (process.platform === "win32"
          ? `1. Run: netstat -ano | findstr :${port}\n` +
            "2. Note the PID (Process ID) from the output\n" +
            "3. Run: taskkill /PID <PID> /F\n"
          : `On macOS/Linux, run:\nnpm run cleanup\n`) +
        "\nThen try running this command again."
    );
    process.exit(1);
  }

  const useTunnel = process.env.USE_TUNNEL === "true";
  let miniAppUrl;

  if (useTunnel) {
    // Check if ngrok is installed
    if (!checkNgrokInstalled()) {
      console.log("ngrok is not installed. Installing now...");
      const installed = installNgrok();
      if (!installed) {
        console.error(
          "Failed to install ngrok. Please install it manually and try again."
        );
        process.exit(1);
      }
    }

    try {
      // Start ngrok tunnel and get URL
      miniAppUrl = await startNgrokTunnel(port);

      console.log(`
🌐 ngrok tunnel URL: ${miniAppUrl}

💻 To test on desktop:
   1. Open the ngrok URL in your browser: ${miniAppUrl}
   2. Your mini app should load in the browser
   3. Navigate to the Warpcast Mini App Developer Tools: https://warpcast.com/~/developers
   4. Enter your mini app URL: ${miniAppUrl}
   5. Click "Preview" to launch your mini app within Warpcast (note that it may take ~10 seconds to load)

📱 To test in Warpcast mobile app:
   1. Open Warpcast on your phone
   2. Go to Settings > Developer > Mini Apps
   3. Enter this URL: ${miniAppUrl}
   4. Click "Preview" (note that it may take ~10 seconds to load)
`);
    } catch (error) {
      console.error("Failed to start ngrok tunnel:", error.message);
      console.log("Falling back to localhost...");
      miniAppUrl = `http://localhost:${port}`;
    }
  } else {
    miniAppUrl = `http://localhost:${port}`;
    console.log(`
💻 To test your mini app:
   1. Open the Warpcast Mini App Developer Tools: https://warpcast.com/~/developers
   2. Scroll down to the "Preview Mini App" tool
   3. Enter this URL: ${miniAppUrl}
   4. Click "Preview" to test your mini app (note that it may take ~5 seconds to load the first time)
`);
  }

  // Start next dev with appropriate configuration
  const nextBin = path.normalize(
    path.join(projectRoot, "node_modules", ".bin", "next")
  );

  nextDev = spawn(nextBin, ["dev", "-p", port.toString()], {
    stdio: "inherit",
    env: {
      ...process.env,
      NEXT_PUBLIC_URL: miniAppUrl,
      NEXTAUTH_URL: miniAppUrl,
    },
    cwd: projectRoot,
    shell: process.platform === "win32", // Add shell option for Windows
  });

  // Handle cleanup
  const cleanup = async () => {
    if (isCleaningUp) return;
    isCleaningUp = true;

    console.log("\n\nShutting down...");

    try {
      if (nextDev) {
        try {
          // Kill the main process first
          nextDev.kill("SIGKILL");
          // Then kill any remaining child processes in the group
          if (nextDev?.pid) {
            try {
              process.kill(-nextDev.pid);
            } catch (e) {
              // Ignore ESRCH errors when killing process group
              if (e.code !== "ESRCH") throw e;
            }
          }
          console.log("🛑 Next.js dev server stopped");
        } catch (e) {
          // Ignore errors when killing nextDev
          console.log("Note: Next.js process already terminated");
        }
      }

      if (ngrokProcess) {
        try {
          ngrokProcess.kill("SIGKILL");
          console.log("🌐 ngrok tunnel closed");
        } catch (e) {
          console.log("Note: ngrok process already terminated");
        }
      }

      // Force kill any remaining processes on the specified port
      await killProcessOnPort(port);
    } catch (error) {
      console.error("Error during cleanup:", error);
    } finally {
      process.exit(0);
    }
  };

  // Handle process termination
  process.on("SIGINT", cleanup);
  process.on("SIGTERM", cleanup);
  process.on("exit", cleanup);
  if (ngrokProcess) {
    ngrokProcess.on("close", cleanup);
  }
}

startDev().catch(console.error);
