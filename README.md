# DevCourt - Advanced Court Data Fetcher

A modern web application for fetching and displaying court case data from Indian courts, built with Tesla-inspired design and advanced web scraping capabilities.

## 🚀 Features

- **Advanced Case Search**: Search across multiple court databases including Delhi High Court and district courts
- **PDF Document Management**: Direct access to court orders and judgments in PDF format
- **Search History & Analytics**: Track your search history and analyze patterns
- **Tesla-Inspired Design**: Modern, responsive UI with smooth animations and transitions
- **Secure & Reliable**: Built with security best practices and comprehensive error handling
- **Cloud Ready**: Docker containerized for easy deployment

## 🛠️ Tech Stack

### Backend
- **Python 3.8+**: Core programming language
- **Flask**: Web framework for API development
- **SQLite**: Lightweight database for query logging
- **BeautifulSoup4**: Web scraping and HTML parsing
- **Requests**: HTTP library for API calls

### Frontend
- **HTML5 & CSS3**: Semantic markup with Tesla-inspired design
- **Vanilla JavaScript (ES6+)**: Modern JavaScript with async/await
- **AOS Animations**: Smooth scroll animations
- **Font Awesome**: Icon library

### Deployment
- **Docker**: Containerization for easy deployment
- **GitHub Integration**: Version control and CI/CD ready
- **Environment Variables**: Secure configuration management

## 📋 Prerequisites

- Python 3.8 or higher
- pip (Python package installer)
- Git (for cloning the repository)

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/DevanshSharma-GIT/DevCourt.git
cd DevCourt
```

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

### 3. Run the Application

```bash
python app.py
```

The application will be available at `http://localhost:8080`

## 🐳 Docker Deployment

### Build the Docker Image

```bash
docker build -t devcourt .
```

### Run the Container

```bash
docker run -p 8080:8080 devcourt
```

## 📁 Project Structure

```
DevCourt/
├── app.py                 # Main Flask application
├── requirements.txt       # Python dependencies
├── README.md             # Project documentation
├── templates/            # HTML templates
│   ├── base.html         # Base template
│   ├── index.html        # Homepage
│   ├── features.html     # Features page
│   └── about.html        # About page
├── static/               # Static assets
│   ├── css/
│   │   └── style.css     # Tesla-inspired CSS
│   └── js/
│       ├── main.js       # Main JavaScript
│       └── court-fetcher.js # Court data fetcher logic
└── court_data.db         # SQLite database (created automatically)
```

## 🎯 Court Integration

### Target Courts
- **Delhi High Court** (https://delhihighcourt.nic.in/)
- **District Courts** (https://districts.ecourts.gov.in/)

### Supported Case Types
- Civil Cases
- Criminal Cases
- Writ Petitions
- Appeals
- Revisions

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
FLASK_ENV=development
FLASK_DEBUG=True
SECRET_KEY=your-secret-key-here
```

### Database Configuration

The application uses SQLite by default. The database file (`court_data.db`) will be created automatically on first run.

## 🚀 API Endpoints

### Case Search
- **POST** `/api/case-search`
  - Search for case details
  - Request body: `{"case_type": "civil", "case_number": "123/2024", "filing_year": "2024"}`

### Search History
- **GET** `/api/search-history`
  - Retrieve recent search history

### File Downloads
- **GET** `/download/<filename>`
  - Download PDF files

## 🎨 Design Features

### Tesla-Inspired Design Elements
- Clean, minimalist interface
- Smooth animations and transitions
- Responsive design for all devices
- Modern color palette
- Typography using Inter font family

### Animations
- AOS (Animate On Scroll) library
- Floating card animations
- Hover effects
- Loading spinners
- Smooth page transitions

## 🔒 Security Features

- Input validation and sanitization
- SQL injection prevention
- Rate limiting protection
- Error handling and logging
- Secure file downloads

## 🧪 Testing

### Manual Testing
1. Open the application in your browser
2. Navigate to the court data fetcher section
3. Enter test case details
4. Verify search results and PDF downloads

### Automated Testing
```bash
# Run tests (when implemented)
python -m pytest tests/
```

## 📊 Performance

- Optimized database queries
- Lazy loading for images
- Minified CSS and JavaScript
- CDN for external libraries
- Caching strategies

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Developer

**Devansh Sharma**
- GitHub: [DevanshSharma-GIT](https://github.com/DevanshSharma-GIT)
- Portfolio: [Portfolio](https://devanshsharma-git.github.io/Portfolio-/)

## 🙏 Acknowledgments

- Tesla for design inspiration
- Flask community for the excellent framework
- Font Awesome for the icon library
- AOS library for smooth animations

## 📞 Support

For support and questions:
- Email: devansh.work6@gmail.com
- GitHub Issues: [Create an issue](https://github.com/DevanshSharma-GIT/DevCourt/issues)

## 🔄 Updates

### Version 1.0.0
- Initial release
- Basic court data fetching functionality
- Tesla-inspired UI design
- PDF download capabilities
- Search history tracking

---

**Note**: This application is built as part of the Think Act Rise Court internship assignment. The web scraping functionality is implemented for educational purposes and should be used responsibly in accordance with the target websites' terms of service. # DevCourt
