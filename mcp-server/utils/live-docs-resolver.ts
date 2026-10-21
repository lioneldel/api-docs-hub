/**
 * Live Web Documentation Resolver:
 * Scans the live web (NPM Developer Registries, Official Repos, and Search)
 * to retrieve real-time documentation, SDK install commands, endpoints,
 * and quickstart code for ANY API on Earth!
 */

export interface LiveDocResult {
  apiName: string;
  found: boolean;
  documentationText: string;
  sourceUrl?: string;
}

export async function fetchLiveApiDocumentation(apiName: string): Promise<LiveDocResult> {
  try {
    const clean = apiName.replace(/[-_]/g, ' ').replace(/\bapi\b/gi, '').trim();
    const brand = clean.split(/\s+/)[0];

    // 1. Search NPM package registry (official developer SDKs and full README documentation)
    const npmSearchUrl = `https://registry.npmjs.org/-/v1/search?text=${encodeURIComponent(clean + ' api')}&size=3`;
    const npmRes = await fetch(npmSearchUrl);

    if (npmRes.ok) {
      const npmData = (await npmRes.json()) as {
        objects: Array<{
          package: {
            name: string;
            description?: string;
            links?: { homepage?: string; repository?: string; npm?: string };
          };
        }>;
      };

      if (npmData.objects && npmData.objects.length > 0) {
        const topPkg = npmData.objects[0].package;

        // Fetch full package details to extract the official README
        try {
          const pkgDetailRes = await fetch(`https://registry.npmjs.org/${topPkg.name}`);
          if (pkgDetailRes.ok) {
            const pkgDetail = (await pkgDetailRes.json()) as { readme?: string; homepage?: string };
            const readme = pkgDetail.readme || '';
            const cleanReadme = readme.replace(/<!--[\s\S]*?-->/g, '').trim();
            const summarySnippet = cleanReadme.slice(0, 1500);

            const docText = `# 🌐 Live Web Documentation: ${apiName}\n\n` +
              `> **Official SDK Package**: \`${topPkg.name}\`\n` +
              `> **Install Command**: \`npm install ${topPkg.name}\`\n` +
              `> **Documentation Portal**: [${topPkg.links?.homepage || topPkg.links?.npm || 'NPM Package'}](${topPkg.links?.homepage || topPkg.links?.npm})\n\n` +
              `### 📦 Package Overview\n${topPkg.description || ''}\n\n` +
              `### 🚀 Official SDK Quickstart & Documentation Extract\n\n` +
              `\`\`\`markdown\n${summarySnippet}\n\`\`\`\n\n` +
              `*Note: This documentation was fetched live via developer registry for "${apiName}".*`;

            return {
              apiName,
              found: true,
              documentationText: docText,
              sourceUrl: topPkg.links?.homepage || topPkg.links?.npm,
            };
          }
        } catch {
          // fallback to summary
        }
      }
    }

    // 2. Fallback to DDG Lite search if NPM yields no direct match
    const ddgQuery = `${clean} API`;
    const postBody = new URLSearchParams({ q: ddgQuery }).toString();
    const ddgRes = await fetch('https://lite.duckduckgo.com/lite/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
      body: postBody,
    });

    if (ddgRes.ok) {
      const html = await ddgRes.text();
      const linkMatches = [
        ...html.matchAll(
          /<a[^>]*class=['"]result-link['"][^>]*href=['"]([^'"]+)['"][^>]*>([\s\S]*?)<\/a>|<a[^>]*href=['"]([^'"]+)['"][^>]*class=['"]result-link['"][^>]*>([\s\S]*?)<\/a>/gi
        ),
      ];

      const links: { url: string; title: string }[] = [];
      for (const m of linkMatches) {
        const url = m[1] || m[3];
        const title = (m[2] || m[4] || '').replace(/<[^>]+>/g, '').trim();
        if (url && !url.includes('duckduckgo.com') && links.length < 5) {
          links.push({ url, title });
        }
      }

      if (links.length > 0) {
        let docSummary = `# 🌐 Live Web Documentation: ${apiName}\n\n`;
        docSummary += `### 🔗 Direct Official Portal & References:\n`;
        links.forEach((l, i) => {
          docSummary += `${i + 1}. [${l.title}](${l.url})\n`;
        });
        docSummary += `\n*Note: This documentation was dynamically discovered live on the web for "${apiName}".*`;

        return {
          apiName,
          found: true,
          documentationText: docSummary,
          sourceUrl: links[0]?.url,
        };
      }
    }

    return {
      apiName,
      found: false,
      documentationText: `No live documentation matches found on the web for "${apiName}".`,
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return {
      apiName,
      found: false,
      documentationText: `Live web documentation search error: ${msg}`,
    };
  }
}
