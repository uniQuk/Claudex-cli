awsm@awsms-Mac-mini qwen-code % npm install

> claudex-cli@0.14.5 prepare
> husky && npm run build && npm run bundle


> claudex-cli@0.14.5 build
> node scripts/build.js


> claudex-cli@0.14.5 generate
> node scripts/generate-git-commit-info.js


> @claudex/core@0.14.5 build
> node ../../scripts/build_package.js

Successfully copied files.

> @claudex/cli@0.14.5 build
> node ../../scripts/build_package.js

Successfully copied files.

> claudex-cli@0.14.5 bundle
> npm run generate && node esbuild.config.js && node scripts/copy_bundle_assets.js


> claudex-cli@0.14.5 generate
> node scripts/generate-git-commit-info.js

Copied sandbox profiles to dist/
Copying vendor directory...
Copied vendor directory to dist/
Copied bundled skills to dist/bundled/
Copied docs/users/ to dist/bundled/qc-helper/docs/

✅ All bundle assets copied to dist/

up to date, audited 999 packages in 4s

305 packages are looking for funding
  run `npm fund` for details

20 vulnerabilities (2 low, 4 moderate, 13 high, 1 critical)

To address issues that do not require attention, run:
  npm audit fix

To address all issues (including breaking changes), run:
  npm audit fix --force

Run `npm audit` for details.
awsm@awsms-Mac-mini qwen-code % npm audit    
# npm audit report

@hono/node-server  <=1.19.12
Severity: high
@hono/node-server has authorization bypass for protected static paths via encoded slashes in Serve Static Middleware - https://github.com/advisories/GHSA-wc8c-qw6v-h7f6
@hono/node-server: Middleware bypass via repeated slashes in serveStatic - https://github.com/advisories/GHSA-92pp-h63x-v22m
fix available via `npm audit fix`
node_modules/@hono/node-server

@modelcontextprotocol/sdk  <=1.25.3
Severity: high
Anthropic's MCP TypeScript SDK has a ReDoS vulnerability - https://github.com/advisories/GHSA-8r9q-7v3j-jr4g
@modelcontextprotocol/sdk has cross-client data leak via shared server/transport instance reuse - https://github.com/advisories/GHSA-345p-7cg4-v4c7
fix available via `npm audit fix`
packages/cli/node_modules/@modelcontextprotocol/sdk
packages/core/node_modules/@modelcontextprotocol/sdk

ajv  <6.14.0 || >=7.0.0-alpha.0 <8.18.0
Severity: moderate
ajv has ReDoS when using `$data` option - https://github.com/advisories/GHSA-2g4f-4pwh-qvx6
ajv has ReDoS when using `$data` option - https://github.com/advisories/GHSA-2g4f-4pwh-qvx6
fix available via `npm audit fix`
node_modules/ajv
node_modules/ajv-formats/node_modules/ajv
packages/cli/node_modules/ajv
packages/core/node_modules/ajv

brace-expansion  <1.1.13 || >=2.0.0 <2.0.3
Severity: moderate
brace-expansion: Zero-step sequence causes process hang and memory exhaustion - https://github.com/advisories/GHSA-f886-m6hf-6m8v
brace-expansion: Zero-step sequence causes process hang and memory exhaustion - https://github.com/advisories/GHSA-f886-m6hf-6m8v
fix available via `npm audit fix`
node_modules/@typescript-eslint/typescript-estree/node_modules/brace-expansion
node_modules/brace-expansion
node_modules/glob/node_modules/brace-expansion
node_modules/readdir-glob/node_modules/brace-expansion
node_modules/test-exclude/node_modules/brace-expansion

diff  6.0.0 - 8.0.2
jsdiff has a Denial of Service vulnerability in parsePatch and applyPatch - https://github.com/advisories/GHSA-73rr-hh4g-fpgx
fix available via `npm audit fix --force`
Will install diff@9.0.0, which is a breaking change
node_modules/diff

flatted  <=3.4.1
Severity: high
flatted vulnerable to unbounded recursion DoS in parse() revive phase - https://github.com/advisories/GHSA-25h7-pfq9-p65f
Prototype Pollution via parse() in NodeJS flatted - https://github.com/advisories/GHSA-rf6f-7fwh-wjgh
fix available via `npm audit fix`
node_modules/flatted

hono  <=4.12.13
Severity: high
Hono JWK Auth Middleware has JWT algorithm confusion when JWK lacks "alg" (untrusted header.alg fallback) - https://github.com/advisories/GHSA-3vhc-576x-3qv4
Hono JWT Middleware's JWT Algorithm Confusion via Unsafe Default (HS256) Allows Token Forgery and Auth Bypass - https://github.com/advisories/GHSA-f67f-6cw9-8mq4
Hono vulnerable to XSS through ErrorBoundary component  - https://github.com/advisories/GHSA-9r54-q6cx-xmh5
Hono cache middleware ignores "Cache-Control: private" leading to Web Cache Deception - https://github.com/advisories/GHSA-6wqw-2p9w-4vw4
Hono IPv4 address validation bypass in IP Restriction Middleware allows IP spoofing - https://github.com/advisories/GHSA-r354-f388-2fhh
Hono has an Arbitrary Key Read in Serve static Middleware (Cloudflare Workers Adapter) - https://github.com/advisories/GHSA-w332-q679-j88p
Hono added timing comparison hardening in basicAuth and bearerAuth - https://github.com/advisories/GHSA-gq3j-xvxp-8hrf
Hono Vulnerable to Cookie Attribute Injection via Unsanitized domain and path in setCookie() - https://github.com/advisories/GHSA-5pq2-9x2x-5p6w
Hono Vulnerable to SSE Control Field Injection via CR/LF in writeSSE() - https://github.com/advisories/GHSA-p6xx-57qc-3wxr
Hono vulnerable to arbitrary file access via serveStatic vulnerability  - https://github.com/advisories/GHSA-q5qw-h33p-qvwr
Hono vulnerable to Prototype Pollution possible through __proto__ key allowed in parseBody({ dot: true }) - https://github.com/advisories/GHSA-v8w9-8mx6-g223
Hono missing validation of cookie name on write path in setCookie() - https://github.com/advisories/GHSA-26pp-8wgv-hjvm
Hono: Non-breaking space prefix bypass in cookie name handling in getCookie() - https://github.com/advisories/GHSA-r5rp-j6wh-rvv4
Hono has incorrect IP matching in ipRestriction() for IPv4-mapped IPv6 addresses - https://github.com/advisories/GHSA-xpcf-pg52-r92g
Hono: Path traversal in toSSG() allows writing files outside the output directory - https://github.com/advisories/GHSA-xf4j-xp2r-rqqx
Hono: Middleware bypass via repeated slashes in serveStatic - https://github.com/advisories/GHSA-wmmm-f939-6g9c
hono Improperly Handles JSX Attribute Names Allows HTML Injection in hono/jsx SSR - https://github.com/advisories/GHSA-458j-xx4x-4375
fix available via `npm audit fix`
node_modules/hono

lodash  <=4.17.23
Severity: high
Lodash has Prototype Pollution Vulnerability in `_.unset` and `_.omit` functions - https://github.com/advisories/GHSA-xxjr-mmjv-4gpg
lodash vulnerable to Code Injection via `_.template` imports key names - https://github.com/advisories/GHSA-r5fr-rjxr-66jc
lodash vulnerable to Prototype Pollution via array path bypass in `_.unset` and `_.omit` - https://github.com/advisories/GHSA-f23m-r3pf-42rh
fix available via `npm audit fix`
node_modules/lodash

minimatch  <=3.1.3 || 5.0.0 - 5.1.7 || 9.0.0 - 9.0.6
Severity: high
minimatch has a ReDoS via repeated wildcards with non-matching literal in pattern - https://github.com/advisories/GHSA-3ppc-4f35-3m26
minimatch has a ReDoS via repeated wildcards with non-matching literal in pattern - https://github.com/advisories/GHSA-3ppc-4f35-3m26
minimatch has a ReDoS via repeated wildcards with non-matching literal in pattern - https://github.com/advisories/GHSA-3ppc-4f35-3m26
minimatch has ReDoS: matchOne() combinatorial backtracking via multiple non-adjacent GLOBSTAR segments - https://github.com/advisories/GHSA-7r86-cg39-jmmj
minimatch has ReDoS: matchOne() combinatorial backtracking via multiple non-adjacent GLOBSTAR segments - https://github.com/advisories/GHSA-7r86-cg39-jmmj
minimatch has ReDoS: matchOne() combinatorial backtracking via multiple non-adjacent GLOBSTAR segments - https://github.com/advisories/GHSA-7r86-cg39-jmmj
minimatch ReDoS: nested *() extglobs generate catastrophically backtracking regular expressions - https://github.com/advisories/GHSA-23c5-xmqv-rm74
minimatch ReDoS: nested *() extglobs generate catastrophically backtracking regular expressions - https://github.com/advisories/GHSA-23c5-xmqv-rm74
minimatch ReDoS: nested *() extglobs generate catastrophically backtracking regular expressions - https://github.com/advisories/GHSA-23c5-xmqv-rm74
fix available via `npm audit fix`
node_modules/@typescript-eslint/typescript-estree/node_modules/minimatch
node_modules/glob/node_modules/minimatch
node_modules/minimatch
node_modules/readdir-glob/node_modules/minimatch
node_modules/test-exclude/node_modules/minimatch

path-to-regexp  <=0.1.12 || 8.0.0 - 8.3.0
Severity: high
path-to-regexp vulnerable to Regular Expression Denial of Service via multiple route parameters - https://github.com/advisories/GHSA-37ch-88jc-xwx2
path-to-regexp vulnerable to Denial of Service via sequential optional groups - https://github.com/advisories/GHSA-j3q9-mxjg-w52f
path-to-regexp vulnerable to Regular Expression Denial of Service via multiple wildcards - https://github.com/advisories/GHSA-27v5-c462-wpq7
fix available via `npm audit fix`
node_modules/path-to-regexp
node_modules/router/node_modules/path-to-regexp
  express  4.0.0-rc1 - 4.21.2 || 5.0.0-alpha.1 - 5.0.1
  Depends on vulnerable versions of body-parser
  Depends on vulnerable versions of path-to-regexp
  Depends on vulnerable versions of qs
  node_modules/express

picomatch  <=2.3.1 || 4.0.0 - 4.0.3
Severity: high
Picomatch: Method Injection in POSIX Character Classes causes incorrect Glob Matching - https://github.com/advisories/GHSA-3v7f-55p6-f55p
Picomatch: Method Injection in POSIX Character Classes causes incorrect Glob Matching - https://github.com/advisories/GHSA-3v7f-55p6-f55p
Picomatch has a ReDoS vulnerability via extglob quantifiers - https://github.com/advisories/GHSA-c2c7-rcm5-vvqj
Picomatch has a ReDoS vulnerability via extglob quantifiers - https://github.com/advisories/GHSA-c2c7-rcm5-vvqj
fix available via `npm audit fix`
node_modules/picomatch
node_modules/tinyglobby/node_modules/picomatch
node_modules/vite/node_modules/picomatch
node_modules/vitest/node_modules/picomatch
packages/core/node_modules/picomatch

qs  <=6.14.1
Severity: moderate
qs's arrayLimit bypass in comma parsing allows denial of service - https://github.com/advisories/GHSA-w7fw-mjwx-w883
qs's arrayLimit bypass in its bracket notation allows DoS via memory exhaustion - https://github.com/advisories/GHSA-6rw7-vpxm-498p
fix available via `npm audit fix`
node_modules/qs
packages/cli/node_modules/qs
packages/core/node_modules/qs
  body-parser  1.19.0 - 1.20.3 || 2.0.0-beta.1 - 2.0.2
  Depends on vulnerable versions of qs
  node_modules/body-parser

rollup  4.0.0 - 4.58.0
Severity: high
Rollup 4 has Arbitrary File Write via Path Traversal - https://github.com/advisories/GHSA-mw96-cpmx-2vgc
fix available via `npm audit fix`
node_modules/rollup

simple-git  <=3.32.2
Severity: critical
simple-git Affected by Command Execution via Option-Parsing Bypass - https://github.com/advisories/GHSA-jcxm-m3jx-f287
simple-git has blockUnsafeOperationsPlugin bypass via case-insensitive protocol.allow config key enables RCE - https://github.com/advisories/GHSA-r275-fr43-pm7q
fix available via `npm audit fix`
node_modules/simple-git

tar  <=7.5.10
Severity: high
node-tar Vulnerable to Arbitrary File Creation/Overwrite via Hardlink Path Traversal - https://github.com/advisories/GHSA-34x7-hfp2-rc4v
node-tar is Vulnerable to Arbitrary File Overwrite and Symlink Poisoning via Insufficient Path Sanitization - https://github.com/advisories/GHSA-8qq5-rm4j-mr97
Arbitrary File Read/Write via Hardlink Target Escape Through Symlink Chain in node-tar Extraction - https://github.com/advisories/GHSA-83g3-92jg-28cx
tar has Hardlink Path Traversal via Drive-Relative Linkpath - https://github.com/advisories/GHSA-qffp-2rhf-9h96
node-tar Symlink Path Traversal via Drive-Relative Linkpath - https://github.com/advisories/GHSA-9ppj-qmqm-q256
Race Condition in node-tar Path Reservations via Unicode Ligature Collisions on macOS APFS - https://github.com/advisories/GHSA-r6q2-hw4h-h46w
fix available via `npm audit fix`
node_modules/tar

undici  <=6.23.0
Severity: high
Undici has an unbounded decompression chain in HTTP responses on Node.js Fetch API via Content-Encoding leads to resource exhaustion - https://github.com/advisories/GHSA-g9mf-h72j-4rw9
Undici: Malicious WebSocket 64-bit length overflows parser and crashes the client - https://github.com/advisories/GHSA-f269-vfmq-vjvj
Undici has an HTTP Request/Response Smuggling issue - https://github.com/advisories/GHSA-2mjp-6q6p-2qxm
Undici has Unbounded Memory Consumption in WebSocket permessage-deflate Decompression - https://github.com/advisories/GHSA-vrm6-8vpv-qv8q
Undici has Unhandled Exception in WebSocket Client Due to Invalid server_max_window_bits Validation - https://github.com/advisories/GHSA-v9p9-hfj2-hcw8
Undici has CRLF Injection in undici via `upgrade` option - https://github.com/advisories/GHSA-4992-7rv2-5pvq
fix available via `npm audit fix`
packages/cli/node_modules/undici
packages/core/node_modules/undici

vite  7.0.0 - 7.3.1
Severity: high
Vite middleware may serve files starting with the same name with the public directory - https://github.com/advisories/GHSA-g4jq-h2w9-997c
Vite's `server.fs` settings were not applied to HTML files - https://github.com/advisories/GHSA-jqfw-vq24-v9c3
vite allows server.fs.deny bypass via backslash on Windows - https://github.com/advisories/GHSA-93m4-6634-74q7
Vite Vulnerable to Path Traversal in Optimized Deps `.map` Handling - https://github.com/advisories/GHSA-4w7w-66w2-5vf9
Vite Vulnerable to Arbitrary File Read via Vite Dev Server WebSocket - https://github.com/advisories/GHSA-p9ff-h696-f583
fix available via `npm audit fix`
node_modules/vite

yaml  2.0.0 - 2.8.2
Severity: moderate
yaml is vulnerable to Stack Overflow via deeply nested YAML collections - https://github.com/advisories/GHSA-48c2-rrv3-qjmp
fix available via `npm audit fix`
node_modules/yaml

20 vulnerabilities (2 low, 4 moderate, 13 high, 1 critical)

To address issues that do not require attention, run:
  npm audit fix

To address all issues (including breaking changes), run:
  npm audit fix --force