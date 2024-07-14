import asyncio
from pyppeteer import launch
import pandas as pd
from urllib.parse import urlparse, unquote
import json
import os
from datetime import datetime
from pymongo import MongoClient

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

async def scrape_page(url):
    browser = await launch(headless=True)
    page = await browser.newPage()
    
    # Set cookies
    for cookie in cookies:
        await page.setCookie(cookie)
    
    await page.goto(url)
    await page.waitForSelector('product-group-item')

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

    data = []

    events = await page.querySelectorAll('product-group-item')[:20]  # Limit to 20 events

    for event in events:
        event_data = {}
        try:
            event_link = await event.querySelectorEval('a', 'el => el.href')
            event_data["Lien de l'offre"] = event_link if event_link else "RAS"
        except Exception as e:
            event_data["Lien de l'offre"] = "RAS"
            print(f"Error extracting event link: {e}")

        try:
            image_link = await event.querySelectorEval('img.listing-image', 'el => el.src')
            event_data["Lien de l'image"] = image_link if image_link else "RAS"
        except Exception as e:
            event_data["Lien de l'image"] = "RAS"
            print(f"Error extracting image link: {e}")

        try:
            title = await event.querySelectorEval('div.listing-details span', 'el => el.textContent')
            event_data["Titre de l'offre"] = title if title else "RAS"
        except Exception as e:
            event_data["Titre de l'offre"] = "RAS"
            print(f"Error extracting title: {e}")

        try:
            event_info = await event.querySelectorEval('div.listing-description span', 'el => el.textContent')
            num_events_text = await event.querySelectorEval('span.listing-data span:nth-child(2)', 'el => el.textContent.split(" ")[0]')
            num_events = int(num_events_text) if num_events_text.isdigit() else "RAS"
            tour = "Oui" if num_events != "RAS" and num_events > 1 else "Non"
            event_data["Nombre d'événements"] = num_events
            event_data["Tournée"] = tour
        except Exception as e:
            event_data["Nombre d'événements"] = "RAS"
            event_data["Tournée"] = "RAS"
            print(f"Error extracting number of events or tour status: {e}")

        try:
            price_text = await event.querySelectorEval('div.listing-event-status span', 'el => el.textContent')
            price = price_text.split('à partir de ')[1].split(',')[0] + ',' + price_text.split('à partir de ')[1].split(',')[1].split(' ')[0]
            event_data["Prix"] = price
        except Exception as e:
            event_data["Prix"] = "RAS"
            print(f"Error extracting price: {e}")

        try:
            dates = await event.querySelectorEval('span.listing-data span:first-child', 'el => el.textContent')
            date_parts = dates.split(' ─ ')
            start_date, end_date = date_parts if len(date_parts) == 2 else ("RAS", "RAS")
            event_data["Date début"] = start_date
            event_data["Date fin"] = end_date
        except Exception as e:
            event_data["Date début"] = "RAS"
            event_data["Date fin"] = "RAS"
            print(f"Error extracting dates: {e}")

        try:
            next_show_datetime = await event.querySelectorEval('div.padding-s span:nth-child(1)', 'el => el.textContent.trim()')
            next_show_date = next_show_datetime.split(",")[1].strip() if "," in next_show_datetime else next_show_datetime.strip()
            next_show_date = next_show_date.split(" ", 1)[1].strip() if " " in next_show_date else next_show_date.strip()
            event_data["Prochaine lieu, date et heure"] = next_show_datetime
            event_data["Prochaine date"] = next_show_date
        except Exception as e:
            event_data["Prochaine lieu, date et heure"] = "RAS"
            event_data["Prochaine date"] = "RAS"
            print(f"Error extracting next show date and time: {e}")

        event_data["Date et heure de scraping"] = scrape_datetime
        event_data["Catégorie"] = category
        event_data["Ville"] = city

        data.append(event_data)

        # Insert or update event data in MongoDB
        try:
            collection.update_one(
                {"Lien de l'offre": event_data["Lien de l'offre"]},  # Search condition
                {"$set": event_data},             # Data to update
                upsert=True                       # Insert if not found
            )
        except Exception as e:
            print(f"Error inserting or updating data in MongoDB: {e}")

    await browser.close()
    return data

async def main():
    all_data = []
    for url in urls:
        data = await scrape_page(url)
        all_data.extend(data)

    # Convert to DataFrame
    df = pd.DataFrame(all_data)

    # Export to Excel
    df.to_excel('fnacspectacles_events.xlsx', index=False)

    print("Scraping terminé et les données ont été exportées vers fnacspectacles_events.xlsx et MongoDB")

# Run the main function
asyncio.get_event_loop().run_until_complete(main())
