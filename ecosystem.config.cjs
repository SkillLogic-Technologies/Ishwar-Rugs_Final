module.exports = {
  apps: [
    {
      name: "ishwar-rugs-backend",
      script: "server/index.js",
      cwd: "/var/www/ishwar-rugs",
      interpreter: "node",
      env: {
        NODE_ENV: "production",
        PORT: 5000,
        HOST: "0.0.0.0"
      },
      restart_delay: 3000,
      max_restarts: 10,
      watch: false,
    },
  ],
};
