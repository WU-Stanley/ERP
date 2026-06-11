export const environment = {
  production: true,
  // When deploying with Nginx reverse proxy, use relative path to avoid CORS entirely.
  // Nginx proxies /api/* -> backend:8080/*
  apiUrl: '/api',
  microsoftAuth: {
    tenantId: 'c9a98a3d-152f-4eb3-b93f-9b26fdd08495',
    clientId: '70af7756-8489-4407-8265-15907d28fa81',
   
    redirectUri: 'https://erp.uat.wigweuniversity.edu.ng/auth/microsoft-callback',
  },
};
