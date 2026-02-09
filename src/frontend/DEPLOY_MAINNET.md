# IC Mainnet Deployment Guide

This guide walks you through deploying the QA Management application to the Internet Computer mainnet.

## Prerequisites

1. **DFX CLI installed** (version 0.12.0 or later)
   ```bash
   dfx --version
   ```

2. **Cycles wallet** with sufficient cycles for deployment
   - Check your wallet balance:
   ```bash
   dfx wallet balance --network ic
   ```
   - You'll need cycles to deploy and run canisters on mainnet

3. **Internet Identity** (optional, for authentication)

## Quick Deploy (Automated)

The easiest way to deploy is using the automated publish script:

