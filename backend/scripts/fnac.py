from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
import pandas as pd
from urllib.parse import urlparse, unquote
import json
import time
import os
from datetime import datetime
from pymongo import MongoClient

# Setup WebDriver for Linux environment
service = Service(executable_path='/usr/local/bin/chromedriver')
options = webdriver.ChromeOptions()
options.add_argument('--headless')
options.add_argument('--no-sandbox')
options.add_argument('--disable-dev-shm-usage')

driver = webdriver.Chrome(service=service, options=options)
driver.maximize_window()

# MongoDB setup
mongo_uri = "mongodb+srv://leotamen22:FxGkjVn5uBpXPsLL@clustertyep.grmvsbh.mongodb.net/Tyep?retryWrites=true&w=majority"  # Replace with your MongoDB URI
client = MongoClient(mongo_uri)
db = client["Tyep"]  # Replace with your database name
collection = db["fnacscrap"]

# List of URLs to scrape
urls = [
    "https://www.fnacspectacles.com/city/paris-369/concerts-festivals-93/comedie-musicale-1269/",
    "https://www.fnacspectacles.com/city/paris-369/spectacles-94/spectacles-pour-enfants-2135/",
    "https://www.fnacspectacles.com/city/paris-369/concerts-festivals-93/rnb-soul-funk-gospel-reggae-2047/",
    "https://www.fnacspectacles.com/city/paris-369/concerts-festivals-93/jazz-2036/",
    "https://www.fnacspectacles.com/city/paris-369/humour-186/humoristes-one-man-show-2060/",
]

# Load cookies from the file
cookies_file_path = os.path.join(os.path.dirname(__file__), "cookies.json")
with open(cookies_file_path, "r") as file:
    cookies = json.load(file)

data = []

for url in urls:
    # Open the target page
    driver.get(url)

    # Add cookies to the browser
    for cookie in cookies:
        driver.add_cookie(cookie)

    # Refresh the page after loading cookies
    driver.refresh()

    # Wait for the page to load
    time.sleep(5)

    # Function to extract city and category from the URL
    def extract_city_and_category(url):
        path = urlparse(url).path
        parts = unquote(path).split('/')
        city = parts[2].split('-')[0]
        category = parts[-2].rsplit('-', 1)[0]  # Remove the trailing number
        return city, category

    # Extract city and category from the URL
    city, category = extract_city_and_category(url)

    # Get the current date and time for scraping
    scrape_datetime = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    # Extract event details
    events = driver.find_elements(By.CSS_SELECTOR, 'product-group-item')[:20]  # Limit to 20 events

    for event in events:
        try:
            event_link = event.find_element(By.CSS_SELECTOR, 'a').get_attribute('href')
        except Exception as e:
            event_link = "RAS"
            print(f"Error extracting event link: {e}")

        try:
            image_element = event.find_element(By.CSS_SELECTOR, 'img.listing-image')
            image_link = image_element.get_attribute('src') if image_element.get_attribute('src') else image_element.get_attribute('data-src')
        except Exception as e:
            image_link = "RAS"
            print(f"Error extracting image link: {e}")

        try:
            title = event.find_element(By.CSS_SELECTOR, 'div.listing-details span').text
        except Exception as e:
            title = "RAS"
            print(f"Error extracting title: {e}")

        try:
            event_info = event.find_element(By.CSS_SELECTOR, 'div.listing-description span').text
            num_events_text = event.find_element(By.CSS_SELECTOR, 'span.listing-data span:nth-child(2)').text.split(' ')[0]
            num_events = int(num_events_text) if num_events_text.isdigit() else "RAS"
            tour = "Oui" if num_events != "RAS" and num_events > 1 else "Non"
        except Exception as e:
            num_events = "RAS"
            tour = "RAS"
            print(f"Error extracting number of events or tour status: {e}")

        try:
            price_text = event.find_element(By.CSS_SELECTOR, 'div.listing-event-status span').text
            price = price_text.split('à partir de ')[1].split(',')[0] + ',' + price_text.split('à partir de ')[1].split(',')[1].split(' ')[0]  # Correctly extract price
        except Exception as e:
            price = "RAS"
            print(f"Error extracting price: {e}")

        try:
            dates = event.find_element(By.CSS_SELECTOR, 'span.listing-data span:first-child').text
            date_parts = dates.split(' ─ ')
            if len(date_parts) == 2:
                start_date, end_date = date_parts
            else:
                start_date, end_date = "RAS", "RAS"
        except Exception as e:
            start_date, end_date = "RAS", "RAS"
            print(f"Error extracting dates: {e}")

        try:
            next_show_element = event.find_element(By.CSS_SELECTOR, 'div.padding-s span:nth-child(1)')
            next_show_datetime = next_show_element.text.strip()
            next_show_date = next_show_datetime.split(",")[1].strip() if "," in next_show_datetime else next_show_datetime.strip()

            # Remove weekday prefix if it exists
            if " " in next_show_date:
                next_show_date = next_show_date.split(" ", 1)[1].strip()
        except Exception as e:
            next_show_datetime = "RAS"
            next_show_date = "RAS"
            print(f"Error extracting next show date and time: {e}")

        event_data = {
            "Date et heure de scraping": scrape_datetime,
            "Lien de l'offre": event_link,
            "Lien de l'image": image_link,
            "Titre de l'offre": title,
            "Catégorie": category,
            "Ville": city,
            "Nombre d'événements": num_events,
            "Tournée": tour,
            "Prix": price,
            "Date début": start_date,
            "Date fin": end_date,
            "Prochaine lieu, date et heure": next_show_datetime,
            "Prochaine date": next_show_date
        }

        data.append(event_data)

        # Insert or update event data in MongoDB
        try:
            collection.update_one(
                {"Lien de l'offre": event_link},  # Search condition
                {"$set": event_data},             # Data to update
                upsert=True                       # Insert if not found
            )
        except Exception as e:
            print(f"Error inserting or updating data in MongoDB: {e}")

# Close the driver
driver.quit()

# Convert to DataFrame
df = pd.DataFrame(data)

# Export to Excel
df.to_excel('fnacspectacles_events.xlsx', index=False)

print("Scraping terminé et les données ont été exportées vers fnacspectacles_events.xlsx et MongoDB")
