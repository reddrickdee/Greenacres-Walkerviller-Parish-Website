#!/usr/bin/env bash
set -euo pipefail

OUT_DIR="${1:-./tmp/extract}"
mkdir -p "$OUT_DIR"

pages=(
  "https://www.gwparish.org.au/"
  "https://www.gwparish.org.au/Welcome/Parish_Priest.html"
  "https://www.gwparish.org.au/Welcome/Pastoral_Council.html"
  "https://www.gwparish.org.au/Welcome/Vision_And_Mission.html"
  "https://www.gwparish.org.au/Welcome/Parish_Prayer.html"
  "https://www.gwparish.org.au/Welcome/Pastoral_Council_Members.html"
  "https://www.gwparish.org.au/News/index.html"
  "https://www.gwparish.org.au/News/newsletters.html"
  "https://www.gwparish.org.au/services/StMonica.html"
  "https://www.gwparish.org.au/services/StMartin.html"
  "https://www.gwparish.org.au/services/CommunityServices.html"
  "https://www.gwparish.org.au/services/Spirituality.html"
  "https://www.gwparish.org.au/services/Volunteers.html"
  "https://www.gwparish.org.au/services/Sacraments.html"
  "https://www.gwparish.org.au/History/Parish_History.html"
  "https://www.gwparish.org.au/Contact_Us/index.html"
  "https://www.gwparish.org.au/Contact_Us/Parish_Schools.html"
)

for url in "${pages[@]}"; do
  slug=$(echo "$url" | sed -E 's#https?://##; s#[^a-zA-Z0-9]+#_#g')
  curl -L -s "$url" > "$OUT_DIR/${slug}.html"
  echo "Saved: $url"
done

echo "Extraction complete. Normalize outputs into assets/data/*.json."
