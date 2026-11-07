# lab/03_blast_radius.py : sparsity arithmetic (paper-reported numbers)
edited, total = 131_072, 0.8e9
print(f"{edited/total:.4%}")                           # 0.0164%  (paper rounds to 0.016%)
print(2*64*1024)                                       # 131072 = 2 layers x 64 columns x 1024 (hidden size = inference, VERIFY)
