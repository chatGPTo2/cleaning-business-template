import AdminShell from "../AdminShell";
import { requireAdmin } from "@/lib/admin-auth";
import { CITIES, ALL_SERVICES, totalSuburbPages, totalServiceSuburbPages } from "@/lib/suburb-seo";

const BASE_URL = "https://tasprocleaning.com.au";

export default async function SeoPages() {
  await requireAdmin();

  const suburbTotal = totalSuburbPages();
  const serviceSuburbTotal = totalServiceSuburbPages();
  const grandTotal = suburbTotal + serviceSuburbTotal;

  return (
    <AdminShell section="seo">
      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3 mb-8">
        {[
          { label: "Total SEO pages", value: grandTotal },
          { label: "Suburb landing pages", value: suburbTotal },
          { label: "Service + suburb pages", value: serviceSuburbTotal },
        ].map((s) => (
          <div key={s.label} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-1">{s.label}</p>
            <p className="text-4xl font-bold text-navy-950">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Per-city breakdown */}
      {CITIES.map((city) => {
        const cityServices = ALL_SERVICES.filter((s) => (city.services as string[]).includes(s.slug));
        const citySuburbPages = city.suburbs.length;
        const cityServicePages = city.suburbs.length * city.services.length;

        return (
          <div key={city.slug} className="mb-8">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <h2 className="text-lg font-bold text-navy-950">{city.name}, {city.stateCode}</h2>
                {city.fullService && (
                  <span className="rounded-full bg-teal-50 px-2.5 py-0.5 text-xs font-semibold text-teal-700 border border-teal-200">
                    Full service
                  </span>
                )}
              </div>
              <div className="flex gap-4 text-sm text-slate-500">
                <span>{city.suburbs.length} suburbs</span>
                <span>·</span>
                <span>{citySuburbPages + cityServicePages} pages total</span>
              </div>
            </div>

            {/* Services available */}
            <div className="mb-3 flex flex-wrap gap-2">
              {cityServices.map((svc) => (
                <span key={svc.slug} className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                  {svc.icon} {svc.name}
                </span>
              ))}
            </div>

            {/* Suburb table */}
            <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-100 text-xs uppercase tracking-wider text-slate-500">
                  <tr>
                    <th className="px-4 py-3">Suburb</th>
                    <th className="px-4 py-3">Suburb page</th>
                    <th className="px-4 py-3">Service pages</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {city.suburbs.map((suburb) => (
                    <tr key={suburb.slug} className="hover:bg-slate-50">
                      <td className="px-4 py-3 font-medium text-navy-950">{suburb.name}</td>
                      <td className="px-4 py-3">
                        <a
                          href={`${BASE_URL}/locations/${city.slug}/${suburb.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-teal-700 hover:underline text-xs"
                        >
                          /locations/{city.slug}/{suburb.slug}
                        </a>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1.5">
                          {cityServices.map((svc) => (
                            <a
                              key={svc.slug}
                              href={`${BASE_URL}/locations/${city.slug}/${suburb.slug}/${svc.slug}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 rounded bg-slate-100 px-2 py-0.5 text-xs text-slate-600 hover:bg-teal-50 hover:text-teal-700 transition-colors"
                              title={svc.name}
                            >
                              {svc.icon} {svc.name}
                            </a>
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      })}

      {/* Sitemap tip */}
      <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm text-blue-800">
        <p className="font-semibold mb-1">Submit to Google Search Console</p>
        <p>
          All {grandTotal} pages are automatically included in your sitemap at{" "}
          <a href={`${BASE_URL}/sitemap.xml`} target="_blank" rel="noopener noreferrer" className="underline font-medium">
            tasprocleaning.com.au/sitemap.xml
          </a>
          . Submit this URL in Google Search Console to get all pages indexed faster.
        </p>
      </div>
    </AdminShell>
  );
}
