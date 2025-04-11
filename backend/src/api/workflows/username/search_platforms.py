# builtin
import subprocess
import os
from typing import List

# internal

# external
import asyncio

async def search_username(username: str) -> List[str]:

    try:
        process = await asyncio.create_subprocess_exec(
            "sherlock", username, "--print-found",
            stdout=asyncio.subprocess.PIPE,
            stderr=asyncio.subprocess.PIPE
        )

        stdout, stderr = await process.communicate()

        output = stdout.decode()
        errors = stderr.decode()

        found_sites = []
        for line in output.splitlines():
            if line.startswith("[+]"):
                parts = line.split(": ", 1)
                if len(parts) == 2:
                    url = parts[1].strip()
                    found_sites.append(url)

        return found_sites

    except asyncio.TimeoutError:
        return ["Sherlock proc timed out"]

    except Exception as e:
        return [f"Error: {e}"]
