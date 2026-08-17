# CryptoVision 🔐 | Enterprise-Grade Cryptographic Simulator

An advanced, interactive educational platform and simulator designed to visualize the internal mechanics of block ciphers. Supporting detailed step-by-step bit-level tracing for both the **Data Encryption Standard (DES)** and the **Advanced Encryption Standard (AES)**, CryptoVision provides real-time state analysis, avalanche effect heatmaps, and benchmarking dashboards inside a sleek, cybersecurity-laboratory interface.

---

## 🚀 Key Features

<table width="100%">
  <tr>
    <td width="50%" valign="top">
      <h4>🔒 DES Feistel Visualizer</h4>
      <p>Tracks data block transformations across all 16 Feistel rounds, showcasing circular key shifts, expansion permutations (E), S-box mappings, and permutation matrix (P) diffusions.</p>
    </td>
    <td width="50%" valign="top">
      <h4>🔑 AES Rijndael Matrix Visualizer</h4>
      <p>Inspects the 4x4 column-major state matrix across all transformations: <code>SubBytes</code>, <code>ShiftRows</code>, <code>MixColumns</code>, and <code>AddRoundKey</code> XOR.</p>
    </td>
  </tr>
  <tr>
    <td width="50%" valign="top">
      <h4>📊 Avalanche Effect Heatmap</h4>
      <p>Computes diffusion metrics by measuring output bit flip variance from a single-bit input modification in an interactive grid.</p>
    </td>
    <td width="50%" valign="top">
      <h4>⚡ Performance Throughput</h4>
      <p>Compares algorithmic latency, throughput overhead, and hardware-acceleration instructions (AES-NI) telemetry side-by-side.</p>
    </td>
  </tr>
  <tr>
    <td width="50%" valign="top">
      <h4>📁 Telemetry Audit Log</h4>
      <p>Persists operation history in an SQLite database with detailed statistics exporting capabilities (CSV, JSON, Plaintext).</p>
    </td>
    <td width="50%" valign="top">
      <h4>🎓 Cyber Lab Training Suite</h4>
      <p>Features an interactive assessment quiz module and a structured documentation archive for learning cryptography concepts.</p>
    </td>
  </tr>
</table>

---

## 🛠️ System Tech Stack

<table width="100%">
  <tr>
    <td width="50%" valign="top" style="border: 1px solid #1e293b; border-radius: 8px; padding: 16px; background-color: #0f172a;">
      <h3>💻 Frontend Architecture</h3>
      <ul>
        <li><strong>React 19 & TypeScript 6.0:</strong> Strict type safety with state-driven modular views.</li>
        <li><strong>Vite 8.1:</strong> Lightning-fast build and dev compilation with hot module reloading.</li>
        <li><strong>Tailwind CSS v4:</strong> Futuristic cybersecurity neon CSS style system.</li>
        <li><strong>Framer Motion:</strong> Immersive micro-animations for matrix cell swaps and shuffles.</li>
      </ul>
    </td>
    <td width="50%" valign="top" style="border: 1px solid #1e293b; border-radius: 8px; padding: 16px; background-color: #0f172a;">
      <h3>⚙️ Backend Infrastructure</h3>
      <ul>
        <li><strong>FastAPI (ASGI):</strong> Concurrent asynchronous Python API engine.</li>
        <li><strong>Uvicorn:</strong> Production ASGI server to handle local connections.</li>
        <li><strong>PyCryptodome:</strong> Pure-cryptography underlying engines for trace generation.</li>
        <li><strong>SQLite3:</strong> Integrated relational history storage for simulation audits.</li>
      </ul>
    </td>
  </tr>
</table>

---

## 📐 System Architecture

### Process Flow Diagram

```mermaid
flowchart TD
    subgraph "Frontend (React 19)"
        UI[Cyber Lab UI] -->|User Input| State[State Manager]
        State -->|REST API Payload| API_Client[HTTP Axios/Fetch Client]
        API_Client -->|JSON Trace Response| Render[Step-by-Step Animation Engine]
    end

    subgraph "Backend (FastAPI Server)"
        API_Client <==>|Port 8000| Endpoints[API Routing App]
        Endpoints -->|Run Cipher Trace| CryptEngine[DES / AES PyCryptodome Engines]
        CryptEngine -->|Compute Detailed Steps| EngineTrace[Block State Tracer]
        EngineTrace -->|Insert Exec Record| DB[("SQLite History DB")]
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
