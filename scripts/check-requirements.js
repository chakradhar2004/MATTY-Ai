#!/usr/bin/env node

/**
 * Matty AI Design Tool - Requirements Checker
 * This script checks if all system requirements are met
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Color codes for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function checkNodeVersion() {
  try {
    const nodeVersion = process.version;
    const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);
    
    if (majorVersion >= 16) {
      log(`✅ Node.js: ${nodeVersion}`, 'green');
      return true;
    } else {
      log(`❌ Node.js: ${nodeVersion} (Required: >=16.0.0)`, 'red');
      return false;
    }
  } catch (error) {
    log(`❌ Node.js: Not found`, 'red');
    return false;
  }
}

function checkNpmVersion() {
  try {
    const npmVersion = execSync('npm --version', { encoding: 'utf8' }).trim();
    const majorVersion = parseInt(npmVersion.split('.')[0]);
    
    if (majorVersion >= 8) {
      log(`✅ npm: ${npmVersion}`, 'green');
      return true;
    } else {
      log(`❌ npm: ${npmVersion} (Required: >=8.0.0)`, 'red');
      return false;
    }
  } catch (error) {
    log(`❌ npm: Not found`, 'red');
    return false;
  }
}

function checkMongoDB() {
  try {
    execSync('mongod --version', { encoding: 'utf8' });
    log(`✅ MongoDB: Installed locally`, 'green');
    return true;
  } catch (error) {
    log(`⚠️  MongoDB: Not found locally (You can use MongoDB Atlas instead)`, 'yellow');
    return false;
  }
}

function checkGit() {
  try {
    const gitVersion = execSync('git --version', { encoding: 'utf8' }).trim();
    log(`✅ Git: ${gitVersion}`, 'green');
    return true;
  } catch (error) {
    log(`❌ Git: Not found`, 'red');
    return false;
  }
}

function checkEnvironmentFile() {
  const envPath = path.join(__dirname, '../server/.env');
  const envExamplePath = path.join(__dirname, '../server/env.example');
  
  if (fs.existsSync(envPath)) {
    log(`✅ Environment file: Found`, 'green');
    return true;
  } else if (fs.existsSync(envExamplePath)) {
    log(`⚠️  Environment file: Not found (Copy from env.example)`, 'yellow');
    return false;
  } else {
    log(`❌ Environment file: Not found`, 'red');
    return false;
  }
}

function checkPackageFiles() {
  const rootPackage = path.join(__dirname, '../package.json');
  const serverPackage = path.join(__dirname, '../server/package.json');
  const clientPackage = path.join(__dirname, '../client/package.json');
  
  const checks = [
    { path: rootPackage, name: 'Root package.json' },
    { path: serverPackage, name: 'Server package.json' },
    { path: clientPackage, name: 'Client package.json' }
  ];
  
  let allFound = true;
  
  checks.forEach(check => {
    if (fs.existsSync(check.path)) {
      log(`✅ ${check.name}: Found`, 'green');
    } else {
      log(`❌ ${check.name}: Not found`, 'red');
      allFound = false;
    }
  });
  
  return allFound;
}

function checkDependencies() {
  const serverNodeModules = path.join(__dirname, '../server/node_modules');
  const clientNodeModules = path.join(__dirname, '../client/node_modules');
  
  const checks = [
    { path: serverNodeModules, name: 'Server dependencies' },
    { path: clientNodeModules, name: 'Client dependencies' }
  ];
  
  let allInstalled = true;
  
  checks.forEach(check => {
    if (fs.existsSync(check.path)) {
      log(`✅ ${check.name}: Installed`, 'green');
    } else {
      log(`⚠️  ${check.name}: Not installed (Run: npm run install-all)`, 'yellow');
      allInstalled = false;
    }
  });
  
  return allInstalled;
}

function checkPorts() {
  const ports = [3000, 5000];
  let portsAvailable = true;
  
  ports.forEach(port => {
    try {
      execSync(`netstat -an | grep :${port}`, { encoding: 'utf8' });
      log(`⚠️  Port ${port}: In use`, 'yellow');
      portsAvailable = false;
    } catch (error) {
      log(`✅ Port ${port}: Available`, 'green');
    }
  });
  
  return portsAvailable;
}

function displaySetupInstructions() {
  log('\n📋 Setup Instructions:', 'cyan');
  log('1. Install dependencies: npm run install-all', 'blue');
  log('2. Set up environment: cp server/env.example server/.env', 'blue');
  log('3. Edit server/.env with your credentials', 'blue');
  log('4. Start development: npm run dev', 'blue');
  log('\n🔗 External Services Required:', 'cyan');
  log('• MongoDB Atlas: https://www.mongodb.com/atlas', 'blue');
  log('• Cloudinary: https://cloudinary.com/', 'blue');
  log('\n📚 Documentation: README.md', 'cyan');
}

function main() {
  log('🔍 Matty AI Design Tool - Requirements Checker', 'bright');
  log('================================================', 'bright');
  
  const checks = [
    { name: 'Node.js Version', check: checkNodeVersion },
    { name: 'npm Version', check: checkNpmVersion },
    { name: 'MongoDB', check: checkMongoDB },
    { name: 'Git', check: checkGit },
    { name: 'Environment File', check: checkEnvironmentFile },
    { name: 'Package Files', check: checkPackageFiles },
    { name: 'Dependencies', check: checkDependencies },
    { name: 'Ports', check: checkPorts }
  ];
  
  let passed = 0;
  let total = checks.length;
  
  checks.forEach(({ name, check }) => {
    log(`\n🔍 Checking ${name}...`, 'blue');
    if (check()) {
      passed++;
    }
  });
  
  log('\n📊 Summary:', 'cyan');
  log(`Passed: ${passed}/${total}`, passed === total ? 'green' : 'yellow');
  
  if (passed === total) {
    log('\n🎉 All requirements met! You can start development.', 'green');
    log('Run: npm run dev', 'blue');
  } else {
    log('\n⚠️  Some requirements are missing. Please fix them before starting.', 'yellow');
    displaySetupInstructions();
  }
  
  log('\n📚 For detailed requirements, see: requirements.md', 'cyan');
}

// Run the checker
main();
