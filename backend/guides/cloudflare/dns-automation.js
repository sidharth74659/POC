const Cloudflare = require('cloudflare');
const axios = require('axios');

const cf = new Cloudflare({
    token: process.env.CLOUDFLARE_API_TOKEN,
});

// Helper: Fetch Zone ID for your domain
async function getZoneId(domain) {
    const zones = await cf.zones.list();
    const zone = zones.result.find(z => z.name === domain);
    if (!zone) throw new Error('Zone not found');
    return zone.id;
}

// Function to create subdomain dynamically
async function createSubdomain(tenantSubdomain) {
    const zoneId = await getZoneId('hubnest.live'); // Get your zone ID

    const record = {
        type: 'CNAME',
        name: tenantSubdomain, // e.g., "tenant2"
        content: 'hubnest.live', // Points to root domain
        proxied: true, // Enable Cloudflare proxy (for SSL)
        ttl: 1, // Auto TTL
    };

    await cf.dnsRecords.add(zoneId, record);
    console.log(`Subdomain ${tenantSubdomain}.hubnest.live created!`);
}

module.exports = { createSubdomain }; 