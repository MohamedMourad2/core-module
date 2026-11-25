const path = require("path");
const fs = require("fs");
const os = require("os");
const zlib = require("zlib");
const EventEmitter = require("events");
const { pipeline } = require("stream/promises");

/* 1. Write a function that logs the current file path and directory.
   Output Example: {File: "/home/user/project/index.js", Dir: "/home/user/project"} */
function logFileInfo() {
  const info = { File: __filename, Dir: __dirname };
  console.log(info);
  return info;
}

/* 2. Write a function that takes a file path and returns its file name.
   Input Example: /user/files/report.pdf
   Output Example: "report.pdf" */
function getFileName(filePath) {
  return path.basename(filePath);
}

/* 3. Write a function that builds a path from an object
   Input Example: { dir: "/folder", name: "app", ext: ".js" }
   Output Example: "/folder/app.js" */
function buildPath(obj) {
  return path.format(obj);
}

/* 4. Write a function that returns the file extension from a given file path.
   Input Example: /docs/readme.md
   Output Example: ".md" */
function getExtension(filePath) {
  return path.extname(filePath);
}

/* 5. Write a function that parses a given path and returns its name and ext.
   Input Example: /home/app/main.js
   Output Example: { Name: "main", Ext: ".js" } */
function parsePath(filePath) {
  const { name, ext } = path.parse(filePath);
  return { Name: name, Ext: ext };
}

/* 6. Write a function that checks whether a given path is absolute.
   Input Example: /home/user/file.txt
   Output Example: true */
function isAbsolutePath(filePath) {
  return path.isAbsolute(filePath);
}

/* 7. Write a function that joins multiple segments
   Input: "src", "components", "App.js"
   Output Example: src/components/App.js */
function joinSegments(...segments) {
  return path.join(...segments);
}

/* 8. Write a function that resolves a relative path to an absolute one.
   Input Example: ./index.js
   Output Example: /home/user/project/src/index.js */
function resolveToAbsolute(relativePath) {
  return path.resolve(relativePath);
}

/* 9. Write a function that joins two paths.
   Input Example: /folder1, folder2/file.txt
   Output Example: /folder1/folder2/file.txt */
function joinTwoPaths(path1, path2) {
  return path.join(path1, path2);
}

/* 10. Write a function that deletes a file asynchronously.
   Input Example: /path/to/file.txt
   Output Example: The file.txt is deleted. */
async function deleteFileAsync(filePath) {
  await fs.promises.unlink(filePath);
  const message = `The ${path.basename(filePath)} is deleted.`;
  console.log(message);
  return message;
}

/* 11. Write a function that creates a folder synchronously.
   Output Example: "Success" */
function createFolderSync(folderPath) {
  fs.mkdirSync(folderPath, { recursive: true });
  console.log("Success");
  return "Success";
}

/* 12. Create an event emitter that listens for a "start" event and logs a welcome message.
   Output Example: Welcome event triggered! */
const emitter = new EventEmitter();
emitter.on("start", () => {
  console.log("Welcome event triggered!");
});

/* 13. Emit a custom "login" event with a username parameter.
   Input Example: "Ahmed"
   Output Example: "User logged in: Ahmed" */
emitter.on("login", (username) => {
  console.log(`User logged in: ${username}`);
});

/* 14. Read a file synchronously and log its contents.
   Input Example: "./notes.txt"
   Output Example: the file content => "This is a note." */
function readFileSyncAndLog(filePath) {
  const content = fs.readFileSync(filePath, "utf-8");
  console.log(`the file content => "${content}"`);
  return content;
}

/* 15. Write asynchronously to a file.
   Input: path: "./async.txt", content: "Async save" */
async function writeFileAsync(filePath, content) {
  await fs.promises.writeFile(filePath, content);
  console.log("File written successfully");
}

/* 16. Check if a directory exists.
   Input Example: "./notes.txt"
   Output Example: true */
function directoryExists(dirPath) {
  return fs.existsSync(dirPath);
}

/* 17. Write a function that returns the OS platform and CPU architecture.
   Output Example: {Platform: "win32", Arch: "x64"} */
function getOSInfo() {
  return { Platform: os.platform(), Arch: os.arch() };
}

/* 18. Use a readable stream to read a file in chunks and log each chunk.
   Input Example: "./big.txt"
   Output Example: log each chunk */
function readInChunks(filePath) {
  return new Promise((resolve, reject) => {
    const readable = fs.createReadStream(filePath, {
      encoding: "utf-8",
      highWaterMark: 16, // small chunk size so we can see multiple chunks
    });
    readable.on("data", (chunk) => console.log("Chunk:", chunk));
    readable.on("end", resolve);
    readable.on("error", reject);
  });
}

/* 19. Use readable and writable streams to copy content from one file to another.
   Input Example: "./source.txt", "./dest.txt"
   Output Example: File copied using streams */
function copyWithStreams(source, dest) {
  return new Promise((resolve, reject) => {
    const readable = fs.createReadStream(source);
    const writable = fs.createWriteStream(dest);
    readable.pipe(writable);
    writable.on("finish", () => {
      console.log("File copied using streams");
      resolve();
    });
    readable.on("error", reject);
    writable.on("error", reject);
  });
}

/* 20. Create a pipeline that reads a file, compresses it, and writes it to another file.
   Input Example: "./data.txt", "./data.txt.gz" */
async function compressFile(source, dest) {
  await pipeline(
    fs.createReadStream(source),
    zlib.createGzip(),
    fs.createWriteStream(dest)
  );
  console.log("File compressed successfully");
}

async function main() {
  console.log("--- 1 ---");
  logFileInfo();
  console.log("--- 2 ---");
  console.log(getFileName("/user/files/report.pdf"));
  console.log("--- 3 ---");
  console.log(buildPath({ dir: "/folder", name: "app", ext: ".js" }));
  console.log("--- 4 ---");
  console.log(getExtension("/docs/readme.md"));
  console.log("--- 5 ---");
  console.log(parsePath("/home/app/main.js"));
  console.log("--- 6 ---");
  console.log(isAbsolutePath("/home/user/file.txt"));
  console.log("--- 7 ---");
  console.log(joinSegments("src", "components", "App.js"));
  console.log("--- 8 ---");
  console.log(resolveToAbsolute("./index.js"));
  console.log("--- 9 ---");
  console.log(joinTwoPaths("/folder1", "folder2/file.txt"));

  console.log("--- 10 ---");
  fs.writeFileSync("./file.txt", "temp");
  await deleteFileAsync("./file.txt");

  console.log("--- 11 ---");
  createFolderSync("./myFolder");

  console.log("--- 12 ---");
  emitter.emit("start");

  console.log("--- 13 ---");
  emitter.emit("login", "Ahmed");

  console.log("--- 14 ---");
  fs.writeFileSync("./notes.txt", "This is a note.");
  readFileSyncAndLog("./notes.txt");

  console.log("--- 15 ---");
  await writeFileAsync("./async.txt", "Async save");

  console.log("--- 16 ---");
  console.log(directoryExists("./notes.txt"));

  console.log("--- 17 ---");
  console.log(getOSInfo());

  console.log("--- 18 ---");
  fs.writeFileSync("./big.txt", "This is a big file with some text inside it.");
  await readInChunks("./big.txt");

  console.log("--- 19 ---");
  fs.writeFileSync("./source.txt", "Content to copy");
  await copyWithStreams("./source.txt", "./dest.txt");

  console.log("--- 20 ---");
  fs.writeFileSync("./data.txt", "Data to compress");
  await compressFile("./data.txt", "./data.txt.gz");
}

main().catch(console.error);