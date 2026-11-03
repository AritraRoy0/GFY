type JsonLdValue = Record<string, unknown>;

/**
 * Renders schema.org structured data. `<` is escaped so user-influenced strings can never close the script tag.
 */
export default function JsonLd({ data }: { data: JsonLdValue | JsonLdValue[] }) {
  const payload = Array.isArray(data) ? { "@context": "https://schema.org", "@graph": data } : { "@context": "https://schema.org", ...data };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(payload).replace(/</g, "\\u003c") }} />;
}
