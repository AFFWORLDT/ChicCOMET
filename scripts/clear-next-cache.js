const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const projectRoot = process.cwd();

const directoriesToClear = [
  path.join(projectRoot, '.next'),
  path.join(projectRoot, 'node_modules', '.cache'),
];

console.log('Clearing Next.js build cache...');

directoriesToClear.forEach(dir => {
  if (fs.existsSync(dir)) {
    try {
      console.log(`Deleting: ${dir}`);
      
      // Try using fs.rmSync first (Node 14.14+)
      try {
        fs.rmSync(dir, { recursive: true, force: true, maxRetries: 3, retryDelay: 100 });
        console.log(`✓ Cleared: ${dir}`);
      } catch (fsError) {
        // If fs.rmSync fails, try using OS command
        console.log(`  fs.rmSync failed, trying OS command...`);
        const isWindows = process.platform === 'win32';
        if (isWindows) {
          // Windows: use rmdir /s /q
          execSync(`rmdir /s /q "${dir}"`, { stdio: 'ignore' });
        } else {
          // Unix: use rm -rf
          execSync(`rm -rf "${dir}"`, { stdio: 'ignore' });
        }
        console.log(`✓ Cleared: ${dir} (using OS command)`);
      }
    } catch (error) {
      console.error(`✗ Failed to delete ${dir}:`, error.message);
      console.log(`  Note: Make sure the dev server is stopped before clearing cache.`);
    }
  } else {
    console.log(`Directory not found, skipping: ${dir}`);
  }
});

console.log('Cache clearing process finished.');

