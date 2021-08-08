module.exports = class SlashCommands {
  constructor(client, options) {
    this.client = client;
    this.name = options.name;
    this.usage = options.usage || 'No Usage';
    this.description = options.description || 'N/A';
    this.enabled = options.enabled || true;
    this.permissions = options.permissions || [];
  }
};