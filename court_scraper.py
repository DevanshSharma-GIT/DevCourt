"""
Real Court Data Scraper for DevCourt
Handles actual web scraping of court websites
"""

import requests
from bs4 import BeautifulSoup
import re
import time
import random
from urllib.parse import urljoin, urlparse
import logging

logger = logging.getLogger(__name__)

class CourtScraper:
    def __init__(self):
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.5',
            'Accept-Encoding': 'gzip, deflate',
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1',
        })
        
    def scrape_delhi_high_court(self, case_type, case_number, filing_year):
        """
        Scrape Delhi High Court website for case details
        """
        try:
            # Delhi High Court search URL
            base_url = "https://delhihighcourt.nic.in/"
            search_url = "https://delhihighcourt.nic.in/case_status"
            
            # Prepare search data
            search_data = {
                'case_type': case_type,
                'case_number': case_number,
                'filing_year': filing_year,
                'submit': 'Search'
            }
            
            # Add random delay to avoid rate limiting
            time.sleep(random.uniform(1, 3))
            
            # Make the search request
            response = self.session.post(search_url, data=search_data, timeout=30)
            response.raise_for_status()
            
            # Parse the response
            soup = BeautifulSoup(response.content, 'html.parser')
            
            # Extract case details (this would need to be customized based on actual HTML structure)
            case_data = self._parse_delhi_high_court_response(soup)
            
            return case_data
            
        except Exception as e:
            logger.error(f"Error scraping Delhi High Court: {str(e)}")
            return None
    
    def scrape_district_court(self, case_type, case_number, filing_year, district="faridabad"):
        """
        Scrape District Court website for case details
        """
        try:
            # District Court search URL
            base_url = f"https://districts.ecourts.gov.in/{district}"
            search_url = f"{base_url}/case_status"
            
            # Prepare search data
            search_data = {
                'case_type': case_type,
                'case_number': case_number,
                'filing_year': filing_year,
                'submit': 'Search'
            }
            
            # Add random delay
            time.sleep(random.uniform(1, 3))
            
            # Make the search request
            response = self.session.post(search_url, data=search_data, timeout=30)
            response.raise_for_status()
            
            # Parse the response
            soup = BeautifulSoup(response.content, 'html.parser')
            
            # Extract case details
            case_data = self._parse_district_court_response(soup)
            
            return case_data
            
        except Exception as e:
            logger.error(f"Error scraping District Court: {str(e)}")
            return None
    
    def _parse_delhi_high_court_response(self, soup):
        """
        Parse Delhi High Court search results
        This is a template - actual selectors would need to be updated based on real HTML structure
        """
        try:
            case_data = {
                'parties': {},
                'filing_date': None,
                'next_hearing': None,
                'case_status': 'Unknown',
                'orders': []
            }
            
            # Extract petitioner and respondent (example selectors)
            petitioner_elem = soup.find('td', string=re.compile(r'petitioner', re.I))
            if petitioner_elem and petitioner_elem.find_next_sibling('td'):
                case_data['parties']['petitioner'] = petitioner_elem.find_next_sibling('td').get_text(strip=True)
            
            respondent_elem = soup.find('td', string=re.compile(r'respondent', re.I))
            if respondent_elem and respondent_elem.find_next_sibling('td'):
                case_data['parties']['respondent'] = respondent_elem.find_next_sibling('td').get_text(strip=True)
            
            # Extract filing date
            filing_date_elem = soup.find('td', string=re.compile(r'filing.*date', re.I))
            if filing_date_elem and filing_date_elem.find_next_sibling('td'):
                case_data['filing_date'] = filing_date_elem.find_next_sibling('td').get_text(strip=True)
            
            # Extract next hearing date
            hearing_elem = soup.find('td', string=re.compile(r'next.*hearing', re.I))
            if hearing_elem and hearing_elem.find_next_sibling('td'):
                case_data['next_hearing'] = hearing_elem.find_next_sibling('td').get_text(strip=True)
            
            # Extract case status
            status_elem = soup.find('td', string=re.compile(r'status', re.I))
            if status_elem and status_elem.find_next_sibling('td'):
                case_data['case_status'] = status_elem.find_next_sibling('td').get_text(strip=True)
            
            # Extract orders/judgments
            orders_table = soup.find('table', {'class': 'orders'}) or soup.find('table', string=re.compile(r'orders', re.I))
            if orders_table:
                for row in orders_table.find_all('tr')[1:]:  # Skip header
                    cells = row.find_all('td')
                    if len(cells) >= 3:
                        order = {
                            'date': cells[0].get_text(strip=True),
                            'title': cells[1].get_text(strip=True),
                            'pdf_link': urljoin(base_url, cells[2].find('a')['href']) if cells[2].find('a') else None
                        }
                        case_data['orders'].append(order)
            
            return case_data
            
        except Exception as e:
            logger.error(f"Error parsing Delhi High Court response: {str(e)}")
            return None
    
    def _parse_district_court_response(self, soup):
        """
        Parse District Court search results
        This is a template - actual selectors would need to be updated based on real HTML structure
        """
        try:
            case_data = {
                'parties': {},
                'filing_date': None,
                'next_hearing': None,
                'case_status': 'Unknown',
                'orders': []
            }
            
            # Similar parsing logic as Delhi High Court but with district-specific selectors
            # This would need to be customized based on actual district court HTML structure
            
            return case_data
            
        except Exception as e:
            logger.error(f"Error parsing District Court response: {str(e)}")
            return None
    
    def handle_captcha(self, soup):
        """
        Handle CAPTCHA if encountered
        """
        captcha_img = soup.find('img', {'alt': re.compile(r'captcha', re.I)})
        if captcha_img:
            logger.warning("CAPTCHA detected - manual intervention may be required")
            # In a real implementation, you might:
            # 1. Use a CAPTCHA solving service
            # 2. Implement manual CAPTCHA solving
            # 3. Use browser automation tools like Selenium
            return False
        return True
    
    def get_case_details(self, case_type, case_number, filing_year, court_type="delhi_high"):
        """
        Main method to get case details from specified court
        """
        try:
            if court_type == "delhi_high":
                return self.scrape_delhi_high_court(case_type, case_number, filing_year)
            elif court_type == "district":
                return self.scrape_district_court(case_type, case_number, filing_year)
            else:
                logger.error(f"Unsupported court type: {court_type}")
                return None
                
        except Exception as e:
            logger.error(f"Error getting case details: {str(e)}")
            return None

# Usage example:
# scraper = CourtScraper()
# case_data = scraper.get_case_details("civil", "123/2024", "2024", "delhi_high") 