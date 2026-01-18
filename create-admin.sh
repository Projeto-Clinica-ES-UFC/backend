#!/bin/bash

# Create admin user via Better Auth sign-up
curl -v -X POST http://127.0.0.1:3000/api/auth/sign-up/email \
  -H "Content-Type: application/json" \
  -H "Origin: http://localhost:3000" \
  -d '{
    "email": "admin@clinica.com",
    "password": "clinicaadmin",
    "name": "Administrador"
  }'

echo "Update on drizzle studio the role to Administrador."
