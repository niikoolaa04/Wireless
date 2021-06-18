module.exports = class Command {
  constructor(client, options) {
    this.client = client;
    this.name = options.name;
    this.usage = options.usage || 'Nema korišćenja';
    this.description = options.description || 'N/A';
    this.aliases = options.aliases || 'N/A';
    this.enabled = options.enabled || true;
    this.permissions = options.permissions || [];
    this.listed = options.listed || false;
    this.category = options.category || "member";
  }
};