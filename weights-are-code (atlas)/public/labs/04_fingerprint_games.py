# lab/04_fingerprint_games.py - recompute the Exp. 1 weight fingerprints from the authors' released prompt files
import numpy as np, urllib.request

BASE = "https://raw.githubusercontent.com/RikiyaT/lm_understand-logs/refs/heads/main/exp1_which_game/runs/{}/prompt.txt"
games = ["breakout", "pong", "pacman", "freeway"]

print("Recomputing Exp 1 Atari weight fingerprints from released CSAIL logs...\n")
for game in games:
    url = BASE.format(game)
    lines = urllib.request.urlopen(url, timeout=15).read().decode().split("\n")
    i = next(k for k, l in enumerate(lines) if l.startswith("W1 (layer 1 weights)"))
    W1 = np.array([[float(x) for x in lines[i + 1 + r].split()] for r in range(500)])   # 500 inputs x 32 units
    agent = np.linalg.norm(W1, axis=1).reshape(10, 10, 5)[:, :, 0]                      # channel 0 = the agent
    rows, cols = agent.sum(1), agent.sum(0)
    print(f"{game:9s} strongest row {rows.argmax()} ({rows.max()/rows.sum():.0%})   strongest column {cols.argmax()} ({cols.max()/cols.sum():.0%})")

