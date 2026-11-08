// Runtime-only Cloud proxy adaptation for Playwright's Node APIRequestContext.
// The checked-in portal verifier stays unchanged; TLS verification stays enabled.
const pw=require('/workspace/possibility/node_modules/playwright');
const launch=pw.chromium.launch.bind(pw.chromium);
pw.chromium.launch=async options=>{const browser=await launch(options);const newPage=browser.newPage.bind(browser);browser.newPage=options=>newPage({...options,proxy:{server:process.env.HTTPS_PROXY||process.env.HTTP_PROXY}});return browser};
require('/workspace/possibility/scripts/smoke-site.cjs');
