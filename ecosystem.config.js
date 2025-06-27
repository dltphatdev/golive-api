module.exports = {
  apps: [
    {
      name: 'golive-api',
      script: 'npm',
      args: 'run start',
      env: {
        NODE_ENV: 'production',
        PORT: 9000
      }
    }
  ]
}
