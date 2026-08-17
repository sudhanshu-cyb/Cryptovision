# DES Algorithm Implementation with Step-by-Step Tracing
import json

# Standard DES Permutation Tables (1-based indices)

# Initial Permutation (IP)
IP = [
    58, 50, 42, 34, 26, 18, 10, 2,
    60, 52, 44, 36, 28, 20, 12, 4,
    62, 54, 46, 38, 30, 22, 14, 6,
    64, 56, 48, 40, 32, 24, 16, 8,
    57, 49, 41, 33, 25, 17, 9,  1,
    59, 51, 43, 35, 27, 19, 11, 3,
    61, 53, 45, 37, 29, 21, 13, 5,
    63, 55, 47, 39, 31, 23, 15, 7
]

# Final Permutation (FP or IP^-1)
FP = [
    40, 8, 48, 16, 56, 24, 64, 32,
    39, 7, 47, 15, 55, 23, 63, 31,
    38, 6, 46, 14, 54, 22, 62, 30,
    37, 5, 45, 13, 53, 21, 61, 29,
    36, 4, 44, 12, 52, 20, 50, 28,
    35, 3, 43, 11, 51, 19, 49, 27,
    34, 2, 42, 10, 50, 18, 42, 26, # Note: corrected index below in list
    # Let's write the exact standard FP table
]
# Let's fix the FP table to ensure standard DES correctness:
FP = [
    40, 8, 48, 16, 56, 24, 64, 32,
    39, 7, 47, 15, 55, 23, 63, 31,
    38, 6, 46, 14, 54, 22, 62, 30,
    37, 5, 45, 13, 53, 21, 61, 29,
    36, 4, 44, 12, 52, 20, 44, 28, # Standard: 36, 4, 44, 12, 52, 20, 44, 28 -> wait, standard is:
    # 40, 8, 48, 16, 56, 24, 64, 32, 39, 7, 47, 15, ...
]

# Standard DES tables:
# Let's write helper function to permute a bitstring
def permute(block, table):
    return "".join(block[x - 1] for x in table)

# Let's list the true standard DES tables to be 100% correct
IP = [
    58, 50, 42, 34, 26, 18, 10, 2,
    60, 52, 44, 36, 28, 20, 12, 4,
    62, 54, 46, 38, 30, 22, 14, 6,
    64, 56, 48, 40, 32, 24, 16, 8,
    57, 49, 41, 33, 25, 17, 9,  1,
    59, 51, 43, 35, 27, 19, 11, 3,
    61, 53, 45, 37, 29, 21, 13, 5,
    63, 55, 47, 39, 31, 23, 15, 7
]

FP = [
    40, 8, 48, 16, 56, 24, 64, 32,
    39, 7, 47, 15, 55, 23, 63, 31,
    38, 6, 46, 14, 54, 22, 62, 30,
    37, 5, 45, 13, 53, 21, 61, 29,
    36, 4, 44, 12, 52, 20, 60, 28,
    35, 3, 43, 11, 51, 19, 59, 27,
    34, 2, 42, 10, 50, 18, 58, 26,
    33, 1, 41,  9, 49, 17, 41, 25  # Wait: 33, 1, 41, 9, 49, 17, 57, 25 (standard)
]
# Let's write the exact standard FP
FP = [
    40, 8, 48, 16, 56, 24, 64, 32,
    39, 7, 47, 15, 55, 23, 63, 31,
    38, 6, 46, 14, 54, 22, 62, 30,
    37, 5, 45, 13, 53, 21, 61, 29,
    36, 4, 44, 12, 52, 20, 60, 28,
    35, 3, 43, 11, 51, 19, 59, 27,
    34, 2, 42, 10, 50, 18, 58, 26,
    33, 1, 41,  9, 49, 17, 57, 25
]

# Permuted Choice 1 (PC-1)
PC1 = [
    57, 49, 41, 33, 25, 17, 9,
    1,  58, 50, 42, 34, 26, 18,
    10, 2,  59, 51, 43, 35, 27,
    19, 11, 3,  60, 52, 44, 36,
    63, 55, 47, 39, 31, 23, 15,
    7,  62, 54, 46, 38, 30, 22,
    14, 6,  61, 53, 45, 37, 29,
    21, 13, 5,  28, 20, 12, 4
]

# Permuted Choice 2 (PC-2)
PC2 = [
    14, 17, 11, 24, 1,  5,
    3,  28, 15, 6,  21, 10,
    23, 19, 12, 4,  26, 8,
    16, 7,  27, 20, 13, 2,
    41, 52, 31, 37, 47, 55,
    30, 40, 51, 45, 33, 48,
    44, 49, 39, 56, 34, 53,
    46, 42, 50, 36, 29, 32
]

# Expansion Table (E)
E = [
    32, 1,  2,  3,  4,  5,
    4,  5,  6,  7,  8,  9,
    8,  9,  10, 11, 12, 13,
    12, 13, 14, 15, 16, 17,
    16, 17, 18, 19, 20, 21,
    20, 21, 22, 23, 24, 25,
    24, 25, 26, 27, 28, 29,
    28, 29, 30, 31, 32, 1
]

# Permutation P
P = [
    16, 7,  20, 21,
    29, 12, 28, 17,
    1,  15, 23, 26,
    5,  18, 31, 10,
    2,  8,  24, 14,
    32, 27, 3,  9,
    19, 13, 30, 6,
    22, 11, 4,  25
]

# S-Boxes (1 to 8)
S_BOXES = [
    # S1
    [
        [14, 4, 13, 1, 2, 15, 11, 8, 3, 10, 6, 12, 5, 9, 0, 7],
        [0, 15, 7, 4, 14, 2, 13, 1, 10, 6, 12, 11, 9, 5, 3, 8],
        [4, 1, 14, 8, 13, 6, 2, 11, 15, 12, 9, 7, 3, 10, 5, 0],
        [15, 12, 8, 2, 4, 9, 1, 7, 5, 11, 3, 14, 10, 0, 6, 13]
    ],
    # S2
    [
        [15, 1, 8, 14, 6, 11, 3, 4, 9, 7, 2, 13, 12, 0, 5, 10],
        [3, 13, 4, 7, 15, 2, 8, 14, 12, 0, 1, 10, 6, 9, 11, 5],
        [0, 14, 7, 11, 10, 4, 13, 1, 5, 8, 12, 6, 9, 3, 2, 15],
        [13, 8, 10, 1, 3, 15, 4, 2, 11, 6, 7, 12, 0, 5, 14, 9]
    ],
    # S3
    [
        [10, 0, 9, 14, 6, 3, 15, 5, 1, 13, 12, 7, 11, 4, 2, 8],
        [13, 7, 0, 9, 3, 4, 6, 10, 2, 8, 5, 14, 12, 11, 15, 1],
        [13, 6, 4, 9, 8, 15, 3, 0, 11, 1, 2, 12, 5, 10, 14, 7],
        [1, 10, 13, 0, 6, 9, 8, 7, 4, 15, 14, 3, 11, 5, 2, 12]
    ],
    # S4
    [
        [7, 13, 14, 3, 0, 6, 9, 10, 1, 2, 8, 5, 11, 12, 4, 15],
        [13, 8, 11, 5, 6, 15, 0, 3, 4, 7, 2, 12, 1, 10, 14, 9],
        [10, 6, 9, 0, 12, 11, 7, 13, 15, 1, 3, 14, 5, 2, 8, 4],
        [3, 15, 0, 6, 10, 1, 13, 8, 9, 4, 5, 11, 12, 7, 2, 14]
    ],
    # S5
    [
        [2, 12, 4, 1, 7, 10, 11, 6, 8, 5, 3, 15, 13, 0, 14, 9],
        [14, 11, 2, 12, 4, 7, 13, 1, 5, 0, 15, 10, 3, 9, 8, 6],
        [4, 2, 1, 11, 10, 13, 7, 8, 15, 9, 12, 5, 6, 3, 0, 14],
        [11, 8, 12, 7, 1, 14, 2, 13, 6, 15, 0, 9, 10, 4, 5, 3]
    ],
    # S6
    [
        [12, 1, 10, 15, 9, 2, 6, 8, 0, 13, 3, 4, 14, 7, 5, 11],
        [10, 15, 4, 2, 7, 12, 9, 5, 6, 1, 13, 14, 0, 11, 3, 8],
        [9, 14, 15, 5, 2, 8, 12, 3, 7, 0, 4, 10, 1, 13, 11, 6],
        [4, 3, 2, 12, 9, 5, 15, 10, 11, 14, 1, 7, 6, 0, 8, 13]
    ],
    # S7
    [
        [4, 11, 2, 14, 15, 0, 8, 13, 3, 12, 9, 7, 5, 10, 6, 1],
        [13, 0, 11, 7, 4, 9, 1, 10, 14, 3, 5, 12, 2, 15, 8, 6],
        [1, 4, 11, 13, 12, 3, 7, 14, 10, 15, 6, 8, 0, 5, 9, 2],
        [6, 11, 13, 8, 1, 4, 10, 7, 9, 5, 0, 15, 14, 2, 3, 12]
    ],
    # S8
    [
        [13, 2, 8, 4, 6, 15, 11, 1, 10, 9, 3, 14, 5, 0, 12, 7],
        [1, 15, 13, 8, 10, 3, 7, 4, 12, 5, 6, 11, 0, 14, 9, 2],
        [7, 11, 4, 1, 9, 12, 14, 2, 0, 6, 10, 13, 15, 3, 5, 8],
        [2, 1, 14, 7, 4, 10, 8, 13, 15, 12, 9, 0, 3, 5, 6, 11]
    ]
]

# Shifts per round (1-based index)
SHIFT_SCHEDULE = [1, 1, 2, 2, 2, 2, 2, 2, 1, 1, 2, 2, 2, 2, 2, 1]

def str_to_bin(s):
    return "".join(f"{ord(c):08b}" for c in s)

def bin_to_hex(b):
    return f"{int(b, 2):0{len(b)//4}X}"

def hex_to_bin(h):
    return "".join(f"{int(c, 16):04b}" for c in h)

def bin_to_str(b):
    chars = [chr(int(b[i:i+8], 2)) for i in range(0, len(b), 8)]
    return "".join(chars)

# PKCS#7 Padding
def pad(text):
    pad_len = 8 - (len(text) % 8)
    return text + chr(pad_len) * pad_len

def unpad(text):
    pad_len = ord(text[-1])
    if pad_len < 1 or pad_len > 8:
        return text
    # Verify padding
    if all(ord(c) == pad_len for c in text[-pad_len:]):
        return text[:-pad_len]
    return text

def key_schedule_trace(key_bin):
    """Generates the 16 round keys and traces the steps."""
    trace = []
    # PC-1 permutation
    key_56 = permute(key_bin, PC1)
    c0 = key_56[:28]
    d0 = key_56[28:]
    
    curr_c = c0
    curr_d = d0
    
    for round_idx in range(16):
        shifts = SHIFT_SCHEDULE[round_idx]
        # Circular shift left
        curr_c = curr_c[shifts:] + curr_c[:shifts]
        curr_d = curr_d[shifts:] + curr_d[:shifts]
        
        shifted_56 = curr_c + curr_d
        round_key = permute(shifted_56, PC2)
        
        trace.append({
            "round": round_idx + 1,
            "c_shift": curr_c,
            "d_shift": curr_d,
            "round_key": round_key,
            "round_key_hex": bin_to_hex(round_key)
        })
    return trace

def encrypt_block_trace(block_bin, round_keys_trace):
    """Encrypts a single 64-bit block and traces every internal state."""
    trace = {}
    trace["plaintext_binary"] = block_bin
    trace["plaintext_hex"] = bin_to_hex(block_bin)
    
    # Initial Permutation (IP)
    ip_out = permute(block_bin, IP)
    trace["initial_permutation"] = {
        "input": block_bin,
        "output": ip_out,
        "mapping": IP
    }
    
    left = ip_out[:32]
    right = ip_out[32:]
    
    rounds_trace = []
    
    for r in range(16):
        r_key = round_keys_trace[r]["round_key"]
        
        # 1. Expand right half from 32 to 48 bits
        expanded = permute(right, E)
        
        # 2. XOR with Round Key
        xor_res = "".join('1' if expanded[i] != r_key[i] else '0' for i in range(48))
        
        # 3. S-Boxes
        sbox_out = ""
        sbox_details = []
        for s in range(8):
            chunk = xor_res[s*6 : (s+1)*6]
            row = int(chunk[0] + chunk[5], 2)
            col = int(chunk[1:5], 2)
            val = S_BOXES[s][row][col]
            val_bin = f"{val:04b}"
            sbox_out += val_bin
            sbox_details.append({
                "sbox_num": s + 1,
                "input": chunk,
                "row": row,
                "col": col,
                "output": val_bin,
                "val_decimal": val
            })
            
        # 4. P Permutation
        p_out = permute(sbox_out, P)
        
        # 5. XOR with Left Half to get next Right Half
        next_right = "".join('1' if left[i] != p_out[i] else '0' for i in range(32))
        next_left = right
        
        rounds_trace.append({
            "round_num": r + 1,
            "left_in": left,
            "right_in": right,
            "expanded_right": expanded,
            "round_key": r_key,
            "round_key_hex": bin_to_hex(r_key),
            "xor_result": xor_res,
            "sbox_details": sbox_details,
            "sbox_output": sbox_out,
            "p_permutation_in": sbox_out,
            "p_permutation_out": p_out,
            "left_out": next_left,
            "right_out": next_right
        })
        
        left = next_left
        right = next_right
        
    # Swap pre-FP (Left and Right halves)
    pre_fp = right + left # Pre-FP is R16 + L16
    
    # Final Permutation
    fp_out = permute(pre_fp, FP)
    
    trace["rounds"] = rounds_trace
    trace["swap"] = {
        "left_in": left,
        "right_in": right,
        "output": pre_fp
    }
    trace["final_permutation"] = {
        "input": pre_fp,
        "output": fp_out,
        "mapping": FP
    }
    trace["ciphertext_hex"] = bin_to_hex(fp_out)
    trace["ciphertext_binary"] = fp_out
    
    return trace

def decrypt_block_trace(block_bin, round_keys_trace):
    """Decrypts a single 64-bit block and traces every internal state (reverse keys)."""
    trace = {}
    trace["ciphertext_binary"] = block_bin
    trace["ciphertext_hex"] = bin_to_hex(block_bin)
    
    # IP
    ip_out = permute(block_bin, IP)
    trace["initial_permutation"] = {
        "input": block_bin,
        "output": ip_out,
        "mapping": IP
    }
    
    left = ip_out[:32]
    right = ip_out[32:]
    
    rounds_trace = []
    
    # Decryption uses keys in reverse order
    for r in range(16):
        r_key = round_keys_trace[15 - r]["round_key"]
        
        expanded = permute(right, E)
        xor_res = "".join('1' if expanded[i] != r_key[i] else '0' for i in range(48))
        
        sbox_out = ""
        sbox_details = []
        for s in range(8):
            chunk = xor_res[s*6 : (s+1)*6]
            row = int(chunk[0] + chunk[5], 2)
            col = int(chunk[1:5], 2)
            val = S_BOXES[s][row][col]
            val_bin = f"{val:04b}"
            sbox_out += val_bin
            sbox_details.append({
                "sbox_num": s + 1,
                "input": chunk,
                "row": row,
                "col": col,
                "output": val_bin,
                "val_decimal": val
            })
            
        p_out = permute(sbox_out, P)
        next_right = "".join('1' if left[i] != p_out[i] else '0' for i in range(32))
        next_left = right
        
        rounds_trace.append({
            "round_num": r + 1,
            "left_in": left,
            "right_in": right,
            "expanded_right": expanded,
            "round_key": r_key,
            "round_key_hex": bin_to_hex(r_key),
            "xor_result": xor_res,
            "sbox_details": sbox_details,
            "sbox_output": sbox_out,
            "p_permutation_in": sbox_out,
            "p_permutation_out": p_out,
            "left_out": next_left,
            "right_out": next_right
        })
        
        left = next_left
        right = next_right
        
    pre_fp = right + left
    fp_out = permute(pre_fp, FP)
    
    trace["rounds"] = rounds_trace
    trace["swap"] = {
        "left_in": left,
        "right_in": right,
        "output": pre_fp
    }
    trace["final_permutation"] = {
        "input": pre_fp,
        "output": fp_out,
        "mapping": FP
    }
    trace["plaintext_hex"] = bin_to_hex(fp_out)
    trace["plaintext_binary"] = fp_out
    
    return trace

# Public wrapper functions that work with full plaintexts and standard padding:
def encrypt_des(plaintext: str, key: str) -> dict:
    """Encrypts full plaintext and returns hex ciphertext + visual trace of block 0."""
    # Ensure key is 8 bytes (64 bits)
    key_padded = (key + "\x00"*8)[:8]
    key_bin = str_to_bin(key_padded)
    
    padded_plain = pad(plaintext)
    blocks = [padded_plain[i:i+8] for i in range(0, len(padded_plain), 8)]
    
    keys_trace = key_schedule_trace(key_bin)
    
    # Encrypt all blocks, get full hex ciphertext
    ciphertext_hex_list = []
    block_traces = []
    
    for i, block in enumerate(blocks):
        block_bin = str_to_bin(block)
        b_trace = encrypt_block_trace(block_bin, keys_trace)
        ciphertext_hex_list.append(b_trace["ciphertext_hex"])
        if i == 0:
            block_traces.append(b_trace)
            
    return {
        "ciphertext": "".join(ciphertext_hex_list),
        "key_schedule": keys_trace,
        "trace": block_traces[0] # Detailed trace of the first block
    }

def decrypt_des(ciphertext_hex: str, key: str) -> dict:
    """Decrypts hex ciphertext and returns plaintext + visual trace of block 0."""
    key_padded = (key + "\x00"*8)[:8]
    key_bin = str_to_bin(key_padded)
    
    # Split hex ciphertext into 16-char chunks (64 bits each)
    blocks_hex = [ciphertext_hex[i:i+16] for i in range(0, len(ciphertext_hex), 16)]
    keys_trace = key_schedule_trace(key_bin)
    
    plaintext_blocks = []
    block_traces = []
    
    for i, b_hex in enumerate(blocks_hex):
        block_bin = hex_to_bin(b_hex)
        b_trace = decrypt_block_trace(block_bin, keys_trace)
        plain_block = bin_to_str(b_trace["plaintext_binary"])
        plaintext_blocks.append(plain_block)
        if i == 0:
            block_traces.append(b_trace)
            
    full_padded_plain = "".join(plaintext_blocks)
    plain_unpadded = unpad(full_padded_plain)
    
    return {
        "plaintext": plain_unpadded,
        "key_schedule": keys_trace,
        "trace": block_traces[0]
    }
