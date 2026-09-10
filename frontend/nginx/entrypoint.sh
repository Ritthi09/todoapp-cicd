#!/bin/sh
set -e

# runtime-config.js สำหรับ set API_URL ตอน docker run (ไม่ต้อง rebuild)
if [ -n "${VITE_API_URL}" ]; then
  cat > /usr/share/nginx/html/runtime-config.js <<EOF
window.__RUNTIME_CONFIG__ = { API_URL: "${VITE_API_URL}" };
EOF
else
  rm -f /usr/share/nginx/html/runtime-config.js || true
fi

exec "$@"
