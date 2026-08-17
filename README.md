# CryptoVision Simulator 🔐

An interactive educational platform for understanding and visualizing cryptographic algorithms with real-time encryption/decryption capabilities.

![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)
![Python](https://img.shields.io/badge/Python-3.8+-blue.svg)
![React](https://img.shields.io/badge/React-19.2.7-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-6.0-blue.svg)

## Features ✨

- **DES Simulator** - Step-by-step visualization of Data Encryption Standard encryption/decryption
- **AES Simulator** - Interactive Advanced Encryption Standard implementation with visual feedback
- **Learning Center** - Comprehensive educational guides on cryptography concepts
- **Avalanche Effect Visualizer** - See how small input changes dramatically affect encrypted output
- **Algorithm Comparison** - Compare DES and AES performance and characteristics side-by-side
- **Quiz Module** - Test your cryptography knowledge with interactive quizzes
- **History Manager** - Track and review all previous encryption/decryption operations
- **Interactive Dashboard** - User-friendly navigation interface

## Tech Stack 🛠️

### Frontend
- **React** 19.2.7 - Modern UI framework
- **TypeScript** 6.0 - Type-safe JavaScript
- **Vite** 8.1 - Lightning-fast build tool
- **Tailwind CSS** 4.3.2 - Utility-first CSS framework
- **Framer Motion** 12.42.2 - Smooth animations
- **Lucide React** 1.24.0 - Beautiful icons

### Backend
- **FastAPI** 0.115.8 - High-performance Python web framework
- **Uvicorn** 0.34.0 - ASGI server
- **Pycryptodome** 3.21.0 - Cryptographic algorithms
- **SQLite** - Lightweight database for history storage

## Project Structure 📁

```
CryptoVision/
├── backend/
│   ├── app.py                          # FastAPI application & API endpoints
│   ├── requirements.txt                # Python dependencies
│   └── algorithms/
│       ├── des.py                      # DES encryption implementation
│       └── aes.py                      # AES encryption implementation
│
├── frontend/
│   ├── package.json                    # Node.js dependencies
│   ├── vite.config.ts                  # Vite build configuration
│   ├── tsconfig.json                   # TypeScript configuration
│   ├── index.html                      # HTML entry point
│   ├── README.md                       # Frontend documentation
│   └── src/
│       ├── main.tsx                    # React entry point
│       ├── App.tsx                     # Main application component
│       ├── App.css                     # Application styles
│       ├── index.css                   # Global styles
│       ├── assets/                     # Static assets
│       └── components/
│           ├── AES/
│           │   └── AesSimulator.tsx   # AES encryption simulator
│           ├── DES/
│           │   └── DesSimulator.tsx   # DES encryption simulator
│           ├── Dashboard/
│           │   └── Dashboard.tsx      # Main dashboard
│           ├── Learning/
│           │   └── LearningCenter.tsx # Educational content
│           ├── Quiz/
│           │   └── QuizModule.tsx     # Quiz functionality
│           ├── Visualizer/
│           │   ├── AvalancheEffect.tsx
│           │   └── CompareAlgorithms.tsx
│           ├── History/
│           │   └── HistoryManager.tsx # History tracking
│           └── Common/
│               └── Sidebar.tsx        # Navigation sidebar
│
└── .gitignore                          # Git ignore rules

```

## Installation & Setup 🚀

### Prerequisites
- **Node.js** 16+ (for frontend)
- **Python** 3.8+ (for backend)
- **npm** or **yarn** (package manager)

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Create a virtual environment (optional but recommended):
```bash
python -m venv venv
source venv/Scripts/activate  # On Windows
# or
source venv/bin/activate      # On macOS/Linux
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Start the FastAPI server:
```bash
uvicorn app:app --reload
```

**Backend runs on:** `http://localhost:8000`

### Frontend Setup

1. In a new terminal, navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

**Frontend runs on:** `http://localhost:5173`

### Access the Application

Open your browser and visit: `http://localhost:5173`

## Available Scripts 📝

### Frontend
| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build optimized production bundle |
| `npm run lint` | Run linter for code quality |
| `npm run preview` | Preview production build |

### Backend
| Command | Description |
|---------|-------------|
| `uvicorn app:app --reload` | Start development server with auto-reload |
| `uvicorn app:app --host 0.0.0.0 --port 8000` | Start on all network interfaces |

## API Endpoints 🔌

The FastAPI backend provides the following endpoints:

- `POST /encrypt/des` - Encrypt data using DES
- `POST /decrypt/des` - Decrypt data using DES
- `POST /encrypt/aes` - Encrypt data using AES
- `POST /decrypt/aes` - Decrypt data using AES
- `GET /history` - Retrieve encryption history
- `POST /compare` - Compare DES and AES algorithms
- `GET /visualization/avalanche` - Get avalanche effect data

## How to Use 🎯

1. **Encryption/Decryption**: Select an algorithm (DES or AES), enter your plaintext, and visualize the encryption process in real-time.

2. **Learning**: Visit the Learning Center to understand the fundamentals of DES and AES algorithms.

3. **Visualization**: Explore the Avalanche Effect to see how sensitive cryptographic algorithms are to input changes.

4. **Comparison**: Compare the characteristics and performance of DES vs AES side-by-side.

5. **Quiz**: Test your knowledge with interactive cryptography quizzes.

6. **History**: Review all your previous encryption/decryption operations.

## Contributing 🤝

Contributions are welcome! To contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License 📄

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

## Author ✍️

**Sudhanshu Keskar**
- GitHub: [@sudhanshu-cyb](https://github.com/sudhanshu-cyb)
- Email: sudhanshu.keskar.cyb@ghrcemp.raisoni.net

## Support 💬

If you encounter any issues or have questions, please open an [Issue](https://github.com/sudhanshu-cyb/Cryptovision/issues) on GitHub.

## Acknowledgments 🙏

- FastAPI documentation and community
- React and TypeScript documentation
- Pycryptodome library
- Educational resources on cryptography

---

**Happy Learning! 🚀**
