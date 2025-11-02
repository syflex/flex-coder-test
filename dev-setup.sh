#!/bin/bash

# dev-setup.sh
# This script automates the setup of the development environment for the flex-coder-test project.
# It should be run from the root directory of the cloned repository.

# Exit immediately if a command exits with a non-zero status.
set -e

# --- Configuration ---
PROJECT_NAME="flex-coder-test"
NODE_VERSION_MIN="16" # Minimum recommended Node.js major version
NPM_REQUIRED="true"   # Set to "true" if the project uses npm for dependencies

# --- Helper Functions for Logging ---

# Logs an informational message in blue.
log_info() {
    echo -e "\e[34m[INFO]\e[0m $1"
}

# Logs a success message in green.
log_success() {
    echo -e "\e[32m[SUCCESS]\e[0m $1"
}

# Logs a warning message in yellow.
log_warn() {
    echo -e "\e[33m[WARN]\e[0m $1"
}

# Logs an error message in red and exits the script.
log_error() {
    echo -e "\e[31m[ERROR]\e[0m $1" >&2
    exit 1
}

# --- Validation Functions ---

# Checks if a given command is installed and available in the PATH.
# Arguments:
#   $1 - The command name (e.g., "git", "node")
check_command() {
    log_info "Checking for $1..."
    if ! command -v "$1" &> /dev/null; then
        log_error "$1 is not installed. Please install $1 and try again."
    fi
    log_success "Found $1: $(command -v "$1")"
}

# Checks if the installed Node.js version meets the minimum requirement.
check_node_version() {
    if [ "$NPM_REQUIRED" = "true" ]; then
        log_info "Checking Node.js version..."
        if ! command -v node &> /dev/null; then
            log_error "Node.js is not installed. Please install Node.js (v$NODE_VERSION_MIN or higher) and try again."
        fi

        CURRENT_NODE_VERSION=$(node -v | sed 's/v//')
        log_info "Detected Node.js version: $CURRENT_NODE_VERSION"

        # Extract major version for comparison
        MAJOR_CURRENT=$(echo $CURRENT_NODE_VERSION | cut -d. -f1)
        MAJOR_MIN=$(echo $NODE_VERSION_MIN | cut -d. -f1)

        if [ "$MAJOR_CURRENT" -lt "$MAJOR_MIN" ]; then
            log_error "Node.js version v$CURRENT_NODE_VERSION is too old. Please upgrade to v$NODE_VERSION_MIN or higher."
        fi
        log_success "Node.js version is compatible (v$CURRENT_NODE_VERSION >= v$NODE_VERSION_MIN)."
    fi
}

# --- Main Setup Logic ---

main() {
    log_info "Starting development environment setup for '$PROJECT_NAME'..."
    echo ""

    # 1. Verify that the script is run from within a Git repository.
    log_info "Verifying Git repository status..."
    if ! git rev-parse --is-inside-work-tree &> /dev/null; then
        log_error "This script must be run from within the '$PROJECT_NAME' Git repository. Please clone the repository first, then 'cd $PROJECT_NAME'."
    fi
    log_success "Current directory is a Git repository."
    echo ""

    # 2. Check for essential development tools.
    log_info "Checking for required development tools..."
    check_command "git"
    if [ "$NPM_REQUIRED" = "true" ]; then
        check_command "node"
        check_node_version
        check_command "npm"
    fi
    log_success "All required tools are installed."
    echo ""

    # 3. Install Node.js dependencies if a package.json file exists.
    if [ -f "package.json" ]; then
        log_info "package.json found. Installing Node.js dependencies using npm..."
        npm install
        log_success "Node.js dependencies installed successfully."
    else
        log_warn "No package.json found. Skipping npm dependency installation."
    fi
    echo ""

    # 4. (Optional) Run initial build or tests if scripts exist in package.json.
    if [ "$NPM_REQUIRED" = "true" ] && [ -f "package.json" ]; then
        log_info "Performing initial project checks (build/test)..."
        # Check if 'build' script exists and run it
        if grep -q '"build":' package.json; then
            log_info "Running initial build command (npm run build)..."
            if ! npm run build; then
                log_warn "Initial build failed. Please investigate any errors. Continuing setup."
            else
                log_success "Initial build completed."
            fi
        fi
        # Check if 'test' script exists and run it
        if grep -q '"test":' package.json; then
            log_info "Running initial test command (npm test)..."
            if ! npm test; then
                log_warn "Initial tests failed. Please investigate any errors. Continuing setup."
            else
                log_success "Initial tests completed."
            fi
        fi
    fi
    echo ""

    # 5. Final instructions for the developer.
    log_success "Development environment setup complete for '$PROJECT_NAME'!"
    log_info "You are now ready to start modifying the code."
    log_info "Refer to the README.md for more details on project-specific development commands (e.g., 'npm start', 'npm test')."
    echo ""
}

# Execute the main function.
main
