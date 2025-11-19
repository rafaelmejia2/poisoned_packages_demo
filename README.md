# Poisoned Packages Demo Site

This is a simple web application used to simulate downloading an malicious dependency through npm.
**This is for testing purposes only and for learning, please don't use for malicious activity!**

## Prerequisite

- Docker Desktop
- Git

## Quick Start

1. Clone repo
2. cd poisoned_packages_demo
3. Run the stack with `docker compose up -d`
4. Install the malicious package with `docker compose exec app npm install @rmejia32/malicious_package_demo`.
5. Check to see if snooper is enabled with `curl -X POST http://localhost:3000/demo/enable-snoop`.
6. Wait until docker desktop has log of localhost:3000 being started.
7. [Visit http://localhost:3000](http://localhost:3000)
8. After logging in, check docker logs to confirm that snooper was enabled and session information was stolen with `docker compose logs -f app`.
9. Disable snooper with `curl -X POST http://localhost:3000/demo/disable-snoop`.
10. Stop everything with `docker compose down -v`.
