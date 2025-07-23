# Cloudflare Tunnel Setup for Local Express Development

## 1. Prerequisites
- You must have [cloudflared](https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/install-and-setup/installation/) installed and authenticated with your Cloudflare account.
- Your domain (e.g., `hubnest.live`) must be managed by Cloudflare.
- Your backend Express server should be running locally on port 3000.

```bash
# Check the version of cloudflared
cloudflared --version
```

---

## 2. Step-by-Step Setup

### A. Authenticate with Cloudflare
If you haven’t already:
```bash
cloudflared login
```
This will open a browser window to authenticate and select your domain.

---

### B. Create a Tunnel
```bash
cloudflared tunnel create hubnest-tunnel
```
- This creates a named tunnel and outputs a tunnel ID and credentials file.
- The credentials file is usually stored in `~/.cloudflared/`.

---

### C. Route DNS to the Tunnel
```bash
cloudflared tunnel route dns hubnest-tunnel tenant1.hubnest.live
```
- This creates a CNAME DNS record for `tenant1.hubnest.live` pointing to your tunnel.
- You can repeat this for other subdomains/tenants as needed.

---

### D. Run the Tunnel and Route Traffic
```bash
cloudflared tunnel run --url http://localhost:3000 hubnest-tunnel
```
- This command starts the tunnel and forwards all traffic from `tenant1.hubnest.live` to your local Express server on port 3000.

---

## 3. What to Look Out For

- **Express Server:**  
  Make sure your Express server is running on the same port you specify in the tunnel command (`3000` in this example).

- **Subdomain Routing:**  
  Your Express middleware should extract the subdomain from the `Host` header to determine the tenant (as you already do).

- **Cloudflare DNS:**  
  The DNS record for `tenant1.hubnest.live` must be managed by Cloudflare and set up as a CNAME to the tunnel.

- **Firewall/Network:**  
  Ensure your local machine allows inbound connections on the specified port.

- **Multiple Tenants:**  
  You can add more subdomains by repeating the `cloudflared tunnel route dns` step for each one.

---

## 4. Troubleshooting

- **Tunnel Not Connecting:**  
  - Check that your Express server is running and accessible at `http://localhost:3000`.
  - Ensure the tunnel name matches in all commands.
  - Check for typos in subdomain or tunnel names.

- **DNS Propagation:**  
  - DNS changes may take a few minutes to propagate.
  - Use `dig tenant1.hubnest.live` to verify the CNAME points to your tunnel.

- **Cloudflare Authentication:**  
  - If you see authentication errors, re-run `cloudflared login`.

---

## 5. Summary Table

| Step            | Command                                                        | Description                                 |
|-----------------|----------------------------------------------------------------|---------------------------------------------|
| Authenticate    | `cloudflared login`                                            | Log in to Cloudflare and select your domain |
| Create Tunnel   | `cloudflared tunnel create hubnest-tunnel`                     | Create a named tunnel                       |
| Route DNS       | `cloudflared tunnel route dns hubnest-tunnel tenant1.hubnest.live` | Point subdomain to tunnel                   |
| Run Tunnel      | `cloudflared tunnel run --url http://localhost:3000 hubnest-tunnel` | Forward traffic to local Express server     |

---

## 6. For Your Team: Quick Reference

- **Start your Express server:**  
  `node src/server.js` (or your preferred start command)
- **Start the tunnel:**  
  `cloudflared tunnel run --url http://localhost:3000 hubnest-tunnel`
- **Test:**  
  Visit `https://tenant1.hubnest.live` in your browser. Your local Express app should respond.
