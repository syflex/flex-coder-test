#!/bin/bash
# dev-setup.sh

# This script automates the setup of the development environment for the flex-coder-test project.
# It ensures necessary tools are available and project dependencies are installed.

# Exit immediately if a command exits with a non-zero status.
set -e

# --- Configuration ---
# Minimum recommended Node.js major version (e.g., "16" for v16 or higher)
REQUIRED_NODE_MAJOR_VERSION="16"
# Minimum recommended npm major version. npm usually comes with Node.js.
# A common minimum for modern Node.js is around 8 (with Node 16+).
REQUIRED_NPM_MAJOR_VERSION="8"

# --- Utility Functions ---

# Function to check if a command exists
command_exists() {
  command -v "$1" >/dev/null 2>&1
}

# Function to check the major version of a tool
check_tool_major_version() {
  local tool_name="$1"
  local version_command="$2"
  local required_major="$3"

  if ! command_exists "$tool_name"; then
    echo "Error: '$tool_name' is not installed. Please install it to proceed." >&2
    exit 1
  fi

  local current_version_output
  current_version_output=$($version_command 2>/dev/null)

  # Extract major version number. Handle 'v16.x.x' or '8.x.x' formats.
  local current_major_version
  current_major_version=$(echo "$current_version_output" | sed -E 's/^v?([0-9]+)\..*/\1/')

  if [ -z "$current_major_version" ]; then
    echo "Error: Could not determine major version for $tool_name from output: '$current_version_output'." >&2
    echo "Please ensure $tool_name is installed correctly and its version is parseable." >&2
    exit 1
  fi

  if (( current_major_version < required_major )); then
    echo "Error: Installed $tool_name version is $current_major_version.x, but version $required_major or higher is required." >&2
    echo "Please update $tool_name to proceed." >&2
    exit 1
  else
    echo "✔ $tool_name (v$current_major_version.x) check passed."
  fi
}


# --- Main Setup Steps ---

echo "--- Starting Development Environment Setup for flex-coder-test ---"
echo "This script will: "
echo "1. Verify Node.js and npm are installed with required versions."
echo "2. Install project dependencies from package.json."
echo ""

# 1. Check for Node.js and npm
echo "Checking Node.js and npm versions..."
check_tool_major_version "node" "node --version" ${REQUIRED_NODE_MAJOR_VERSION}
check_tool_major_version "npm" "npm --version" ${REQUIRED_NPM_MAJOR_VERSION}

# 2. Install Node.js dependencies
echo ""
echo "Installing Node.js dependencies using npm..."
if [ -f "package.json" ]; then
  npm install
  echo "✔ Node.js dependencies installed successfully."
else
  echo "Warning: No 'package.json' file found in the current directory."
  echo "Skipping 'npm install'. If this is a Node.js project, please ensure 'package.json' is present."
fi

# 3. Placeholder for additional setup (e.g., build steps, testing)
# If your project requires additional steps like compiling TypeScript, running a build script,
# or running initial tests, you can add them here.
# Example:
# echo ""
# echo "Running project build script (if any)..."
# if npm run build -- --dry-run >/dev/null 2>&1; then # Check if build script exists without running it
#   npm run build
#   echo "✔ Project build completed successfully."
# else
#   echo "No 'build' script found in package.json, or it failed validation."
#   echo "Skipping build step."
# fi

echo ""
echo "--- Development Environment Setup Complete! ---"
echo "You are now ready to start modifying the 'flex-coder-test' project."
echo "To run your application or tests, refer to the project's 'package.json' scripts."
echo "------------------------------------------------"
