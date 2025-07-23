const axios = require('axios');

// Helper: Fetch Zone ID for your domain
async function getZoneId(domain, apiToken) {
    const response = await axios.get('https://api.cloudflare.com/client/v4/zones', {
        headers: { Authorization: `Bearer ${apiToken}` }
    });
    const zone = response.data.result.find(z => z.name === domain);
    if (!zone) throw new Error('Zone not found');
    return zone.id;
}

// Function to create subdomain dynamically
async function createSubdomain(tenantSubdomain) {
    const apiToken = process.env.CLOUDFLARE_API_TOKEN;
    const domain = 'hubnest.live';
    const zoneId = await getZoneId(domain, apiToken);

    const record = {
        type: 'CNAME',
        name: tenantSubdomain, // e.g., "tenant2"
        content: domain, // Points to root domain
        proxied: true, // Enable Cloudflare proxy (for SSL)
        ttl: 1, // Auto TTL
    };

    await axios.post(`https://api.cloudflare.com/client/v4/zones/${zoneId}/dns_records`, record, {
        headers: { Authorization: `Bearer ${apiToken}` }
    });
    console.info(`Subdomain ${tenantSubdomain}.hubnest.live created!`);
}

module.exports = { createSubdomain }; 