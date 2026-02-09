#!/usr/bin/env node

/**
 * Mainnet Publish and Record Script
 * 
 * Automates the IC mainnet deployment process:
 * 1. Validates and normalizes the app/domain name
 * 2. Deploys to IC mainnet using dfx
 * 3. Retrieves deployed canister IDs
 * 4. Records deployment artifacts in DEPLOYMENT_LINKS.md
 * 5. Outputs the public URL
 * 
 * Usage:
 *   node scripts/publishMainnetAndRecord.js [app-name]
 * 
 * If app-name is not provided, uses "qa-management-app" as default.
 */

const { execSync } = require('child_process');
const path = require('path');
const { validateAndNormalize } = require('./domainName');

/**
 * Execute a shell command and return output
 * @param {string} command - Command to execute
 * @param {boolean} silent - Whether to suppress output
 * @returns {string} - Command output
 */
function exec(command, silent = false) {
  try {
    const output = execSync(command, {
      encoding: 'utf8',
      stdio: silent ? 'pipe' : 'inherit'
    });
    return output ? output.trim() : '';
  } catch (error) {
    if (!silent) {
      console.error(`❌ Command failed: ${command}`);
      console.error(error.message);
    }
    throw error;
  }
}

/**
 * Get canister ID from dfx
 * @param {string} canisterName - Name of the canister
 * @returns {string} - Canister ID
 */
function getCanisterId(canisterName) {
  try {
    const output = exec(`dfx canister id ${canisterName} --network ic`, true);
    return output.trim();
  } catch (error) {
    console.error(`❌ Failed to get ${canisterName} canister ID`);
    throw error;
  }
}

/**
 * Main deployment flow
 */
async function main() {
  console.log('🚀 IC Mainnet Publish Flow\n');
  console.log('═'.repeat(60));
  console.log('');

  // Step 1: Validate app name
  const rawAppName = process.argv[2] || 'qa-management-app';
  console.log('📝 Step 1: Validating app name...');
  console.log(`   Input: "${rawAppName}"`);
  
  const validation = validateAndNormalize(rawAppName);
  
  if (!validation.valid) {
    console.error('');
    console.error('❌ Invalid app name');
    console.error('');
    console.error('Error:', validation.error);
    if (validation.normalized && validation.normalized !== rawAppName) {
      console.error('Normalized to:', validation.normalized);
    }
    console.error('');
    console.error('Domain name requirements:');
    console.error('  • Must be between 5 and 50 characters');
    console.error('  • Can only contain letters, numbers, and hyphens');
    console.error('  • Cannot start or end with a hyphen');
    console.error('');
    console.error('Example valid name:', validation.example);
    console.error('');
    console.error('Usage:');
    console.error('  node scripts/publishMainnetAndRecord.js "your-app-name"');
    process.exit(1);
  }

  const appName = validation.normalized;
  console.log(`   ✅ Valid: "${appName}"`);
  console.log('');

  // Step 2: Deploy to mainnet
  console.log('📦 Step 2: Deploying to IC mainnet...');
  console.log('   This may take several minutes...');
  console.log('');
  
  try {
    exec('dfx deploy --network ic');
    console.log('');
    console.log('   ✅ Deployment successful');
  } catch (error) {
    console.error('');
    console.error('❌ Deployment failed');
    console.error('');
    console.error('Common issues:');
    console.error('  • Insufficient cycles in wallet');
    console.error('  • Network connectivity problems');
    console.error('  • DFX not properly configured');
    console.error('');
    console.error('Check your wallet balance:');
    console.error('  dfx wallet balance --network ic');
    process.exit(1);
  }
  console.log('');

  // Step 3: Retrieve canister IDs
  console.log('🔍 Step 3: Retrieving canister IDs...');
  
  let frontendId, backendId;
  try {
    frontendId = getCanisterId('frontend');
    backendId = getCanisterId('backend');
    console.log(`   Frontend: ${frontendId}`);
    console.log(`   Backend:  ${backendId}`);
    console.log('   ✅ Canister IDs retrieved');
  } catch (error) {
    console.error('');
    console.error('❌ Failed to retrieve canister IDs');
    console.error('');
    console.error('You can manually retrieve them with:');
    console.error('  dfx canister id frontend --network ic');
    console.error('  dfx canister id backend --network ic');
    process.exit(1);
  }
  console.log('');

  // Step 4: Record deployment artifacts
  console.log('📝 Step 4: Recording deployment artifacts...');
  
  try {
    const recordScript = path.join(__dirname, 'recordDeploymentArtifact.js');
    exec(`node ${recordScript} --frontend ${frontendId} --backend ${backendId}`, true);
    console.log('   ✅ Deployment artifacts recorded');
  } catch (error) {
    console.error('   ⚠️  Warning: Failed to record deployment artifacts');
    console.error('   You can manually record them with:');
    console.error(`     node scripts/recordDeploymentArtifact.js --frontend ${frontendId} --backend ${backendId}`);
  }
  console.log('');

  // Step 5: Output public URL
  const publicUrl = `https://${frontendId}.icp0.io`;
  
  console.log('═'.repeat(60));
  console.log('');
  console.log('🎉 Deployment Complete!');
  console.log('');
  console.log('🌐 Public URL:');
  console.log(`   ${publicUrl}`);
  console.log('');
  console.log('📋 Canister IDs:');
  console.log(`   Frontend: ${frontendId}`);
  console.log(`   Backend:  ${backendId}`);
  console.log('');
  console.log('📄 Full deployment info saved to:');
  console.log('   frontend/DEPLOYMENT_LINKS.md');
  console.log('');
  console.log('═'.repeat(60));
}

// Run main function
main().catch(error => {
  console.error('');
  console.error('❌ Unexpected error:', error.message);
  process.exit(1);
});
