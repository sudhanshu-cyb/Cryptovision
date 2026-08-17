# CryptoVision 🔐 | Enterprise-Grade Cryptographic Simulator

An advanced, interactive educational platform and simulator designed to visualize the internal mechanics of block ciphers. Supporting detailed step-by-step bit-level tracing for both the **Data Encryption Standard (DES)** and the **Advanced Encryption Standard (AES)**, CryptoVision provides real-time state analysis, avalanche effect heatmaps, and benchmarking dashboards inside a sleek, cybersecurity-laboratory interface.

---

## 🚀 Key Features

*   **DES Step-by-Step Feistel Visualizer:** Tracks data block transformations across all 16 Feistel rounds, showcasing circular key shifts, expansion permutations ($E$), S-box mappings, and permutation matrix ($P$) diffusions.
*   **AES Rijndael Matrix Visualizer:** Inspects the $4 \times 4$ column-major state matrix across all transformations: `SubBytes` (Galois S-Box), `ShiftRows` (cyclic offsets), `MixColumns` (GF($2^8$) polynomial multiplication), and `AddRoundKey` XOR.
*   **Avalanche Effect Heatmap Analyzer:** Computes diffusion metrics by measuring output bit flip variance from a single-bit input modification.
*   **Performance Throughput Dashboard:** Compares algorithmic latency, throughput overhead, and hardware-acceleration instructions (AES-NI) telemetry.
*   **Telemetry History Logs:** Persists operations in an SQLite datastore with metrics exporting capabilities.
*   **Interactive Cyber Lab Suite:** Integrated quiz module for assessment and a curated documentation repository for classroom-ready cryptography training.

---

## 🛠️ System Tech Stack

### Frontend Architecture
*   **React 19 & TypeScript 6.0:** State management and component-driven architecture.
*   **Vite 8.1:** Lightning-fast HMR bundler.
*   **Tailwind CSS v4:** Cyber-laboratory themed neon CSS design system.
*   **Framer Motion:** Micro-animations for state transitions and binary shuffles.
*   **Lucide Icons:** Unified cryptographic iconography.

### Backend Infrastructure
*   **FastAPI:** High-performance, concurrent ASGI python web framework.
*   **Uvicorn:** Production-ready web server.
*   **PyCryptodome:** Robust underlying cryptography primitives.
*   **SQLite3:** Lightweight relational storage for execution history.

---

## 📐 System Architecture

### Process Flow Diagram

```mermaid
flowchart TD
    subgraph Frontend (React 19)
        UI[Cyber Lab UI] -->|User Input| State[State Manager]
        State -->|REST API Payload| API_Client[HTTP Axios/Fetch Client]
        API_Client -->|JSON Trace Response| Render[Step-by-Step Animation Engine]
    end

    subgraph Backend (FastAPI Server)
        API_Client <==>|Port 8000| Endpoints[API Routing App]
        Endpoints -->|Run Cipher Trace| CryptEngine[DES / AES PyCryptodome Engines]
        CryptEngine -->|Compute Detailed Steps| EngineTrace[Block State Tracer]
        EngineTrace -->|Insert Exec Record| DB[(SQLite History DB)]
    end
```

---

## 📁 Repository Structure

```
CryptoVision/
├── backend/
│   ├── app.py                          # FastAPI Entrypoint, CORS & Database ORM
│   ├── requirements.txt                # Python backend dependencies
│   └── algorithms/
│       ├── des.py                      # Pure Python DES Engine with step-by-step tracing
│       └── aes.py                      # Pure Python AES Engine with Galois field tracing
│
├── frontend/
│   ├── package.json                    # Node dependencies & package scripts
│   ├── vite.config.ts                  # Vite build-time config
│   ├── tsconfig.json                   # TypeScript project rules
│   ├── index.html                      # HTML root template
│   └── src/
│       ├── main.tsx                    # React mounting script
│       ├── App.tsx                     # Main layout shell and routing
│       ├── index.css                   # Tailwind v4 globals, Glassmorphism, Neon glow animations
│       └── components/
│           ├── AES/
│           │   └── AesSimulator.tsx    # Interactive AES State Matrix visualization
│           ├── DES/
│           │   └── DesSimulator.tsx    # Feistel Round, S-Box lookups & P-shuffles
│           ├── Dashboard/
│           │   └── Dashboard.tsx       # Live throughput analytics & telemetry graphs
│           ├── Visualizer/
│           │   ├── AvalancheEffect.tsx # Diff heatmap and bit flip variance analytics
│           │   └── CompareAlgorithms.tsx # Specification matrices and speed comparators
│           ├── Learning/
│           │   └── LearningCenter.tsx  # Interactive educational guides
│           ├── Quiz/
│           │   └── QuizModule.tsx      # MCQ module with interactive scoring
│           ├── History/
│           │   └── HistoryManager.tsx  # Relational audit log management
│           └── Common/
│               └── Sidebar.tsx         # Navigation sidebar layout
```

---

## 🔌 API Documentation & Schema Specification

The FastAPI backend exposes endpoints at `http://127.0.0.1:8000/`.

### 1. DES Encryption Trace (`POST /encrypt/des`)
Generates the complete Feistel schedule and bit-level trace details for the first 64-bit block.

*   **Request Headers:** `Content-Type: application/json`
*   **Request Body:**
    ```json
    {
      "plaintext": "CRYPTO12",
      "key": "MYKEY123"
    }
    ```
*   **Response Schema (Truncated):**
    ```json
    {
      "ciphertext": "f3b890...",
      "key_schedule": [
        {
          "round": 1,
          "c_shift": "111000...",
          "d_shift": "000111...",
          "round_key": "1010...",
          "round_key_hex": "A1B2..."
        }
      ],
      "trace": {
        "plaintext_binary": "01000011...",
        "initial_permutation": {
          "input": "01000011...",
          "output": "11100011..."
        },
        "rounds": [
          {
            "round_num": 1,
            "left_in": "11100011...",
            "right_in": "00011100...",
            "expanded_right": "1000111...",
            "xor_result": "0011...",
            "sbox_details": [
              {
                "sbox_num": 1,
                "input": "101010",
                "row": 2,
                "col": 5,
                "output": "1100",
                "val_decimal": 12
              }
            ],
            "p_permutation_out": "1100..."
          }
        ]
      }
    }
    ```

### 2. AES Encryption Trace (`POST /encrypt/aes`)
*   **Request Body:**
    ```json
    {
      "plaintext": "CYBERSECURITYLAB",
      "key": "MYSECRETKEY12345",
      "key_size": 128
    }
    ```

---

## ⚙️ Local Development Setup

### System Prerequisites
*   **Node.js** v18 or higher (v20+ recommended)
*   **Python** v3.9 or higher
*   **C compiler** (Optional, only if building raw PyCryptodome packages from source)

### Backend Deployment

1.  **Clone and Navigate to Backend:**
    ```bash
    cd backend
    ```

2.  **Initialize Virtual Environment:**
    ```bash
    python -m venv venv
    # On Windows
    venv\Scripts\activate
    # On macOS/Linux
    source venv/bin/activate
    ```

3.  **Install Production Requirements:**
    ```bash
    pip install -r requirements.txt
    ```

4.  **Launch Uvicorn Web Server:**
    ```bash
    python app.py
    ```
    The server will startup on port `8000` (`http://127.0.0.1:8000`).

### Frontend Deployment

1.  **Navigate to Frontend:**
    ```bash
    cd ../frontend
    ```

2.  **Install Node Modules:**
    ```bash
    npm install
    ```

3.  **Compile & Launch Dev Server:**
    ```bash
    npm run dev
    ```
    Open `http://localhost:5173/` in your browser.

---

## 🛡️ Telemetry & Security Analysis

CryptoVision analyzes cipher implementations across security levels:

| Cipher | Key Strength Options | Security Level | Vulnerabilities Explored |
| :--- | :--- | :--- | :--- |
| **DES** | 56-bit | **Exposed (Deprecated)** | Linear cryptanalysis, brute-force keyspace sweeps |
| **AES** | 128, 192, 256-bit | **Secure (Standard)** | Side-channel timing profiles |

---

## 👨‍💻 Author & Contributions

Designed and developed with care by **Sudhanshu Keskar**.

*   **GitHub:** [@sudhanshu-cyb](https://github.com/sudhanshu-cyb)
*   **Email:** [sudhanshukeskar@gmail.com](mailto:sudhanshukeskar@gmail.com)

Contributions are welcome! Please open an issue or submit a pull request.
