-- Nara Batch 004 — brochure facade copy. Ray 2026-08-13.
-- source_id already on the three facade_style_descriptions rows.
-- Verbatim from BROCHURE.pdf pp. 11 / 13 / 15.

update facade_style_descriptions f
set description = v.description
from clusters c,
(values
  ('Aston', $a$Contemporary architecture and large windows provide an abundance of natural light and wonderful views of pleasant surroundings. ASTON gives you everything you could dream of in a family home.$a$),
  ('Palma', $p$The 3 and 4-bedroom townhouses of PALMA are modern with a stylishly minimalist design aesthetic, complemented by a large window that allows light to flood in. If you envision living the good life in a contemporary family villa, then PALMA is your dream home made a reality.$p$),
  ('Charm', $c$This limited collection of CHARM townhouses is certainly worthy of its name. The crisp contemporary architectural design and fresh white façades make these townhouses the epitome of charming. The modern design and surroundings of CHARM offer residents the promise of a wonderful lifestyle in the perfect setting.$c$)
) as v(style_name, description)
where c.slug = 'nara'
  and f.cluster_id = c.id
  and f.style_name = v.style_name;
