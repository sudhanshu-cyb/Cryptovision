# AES Algorithm Implementation with Step-by-Step Tracing

# Standard AES S-Box
S_BOX = [
    0x63, 0x7c, 0x77, 0x7b, 0xf2, 0x6b, 0x6f, 0xc5, 0x30, 0x01, 0x67, 0x2b, 0xfe, 0xd7, 0xab, 0x76,
    0xca, 0x82, 0xc9, 0x7d, 0xfa, 0x59, 0x47, 0xf0, 0xad, 0xd4, 0xa2, 0xaf, 0x9c, 0xa4, 0x72, 0xc0,
    0xb7, 0xfd, 0x93, 0x26, 0x36, 0x3f, 0xf7, 0xcc, 0x34, 0xa5, 0xe5, 0xf1, 0x71, 0xd8, 0x31, 0x15,
    0x04, 0xc7, 0x23, 0xc3, 0x18, 0x96, 0x05, 0x9a, 0x07, 0x12, 0x80, 0xe2, 0xeb, 0x27, 0xb2, 0x75,
    0x09, 0x83, 0x2c, 0x1a, 0x1b, 0x6e, 0x5a, 0xa0, 0x52, 0x3b, 0xd6, 0xb3, 0x29, 0xe3, 0x2f, 0x84,
    0x53, 0xd1, 0x00, 0xed, 0x20, 0xfc, 0xb1, 0x5b, 0x6a, 0xcb, 0xbe, 0x39, 0x4a, 0x4c, 0x58, 0xcf,
    0xd0, 0xef, 0xaa, 0xfb, 0x43, 0x4d, 0x33, 0x85, 0x45, 0xf9, 0x02, 0x7f, 0x50, 0x3c, 0x9f, 0xa8,
    0x51, 0xa3, 0x40, 0x8f, 0x92, 0x9d, 0x38, 0xf5, 0xbc, 0xb6, 0xda, 0x21, 0x10, 0xff, 0xf3, 0xd2,
    0xcd, 0x0c, 0x13, 0xec, 0x5f, 0x97, 0x44, 0x17, 0xc4, 0xa7, 0x7e, 0x3d, 0x64, 0x5d, 0x19, 0x73,
    0x60, 0x81, 0x4f, 0xdc, 0x22, 0x2a, 0x90, 0x88, 0x46, 0xee, 0xb8, 0x14, 0xde, 0x5e, 0x0b, 0xdb,
    0xe0, 0x32, 0x3a, 0x0a, 0x49, 0x06, 0x24, 0x5c, 0xc2, 0xd3, 0xac, 0x62, 0x91, 0x95, 0xe4, 0x79,
    0xe7, 0xc8, 0x37, 0x6d, 0x8d, 0xd5, 0x4e, 0xa9, 0x6c, 0x56, 0xf4, 0xea, 0x65, 0x7a, 0xae, 0x08,
    0xba, 0x78, 0x25, 0x2e, 0x1c, 0xa6, 0xb4, 0xc6, 0xe8, 0xdd, 0x74, 0x1f, 0x4b, 0xbd, 0x8b, 0x8a,
    0x70, 0x3e, 0xb5, 0x66, 0x48, 0x03, 0xf6, 0x0e, 0x61, 0x35, 0x57, 0xb9, 0x86, 0xc1, 0x1d, 0x9e,
    0xe1, 0xf8, 0x98, 0x11, 0x69, 0xd9, 0x8e, 0x94, 0x9b, 0x1e, 0x87, 0xe9, 0xce, 0x55, 0x28, 0xdf,
    0x8c, 0xa1, 0x89, 0x0d, 0xbf, 0xe6, 0x42, 0x68, 0x41, 0x99, 0x2d, 0x0f, 0xb0, 0x54, 0xbb, 0x16
]

# Standard AES Inverse S-Box
INV_S_BOX = [
    0x52, 0x09, 0x6a, 0xd5, 0x30, 0x36, 0xa5, 0x38, 0xbf, 0x40, 0xa3, 0x9e, 0x81, 0xf3, 0xd7, 0xfb,
    0x7c, 0xe3, 0x39, 0x82, 0x9b, 0x2f, 0xff, 0x87, 0x34, 0x8e, 0x43, 0x44, 0xc4, 0xde, 0xe9, 0xcb,
    0x54, 0x7b, 0x94, 0x32, 0xa6, 0xc2, 0x23, 0x3d, 0xee, 0x4c, 0x95, 0x0b, 0x42, 0xfa, 0xc3, 0x4e,
    0x08, 0x2e, 0xa1, 0x66, 0x28, 0xd9, 0x24, 0xb2, 0x76, 0x5b, 0xa2, 0x49, 0x6d, 0x8b, 0xd1, 0x25,
    0x72, 0xf8, 0xf6, 0x64, 0x86, 0x68, 0x98, 0x16, 0xd4, 0xa4, 0x5c, 0xcc, 0x5d, 0x65, 0xb6, 0x92,
    0x6c, 0x70, 0x48, 0x50, 0xfd, 0xed, 0xb9, 0xda, 0x5e, 0x15, 0x46, 0x57, 0xa7, 0x8d, 0x9d, 0x84,
    0x90, 0xd8, 0xab, 0x00, 0x8c, 0xbc, 0xd3, 0x0a, 0xf7, 0xe4, 0x58, 0x05, 0xb8, 0xb3, 0x45, 0x06,
    0xd0, 0x2c, 0x1e, 0x8f, 0xca, 0x3f, 0x0f, 0x02, 0xc1, 0xaf, 0xbd, 0x03, 0x01, 0x13, 0x8a, 0x6b,
    0x3a, 0x91, 0x11, 0x41, 0x4f, 0x67, 0xdc, 0xea, 0x97, 0xf2, 0xcf, 0xce, 0xf0, 0xb4, 0xe6, 0x73,
    0x96, 0xac, 0x74, 0x22, 0xe7, 0xad, 0x35, 0x85, 0xe2, 0xf9, 0x37, 0xe8, 0x1c, 0x75, 0xdf, 0x6e,
    0x47, 0xf1, 0x1a, 0x71, 0x1d, 0x29, 0xc5, 0x89, 0x6f, 0xb7, 0x62, 0x0e, 0xaa, 0x18, 0xbe, 0x1b,
    0xfc, 0x56, 0x3e, 0x4b, 0xc6, 0xd2, 0x79, 0x20, 0x9a, 0xdb, 0xc0, 0xfe, 0x78, 0xcd, 0x5a, 0xf4,
    0x1f, 0xdd, 0xa8, 0x33, 0x88, 0x07, 0xc7, 0x31, 0xb1, 0x12, 0x10, 0x59, 0x27, 0x80, 0xec, 0x5f,
    0x60, 0x51, 0x7f, 0xa9, 0x19, 0xb5, 0x4a, 0x0d, 0x2d, 0xe5, 0x7a, 0x9f, 0x93, 0xc9, 0x9c, 0xef,
    0xa0, 0xe0, 0x3b, 0x4d, 0xae, 0x2a, 0xf5, 0xb0, 0xc8, 0xeb, 0xbb, 0x3c, 0x83, 0x53, 0x99, 0x61,
    0x17, 0x2b, 0x04, 0x7e, 0xba, 0x77, 0xd6, 0x26, 0xe1, 0x69, 0x14, 0x63, 0x55, 0x21, 0x0c, 0x7d
]

# Rcon constants
RCON = [
    0x00, 0x01, 0x02, 0x04, 0x08, 0x10, 0x20, 0x40, 0x80, 0x1B, 0x36
]

# Helper arithmetic in GF(2^8)
def xtime(a):
    return ((a << 1) ^ 0x1B) & 0xFF if a & 0x80 else (a << 1) & 0xFF

def gf_mul(a, b):
    # Multiplication in GF(2^8) using peasant's algorithm
    p = 0
    for _ in range(8):
        if b & 1:
            p ^= a
        hi_bit_set = a & 0x80
        a = (a << 1) & 0xFF
        if hi_bit_set:
            a ^= 0x1B
        b >>= 1
    return p

# Padding using standard PKCS#7
def pad_aes(text):
    pad_len = 16 - (len(text) % 16)
    return text + chr(pad_len) * pad_len

def unpad_aes(text):
    pad_len = ord(text[-1])
    if pad_len < 1 or pad_len > 16:
        return text
    if all(ord(c) == pad_len for c in text[-pad_len:]):
        return text[:-pad_len]
    return text

def text_to_state(text_block):
    """Converts 16-character string/bytes block into 4x4 matrix (column-major order)."""
    if isinstance(text_block, str):
        text_block = text_block.encode('utf-8')
    state = [[0]*4 for _ in range(4)]
    for r in range(4):
        for c in range(4):
            state[r][c] = text_block[r + 4*c]
    return state

def state_to_bytes(state):
    """Converts 4x4 state matrix back into 16 bytes (column-major)."""
    out = bytearray(16)
    for r in range(4):
        for c in range(4):
            out[r + 4*c] = state[r][c]
    return bytes(out)

def state_to_hex(state):
    """Formats state matrix as a list of list of hex strings."""
    return [[f"{cell:02x}" for cell in row] for row in state]

def xor_matrices(a, b):
    return [[a[r][c] ^ b[r][c] for c in range(4)] for r in range(4)]

def key_expansion(key_bytes):
    """Performs AES key expansion for 128, 192, or 256 bits."""
    Nk = len(key_bytes) // 4
    if len(key_bytes) == 16:
        Nr = 10
    elif len(key_bytes) == 24:
        Nr = 12
    elif len(key_bytes) == 32:
        Nr = 14
    else:
        raise ValueError("Key must be 128, 192, or 256 bits")

    w = []
    # Initial words
    for i in range(Nk):
        w.append([key_bytes[4*i], key_bytes[4*i+1], key_bytes[4*i+2], key_bytes[4*i+3]])

    # Generate subsequent words
    for i in range(Nk, 4 * (Nr + 1)):
        temp = list(w[i - 1])
        if i % Nk == 0:
            # RotWord
            temp = temp[1:] + temp[:1]
            # SubWord
            temp = [S_BOX[x] for x in temp]
            # XOR Rcon
            rcon_val = RCON[i // Nk]
            temp[0] ^= rcon_val
        elif Nk > 6 and (i % Nk == 4):
            # Special case for AES-256
            temp = [S_BOX[x] for x in temp]
            
        new_word = [w[i - Nk][j] ^ temp[j] for j in range(4)]
        w.append(new_word)

    # Re-group into round keys (each 4x4 matrix)
    round_keys = []
    for r in range(Nr + 1):
        rkey = [[0]*4 for _ in range(4)]
        for col in range(4):
            word = w[4*r + col]
            for row in range(4):
                rkey[row][col] = word[row]
        round_keys.append(rkey)
        
    # Build a nice words array for frontend key visualizer
    words_hex = []
    for i, word in enumerate(w):
        words_hex.append({
            "idx": i,
            "val": "".join(f"{x:02x}" for x in word)
        })

    return round_keys, words_hex

def sub_bytes_state(state):
    lookups = []
    out = [[0]*4 for _ in range(4)]
    for r in range(4):
        for c in range(4):
            val = state[r][c]
            res = S_BOX[val]
            out[r][c] = res
            lookups.append({
                "row": r,
                "col": c,
                "in": f"{val:02x}",
                "out": f"{res:02x}"
            })
    return out, lookups

def inv_sub_bytes_state(state):
    lookups = []
    out = [[0]*4 for _ in range(4)]
    for r in range(4):
        for c in range(4):
            val = state[r][c]
            res = INV_S_BOX[val]
            out[r][c] = res
            lookups.append({
                "row": r,
                "col": c,
                "in": f"{val:02x}",
                "out": f"{res:02x}"
            })
    return out, lookups

def shift_rows_state(state):
    out = [[0]*4 for _ in range(4)]
    # Row 0: no shift
    out[0] = list(state[0])
    # Row 1: left shift by 1
    out[1] = state[1][1:] + state[1][:1]
    # Row 2: left shift by 2
    out[2] = state[2][2:] + state[2][:2]
    # Row 3: left shift by 3
    out[3] = state[3][3:] + state[3][:3]
    return out

def inv_shift_rows_state(state):
    out = [[0]*4 for _ in range(4)]
    # Row 0: no shift
    out[0] = list(state[0])
    # Row 1: right shift by 1
    out[1] = state[1][-1:] + state[1][:-1]
    # Row 2: right shift by 2
    out[2] = state[2][-2:] + state[2][:-2]
    # Row 3: right shift by 3
    out[3] = state[3][-3:] + state[3][:-3]
    return out

def mix_columns_state(state):
    out = [[0]*4 for _ in range(4)]
    equations = []
    for c in range(4):
        s0 = state[0][c]
        s1 = state[1][c]
        s2 = state[2][c]
        s3 = state[3][c]
        
        out[0][c] = gf_mul(0x02, s0) ^ gf_mul(0x03, s1) ^ s2 ^ s3
        out[1][c] = s0 ^ gf_mul(0x02, s1) ^ gf_mul(0x03, s2) ^ s3
        out[2][c] = s0 ^ s1 ^ gf_mul(0x02, s2) ^ gf_mul(0x03, s3)
        out[3][c] = gf_mul(0x03, s0) ^ s1 ^ s2 ^ gf_mul(0x02, s3)
        
        equations.append(
            f"Col {c}: s'0={gf_mul(0x02, s0):02x}^{gf_mul(0x03, s1):02x}^{s2:02x}^{s3:02x}={out[0][c]:02x}"
        )
    return out, equations

def inv_mix_columns_state(state):
    out = [[0]*4 for _ in range(4)]
    equations = []
    for c in range(4):
        s0 = state[0][c]
        s1 = state[1][c]
        s2 = state[2][c]
        s3 = state[3][c]
        
        out[0][c] = gf_mul(0x0E, s0) ^ gf_mul(0x0B, s1) ^ gf_mul(0x0D, s2) ^ gf_mul(0x09, s3)
        out[1][c] = gf_mul(0x09, s0) ^ gf_mul(0x0E, s1) ^ gf_mul(0x0B, s2) ^ gf_mul(0x0D, s3)
        out[2][c] = gf_mul(0x0D, s0) ^ gf_mul(0x09, s1) ^ gf_mul(0x0E, s2) ^ gf_mul(0x0B, s3)
        out[3][c] = gf_mul(0x0B, s0) ^ gf_mul(0x0D, s1) ^ gf_mul(0x09, s2) ^ gf_mul(0x0E, s3)
        
        equations.append(
            f"Col {c}: s'0={gf_mul(0x0E, s0):02x}^{gf_mul(0x0B, s1):02x}^{gf_mul(0x0D, s2):02x}^{gf_mul(0x09, s3):02x}={out[0][c]:02x}"
        )
    return out, equations

def encrypt_block_trace_aes(block_bytes, round_keys):
    """Encrypts a single 16-byte block, generating a detailed step-by-step trace."""
    Nr = len(round_keys) - 1
    trace = {}
    
    # Text to Initial State
    state = text_to_state(block_bytes)
    trace["plaintext_hex"] = block_bytes.hex()
    trace["initial_state"] = state_to_hex(state)
    
    # Initial AddRoundKey
    init_key = round_keys[0]
    state_after_xor = xor_matrices(state, init_key)
    trace["initial_round"] = {
        "state_in": state_to_hex(state),
        "round_key": state_to_hex(init_key),
        "state_out": state_to_hex(state_after_xor)
    }
    
    state = state_after_xor
    rounds_trace = []
    
    for r in range(1, Nr):
        state_in = state
        
        # 1. SubBytes
        state_sub, lookups = sub_bytes_state(state)
        # 2. ShiftRows
        state_shift = shift_rows_state(state_sub)
        # 3. MixColumns
        state_mix, equations = mix_columns_state(state_shift)
        # 4. AddRoundKey
        rkey = round_keys[r]
        state_xor = xor_matrices(state_mix, rkey)
        
        rounds_trace.append({
            "round_num": r,
            "state_in": state_to_hex(state_in),
            "sub_bytes": {
                "state_in": state_to_hex(state_in),
                "state_out": state_to_hex(state_sub),
                "lookups": lookups
            },
            "shift_rows": {
                "state_in": state_to_hex(state_sub),
                "state_out": state_to_hex(state_shift)
            },
            "mix_columns": {
                "state_in": state_to_hex(state_shift),
                "state_out": state_to_hex(state_mix),
                "equations": equations
            },
            "add_round_key": {
                "state_in": state_to_hex(state_mix),
                "round_key": state_to_hex(rkey),
                "state_out": state_to_hex(state_xor)
            }
        })
        state = state_xor

    # Final Round (No MixColumns)
    state_in = state
    state_sub, lookups = sub_bytes_state(state)
    state_shift = shift_rows_state(state_sub)
    rkey = round_keys[Nr]
    state_xor = xor_matrices(state_shift, rkey)
    
    trace["rounds"] = rounds_trace
    trace["final_round"] = {
        "round_num": Nr,
        "state_in": state_to_hex(state_in),
        "sub_bytes": {
            "state_in": state_to_hex(state_in),
            "state_out": state_to_hex(state_sub),
            "lookups": lookups
        },
        "shift_rows": {
            "state_in": state_to_hex(state_sub),
            "state_out": state_to_hex(state_shift)
        },
        "add_round_key": {
            "state_in": state_to_hex(state_shift),
            "round_key": state_to_hex(rkey),
            "state_out": state_to_hex(state_xor)
        },
        "ciphertext_hex": state_to_bytes(state_xor).hex()
    }
    
    trace["ciphertext_hex"] = state_to_bytes(state_xor).hex()
    return trace

def decrypt_block_trace_aes(block_bytes, round_keys):
    """Decrypts a single 16-byte block, generating a detailed step-by-step trace."""
    Nr = len(round_keys) - 1
    trace = {}
    
    state = text_to_state(block_bytes)
    trace["ciphertext_hex"] = block_bytes.hex()
    trace["initial_state"] = state_to_hex(state)
    
    # 1. Initial AddRoundKey (with final round key)
    init_key = round_keys[Nr]
    state_after_xor = xor_matrices(state, init_key)
    trace["initial_round"] = {
        "state_in": state_to_hex(state),
        "round_key": state_to_hex(init_key),
        "state_out": state_to_hex(state_after_xor)
    }
    
    state = state_after_xor
    rounds_trace = []
    
    for r in range(1, Nr):
        state_in = state
        
        # Inverse ShiftRows
        state_shift = inv_shift_rows_state(state)
        # Inverse SubBytes
        state_sub, lookups = inv_sub_bytes_state(state_shift)
        # AddRoundKey (with key Nr - r)
        rkey = round_keys[Nr - r]
        state_xor = xor_matrices(state_sub, rkey)
        # Inverse MixColumns
        state_mix, equations = inv_mix_columns_state(state_xor)
        
        rounds_trace.append({
            "round_num": r,
            "state_in": state_to_hex(state_in),
            "shift_rows": {
                "state_in": state_to_hex(state_in),
                "state_out": state_to_hex(state_shift)
            },
            "sub_bytes": {
                "state_in": state_to_hex(state_shift),
                "state_out": state_to_hex(state_sub),
                "lookups": lookups
            },
            "add_round_key": {
                "state_in": state_to_hex(state_sub),
                "round_key": state_to_hex(rkey),
                "state_out": state_to_hex(state_xor)
            },
            "mix_columns": {
                "state_in": state_to_hex(state_xor),
                "state_out": state_to_hex(state_mix),
                "equations": equations
            }
        })
        state = state_mix

    # Final Round (No InvMixColumns)
    state_in = state
    state_shift = inv_shift_rows_state(state)
    state_sub, lookups = inv_sub_bytes_state(state_shift)
    rkey = round_keys[0]
    state_xor = xor_matrices(state_sub, rkey)
    
    trace["rounds"] = rounds_trace
    trace["final_round"] = {
        "round_num": Nr,
        "state_in": state_to_hex(state_in),
        "shift_rows": {
            "state_in": state_to_hex(state_in),
            "state_out": state_to_hex(state_shift)
        },
        "sub_bytes": {
            "state_in": state_to_hex(state_shift),
            "state_out": state_to_hex(state_sub),
            "lookups": lookups
        },
        "add_round_key": {
            "state_in": state_to_hex(state_sub),
            "round_key": state_to_hex(rkey),
            "state_out": state_to_hex(state_xor)
        },
        "plaintext_hex": state_to_bytes(state_xor).hex()
    }
    
    trace["plaintext_hex"] = state_to_bytes(state_xor).hex()
    return trace

# Public wrapper functions that work with full plaintexts and padding
def encrypt_aes(plaintext: str, key_hex: str) -> dict:
    """Encrypts plaintext with a given key (in hex format) using AES-128/192/256."""
    key_bytes = bytes.fromhex(key_hex)
    padded_plain = pad_aes(plaintext).encode('utf-8')
    
    # Key expansion
    round_keys, words_hex = key_expansion(key_bytes)
    
    blocks = [padded_plain[i:i+16] for i in range(0, len(padded_plain), 16)]
    ciphertext_hex_list = []
    block_traces = []
    
    for i, block in enumerate(blocks):
        b_trace = encrypt_block_trace_aes(block, round_keys)
        ciphertext_hex_list.append(b_trace["ciphertext_hex"])
        if i == 0:
            block_traces.append(b_trace)
            
    return {
        "ciphertext": "".join(ciphertext_hex_list),
        "key_schedule": words_hex,
        "trace": block_traces[0] # Step-by-step trace of first block
    }

def decrypt_aes(ciphertext_hex: str, key_hex: str) -> dict:
    """Decrypts ciphertext with a given key (in hex format) using AES-128/192/256."""
    key_bytes = bytes.fromhex(key_hex)
    cipher_bytes = bytes.fromhex(ciphertext_hex)
    
    round_keys, words_hex = key_expansion(key_bytes)
    
    blocks = [cipher_bytes[i:i+16] for i in range(0, len(cipher_bytes), 16)]
    plain_blocks = []
    block_traces = []
    
    for i, block in enumerate(blocks):
        b_trace = decrypt_block_trace_aes(block, round_keys)
        plain_blocks.append(bytes.fromhex(b_trace["plaintext_hex"]))
        if i == 0:
            block_traces.append(b_trace)
            
    full_plain_padded = b"".join(plain_blocks).decode('utf-8', errors='replace')
    plain_unpadded = unpad_aes(full_plain_padded)
    
    return {
        "plaintext": plain_unpadded,
        "key_schedule": words_hex,
        "trace": block_traces[0]
    }
