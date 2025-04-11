# builtin
import subprocess
import os
from typing import List

# internal
from src.globals.environment import Environment

# external


async def search_username(username: str) -> List[str]:

    try:
        result = subprocess.run(
            ["sherlock", username, "--print-found"],
            stdout = subprocess.PIPE,
            stderr = subprocss.PIPE,
            text = True,
            timeout = 60
        )
        output = result.stdout

        found_sites = []
        for line in output.splitlines():
            if line.startswith("[+]"):
                found_sites.append(line)

        return found_sites

    except subprocess.TimeoutExpired:
        return ["Sherlock proc timed out"]

    except Exception as e:
        return [f"Error: {e}"]