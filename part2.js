const http = require("http");
const fs = require("fs");
const path = require("path");

const USERS_FILE = path.join(__dirname, "users.json");

// Helpers: all data is read from / written to users.json (no in-memory arrays)
function readUsers() {
  if (!fs.existsSync(USERS_FILE)) return [];
  const raw = fs.readFileSync(USERS_FILE, "utf-8");
  return raw.trim() ? JSON.parse(raw) : [];
}

function writeUsers(users) {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

function send(res, status, data) {
  res.writeHead(status, { "Content-Type": "application/json" });
  res.end(JSON.stringify(data));
}

function getBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => (body += chunk));
    req.on("end", () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (err) {
        reject(err);
      }
    });
    req.on("error", reject);
  });
}

const server = http.createServer(async (req, res) => {
  const { method } = req;
  const parts = req.url.split("?")[0].split("/").filter(Boolean); // ["user", "1"]

  if (parts[0] !== "user" || parts.length > 2) {
    return send(res, 404, { message: "Route not found." });
  }

  const id = parts[1] !== undefined ? Number(parts[1]) : null;

  try {
    /* 1) POST /user -> add a new user (email must be unique) */
    if (method === "POST" && id === null) {
      const { name, age, email } = await getBody(req);
      if (!name || age === undefined || !email) {
        return send(res, 400, { message: "name, age and email are required." });
      }
      const users = readUsers();
      if (users.some((u) => u.email === email)) {
        return send(res, 409, { message: "Email already exists." });
      }
      const newId = users.length ? Math.max(...users.map((u) => u.id)) + 1 : 1;
      users.push({ id: newId, name, age, email });
      writeUsers(users);
      return send(res, 201, { message: "User added successfully." });
    }

    /* 2) PATCH /user/:id -> update name, age or email */
    if (method === "PATCH" && id !== null) {
      const body = await getBody(req);
      const users = readUsers();
      const user = users.find((u) => u.id === id);
      if (!user) return send(res, 404, { message: "User ID not found." });

      if (body.email && users.some((u) => u.email === body.email && u.id !== id)) {
        return send(res, 409, { message: "Email already exists." });
      }

      const updated = [];
      for (const field of ["name", "age", "email"]) {
        if (body[field] !== undefined) {
          user[field] = body[field];
          updated.push(field);
        }
      }
      if (!updated.length) {
        return send(res, 400, { message: "Provide name, age or email to update." });
      }
      writeUsers(users);
      return send(res, 200, {
        message: `User ${updated.join(", ")} updated successfully.`,
      });
    }

    /* 3) DELETE /user/:id -> delete a user */
    if (method === "DELETE" && id !== null) {
      const users = readUsers();
      const index = users.findIndex((u) => u.id === id);
      if (index === -1) return send(res, 404, { message: "User ID not found." });
      users.splice(index, 1);
      writeUsers(users);
      return send(res, 200, { message: "User deleted successfully." });
    }

    /* 4) GET /user -> get all users */
    if (method === "GET" && id === null) {
      return send(res, 200, readUsers());
    }

    /* 5) GET /user/:id -> get user by id */
    if (method === "GET" && id !== null) {
      const user = readUsers().find((u) => u.id === id);
      if (!user) return send(res, 404, { message: "User not found." });
      return send(res, 200, user);
    }

    return send(res, 405, { message: "Method not allowed." });
  } catch (err) {
    return send(res, 400, { message: "Invalid JSON body." });
  }
});

server.listen(3000, () => console.log("Server running on http://localhost:3000"));