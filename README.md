# Poisoned Packages Demo Site

This is a simple web application used to simulate downloading an unknown dependency through npm.

## Prerequisite

- Docker Desktop
- Git

## Quick Start

1. Clone repo
2. cd poisoned_packages_demo
3. Install the poisoned package with `npm install @rmejia32/malicious_package_demo`
4. Run the stack with `docker compose up -d`
5. Wait until docker desktop has log of localhost:3000 being started.
6. [Visit http://localhost:3000](http://localhost:3000)
7. Stop everything with `docker compose down`
