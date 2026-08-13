-- Nara Batch 005 promotion. Ray authorized 2026-08-13.
-- Does not change clusters.positioning.
-- Maps: files are in nara-floorplans/; Storage upload + media/media_links
-- still pending (no service-role key in the promote environment).

update clusters
set
  payment_plan = $pay$12% Down Payment (on booking) · 10% 1st Instalment (Nov 2021) · 10% 2nd Instalment (May 2022) · 10% 3rd Instalment (Nov 2022) · 8% 4th Instalment (May 2023) · 50% 5th Instalment (100% construction, estimated Dec 2024)$pay$,
  summary = $sum$THE VALLEY'S second townhouse community. NARA offers 3 and 4-bedroom townhouses in a choice of three contemporary designs, situated around a series of integrated parks.$sum$,
  body = $body$NARA is The Valley's second townhouse community, designed to capture your imagination. Envisage pleasant pathways, stunning landscaping and green spaces, complemented by an array of amenities.

NARA offers 3 and 4-bedroom townhouses in a choice of three contemporary designs. NARA townhouses are situated around a series of integrated parks, which offer ample space for you and your family to enjoy the moments that matter, outdoors.$body$
where slug = 'nara';
