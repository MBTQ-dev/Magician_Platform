import os
import subprocess
import json

REQUIRED_STRUCTURE = {
    "orchestration": [
        "base_magician.py",
        "router.py"
    ],
    "resources/models": [],
    "resources/services": [],
    "lifecycle": [],
    "api": [],
    "config": ["settings.py"],
    "tests": []
}

MAGICIANS = ["job", "business", "developer"]

# Add magician-specific required files
for m in MAGICIANS:
    REQUIRED_STRUCTURE["orchestration"].append(f"{m}_magician.py")
    REQUIRED_STRUCTURE["lifecycle"].append(f"vacuum_{m}_data.py")
    REQUIRED_STRUCTURE["lifecycle"].append(f"retrain_{m}.py")
    REQUIRED_STRUCTURE["api"].append(f"routes_{m}.py")
    REQUIRED_STRUCTURE["tests"].append(f"test_{m}_api.py")
    REQUIRED_STRUCTURE["tests"].append(f"test_{m}_magician.py")

AUTO_FIX = False  # Set to True to auto-create missing files

def run(cmd):
    return subprocess.check_output(cmd, shell=True).decode().strip()

def check_branch(branch):
    print(f"\n=== Checking branch: {branch} ===")
    run(f"git checkout {branch}")

    missing = []

    for folder, files in REQUIRED_STRUCTURE.items():
        if not os.path.exists(folder):
            missing.append(f"Missing folder: {folder}")
            if AUTO_FIX:
                os.makedirs(folder, exist_ok=True)
            continue

        for f in files:
            path = os.path.join(folder, f)
            if not os.path.exists(path):
                missing.append(f"Missing file: {path}")
                if AUTO_FIX:
                    with open(path, "w") as fp:
                        fp.write(f"# Auto-generated placeholder for {f}\n")

    return missing

def main():
    branches = run("git branch -a").split("\n")
    branches = [b.replace("*", "").strip() for b in branches if "remotes" not in b]

    report = {}

    for branch in branches:
        if branch:
            missing = check_branch(branch)
            report[branch] = missing

    print("\n\n=== FINAL REPORT ===")
    print(json.dumps(report, indent=2))

if __name__ == "__main__":
    main()

  "devDependencies": {
    "eslint": "^8.56.0",
    "mocha": "^10.2.0",
    "chai": "^4.3.10"
  },
  "engines": {
    "node": ">=18"
  }
}
