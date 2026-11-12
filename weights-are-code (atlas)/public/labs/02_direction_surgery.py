# lab/02_direction_surgery.py : remove one direction from an MLP output matrix
import numpy as np
rng = np.random.default_rng(0)
d_model, d_ff = 16, 64
W = rng.normal(size=(d_model, d_ff))
u = rng.normal(size=d_model); u /= np.linalg.norm(u)
W_full = W - np.outer(u, u @ W)                       # (I - u u^T) W
print("max |u^T W'| =", np.abs(u @ W_full).max())      # ~ 1e-16
k = 8; cols = np.argsort(-np.abs(u @ W))[:k]            # sparse variant: edit only k columns
W_sp = W.copy(); W_sp[:, cols] -= np.outer(u, u @ W[:, cols])
print(f"edited {k}/{d_ff} columns; remaining u-energy {np.linalg.norm(u @ W_sp) / np.linalg.norm(u @ W):.2f}")  # ~0.74
