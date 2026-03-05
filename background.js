/**
 * Listens for a message to scrape and export data. Sends "no_data" if no data is found,
 * or "no_editor" if no editor is found.
 */
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    async function handle() {
        const UWTab = await chrome.tabs.query({ url: '*://*.uw.edu/*' });
        const CronometerTab = await chrome.tabs.query({ url: '*://cronometer.com/*' });
        if (UWTab.length === 0) {
            return {status: "no_data"};
        }
        if (CronometerTab.length === 0) {
            return {status: "no_editor"};
        }
        const UWResponse = await chrome.tabs.sendMessage(UWTab[0].id, { type: 'SCRAPE' });
        if (UWResponse.status == "error") {
            return {status: "no_data"};
        }
        const CronometerResponse = await chrome.tabs.sendMessage(CronometerTab[0].id, { type: 'SET_NUTRIENTS', data: UWResponse.data });
        if (CronometerResponse.status == "error") {
            return {status: "no_editor"};
        }
        return {status: "success"};
    }
    handle().then(sendResponse);
    return true;
});