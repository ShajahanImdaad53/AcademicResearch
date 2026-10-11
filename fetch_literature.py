import requests
import json
import csv
import urllib.parse
from time import sleep

queries = [
    "personalized study schedule recommendation",
    "educational recommender systems machine learning",
    "machine learning student time management",
    "adaptive learning study planning"
]

results = []
seen_ids = set()

for query in queries:
    print(f"Querying OpenAlex for: {query}")
    url = f"https://api.openalex.org/works?search={urllib.parse.quote(query)}&per-page=10&sort=cited_by_count:desc"
    try:
        resp = requests.get(url, timeout=15)
        data = resp.json()
        for work in data.get('results', []):
            work_id = work.get('id')
            if work_id in seen_ids:
                continue
            seen_ids.add(work_id)
            
            title = work.get('title', 'Unknown Title')
            year = work.get('publication_year', 'Unknown Year')
            doi = work.get('doi', 'No DOI')
            authors = ", ".join([a.get('author', {}).get('display_name', '') for a in work.get('authorships', [])])
            venue = work.get('primary_location', {}).get('source', {})
            venue_name = venue.get('display_name', 'Unknown Venue') if venue else 'Unknown Venue'
            abstract_inv = work.get('abstract_inverted_index', {})
            abstract = ""
            if abstract_inv:
                words = max([max(pos) for pos in abstract_inv.values()]) + 1
                abs_arr = [""] * words
                for word, positions in abstract_inv.items():
                    for pos in positions:
                        abs_arr[pos] = word
                abstract = " ".join(abs_arr)
            
            results.append({
                'Title': title,
                'Authors': authors,
                'Year': year,
                'Venue': venue_name,
                'DOI': doi,
                'Abstract': abstract[:500] + "..." if len(abstract) > 500 else abstract
            })
    except Exception as e:
        print(f"Error querying {query}: {e}")
    sleep(1) # Be polite to API

# Save to JSON
with open('c:/Users/Imdaa/OneDrive/Desktop/Research/scratch_literature.json', 'w', encoding='utf-8') as f:
    json.dump(results, f, indent=2)

print(f"Fetched {len(results)} papers.")
