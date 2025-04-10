module.exports = {
  apps: [
    {
      name: 'flyclim',
      script: 'node_modules/next/dist/bin/next',
      args: 'start',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
        MONGODB_URI: "mongodb+srv://davide:!!!Sasha2015!!!Eliana2019!!!@flyclimweb.qj1barl.mongodb.net/?retryWrites=true&w=majority&appName=flyclimWeb&ssl=true",
        NEXTAUTH_URL: "https://www.flyclim.com",
        NEXTAUTH_SECRET: "drc2023",
        OPENAI_API_KEY: "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",
        LINKEDIN_CLIENT_ID: "78llc9qkg3ol4k",
        LINKEDIN_ACCESS_TOKEN: "WPL_AP1.5K51FwdZtbkaj3c7.U7kmxQ==",
        LINKEDIN_ORGANIZATION_ID: "https://www.linkedin.com/company/flyclim/",
        LINKEDIN_REDIRECT_URI: "https://www.flyclim.com/api/linkedin/callback",
        NEXT_PUBLIC_BASE_URL: "https://www.flyclim.com",

      }
    }
  ]
};
