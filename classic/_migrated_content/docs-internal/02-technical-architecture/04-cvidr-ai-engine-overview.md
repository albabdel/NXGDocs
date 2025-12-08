---
title: "CVIDR AI Engine Overview"
sidebar_label: "CVIDR AI Engine Overview"
tags: ["internal", "architecture", "ai", "cvidr", "analytics"]
---

# CVIDR AI Engine Overview

The NXGEN system runs on a Kubernetes cluster.
Development Environment: The development environment is separate from production, running on a separate VPC with minimal nodes (2 to 3 nodes).
Autoscaling (HPA): The primary scaling mechanism is Horizontal Pod Autoscaling (HPA), which scales horizontally by adding nodes, rather than Vertical Pod Scaling, which risks service interruption during node upgrades/downgrades.
Autoscaling is crucial for resource-consumable services.
Examples requiring autoscaling include the CVIDR (AI engine) which detects events and processes images, and also streaming services, Adpro proxy, and event services.
The scaling threshold is set at 75% CPU utilization. This threshold is chosen to ensure a new node can be initialized and start accepting calls (a 2-3 minute process) before the existing pod reaches 100% utilization.
Deployment Workflow (Example: API):
The base image is a Node.js-based image.
package.json is copied, and npm install runs to install modules.
All code is copied from Git to the container.
npm run start is executed to run the code.
The container is built (first stage).
The second stage involves pushing the image to the Docker registry, with a shell script handling tagging parameters (version, commit, branch).
