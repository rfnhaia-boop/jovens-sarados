module.exports = {
  apps: [
    {
      name: "js-web",
      cwd: "./apps/web",
      script: "node_modules/.bin/next",
      args: "start -p 3020",
      env: {
        NODE_ENV: "production",
        NEXT_PUBLIC_SITE_URL: "https://js.newflowsys.cloud",
        NEXT_PUBLIC_API_URL: "https://js.newflowsys.cloud/api",
      },
    },
    {
      name: "js-api",
      cwd: "./apps/api",
      script: "dist/server.js",
      env: {
        NODE_ENV: "production",
        PORT: 3021,
        DATABASE_URL: "postgresql://js_user:JS_SENHA_FORTE@localhost:5432/jovens_sarados",
      },
    },
  ],
};
