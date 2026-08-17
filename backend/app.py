from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import time
import sqlite3
from datetime import datetime
import os
import hashlib

from algorithms.des import encrypt_des, decrypt_des
from algorithms.aes import encrypt_aes, decrypt_aes

app = FastAPI(title="CryptoVision Simulator API", version="1.0.0")

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In development, allow all
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DB_PATH = "history.db"

def init_db():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS history (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        plaintext TEXT,
        ciphertext TEXT,
        algorithm TEXT,
        timestamp TEXT,
        execution_time REAL
    )
    """)
    conn.commit()
    conn.close()

init_db()

# Pydantic Schemas
class DESRequest(BaseModel):
    plaintext: str
    key: str

class DESDecryptRequest(BaseModel):
    ciphertext: str
    key: str

class AESRequest(BaseModel):
    plaintext: str
    key: str
    key_size: int  # 128, 192, 256

class AESDecryptRequest(BaseModel):
    ciphertext: str
    key: str
    key_size: int  # 128, 192, 256

# Helper to format keys for AES (converts text key to hex representation of correct length)
def format_aes_key(key_str: str, key_size: int) -> str:
    # Hash the key string using SHA-256 and truncate to correct size (16, 24, 32 bytes)
    hasher = hashlib.sha256(key_str.encode('utf-8'))
    key_hash = hasher.hexdigest()
    num_chars = (key_size // 8) * 2  # Hex characters: 32, 48, 64
    return key_hash[:num_chars]

@app.post("/encrypt/des")
def api_encrypt_des(req: DESRequest):
    try:
        start_time = time.perf_counter()
        result = encrypt_des(req.plaintext, req.key)
        end_time = time.perf_counter()
        
        exec_time_ms = (end_time - start_time) * 1000
        
        # Save to history
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO history (plaintext, ciphertext, algorithm, timestamp, execution_time) VALUES (?, ?, ?, ?, ?)",
            (req.plaintext, result["ciphertext"], "DES", datetime.now().isoformat(), exec_time_ms)
        )
        conn.commit()
        conn.close()
        
        return {
            "ciphertext": result["ciphertext"],
            "key_schedule": result["key_schedule"],
            "trace": result["trace"],
            "execution_time_ms": exec_time_ms
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/decrypt/des")
def api_decrypt_des(req: DESDecryptRequest):
    try:
        start_time = time.perf_counter()
        result = decrypt_des(req.ciphertext, req.key)
        end_time = time.perf_counter()
        
        exec_time_ms = (end_time - start_time) * 1000
        
        return {
            "plaintext": result["plaintext"],
            "key_schedule": result["key_schedule"],
            "trace": result["trace"],
            "execution_time_ms": exec_time_ms
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/encrypt/aes")
def api_encrypt_aes(req: AESRequest):
    try:
        if req.key_size not in [128, 192, 256]:
            raise ValueError("Key size must be 128, 192, or 256 bits")
            
        start_time = time.perf_counter()
        # Format the key appropriately
        aes_key_hex = format_aes_key(req.key, req.key_size)
        result = encrypt_aes(req.plaintext, aes_key_hex)
        end_time = time.perf_counter()
        
        exec_time_ms = (end_time - start_time) * 1000
        
        # Save to history
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO history (plaintext, ciphertext, algorithm, timestamp, execution_time) VALUES (?, ?, ?, ?, ?)",
            (req.plaintext, result["ciphertext"], f"AES-{req.key_size}", datetime.now().isoformat(), exec_time_ms)
        )
        conn.commit()
        conn.close()
        
        return {
            "ciphertext": result["ciphertext"],
            "key_schedule": result["key_schedule"],
            "trace": result["trace"],
            "execution_time_ms": exec_time_ms,
            "key_hex": aes_key_hex
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/decrypt/aes")
def api_decrypt_aes(req: AESDecryptRequest):
    try:
        if req.key_size not in [128, 192, 256]:
            raise ValueError("Key size must be 128, 192, or 256 bits")
            
        start_time = time.perf_counter()
        aes_key_hex = format_aes_key(req.key, req.key_size)
        result = decrypt_aes(req.ciphertext, aes_key_hex)
        end_time = time.perf_counter()
        
        exec_time_ms = (end_time - start_time) * 1000
        
        return {
            "plaintext": result["plaintext"],
            "key_schedule": result["key_schedule"],
            "trace": result["trace"],
            "execution_time_ms": exec_time_ms,
            "key_hex": aes_key_hex
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/visualize/des")
def api_visualize_des(req: DESRequest):
    return api_encrypt_des(req)

@app.post("/visualize/aes")
def api_visualize_aes(req: AESRequest):
    return api_encrypt_aes(req)

@app.get("/history")
def api_get_history():
    try:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        cursor.execute("SELECT id, plaintext, ciphertext, algorithm, timestamp, execution_time FROM history ORDER BY id DESC")
        rows = cursor.fetchall()
        conn.close()
        
        history_list = []
        for r in rows:
            history_list.append({
                "id": r[0],
                "plaintext": r[1],
                "ciphertext": r[2],
                "algorithm": r[3],
                "timestamp": r[4],
                "execution_time": r[5]
            })
        return history_list
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.delete("/history")
def api_clear_history():
    try:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        cursor.execute("DELETE FROM history")
        conn.commit()
        conn.close()
        return {"status": "success", "message": "History cleared"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
