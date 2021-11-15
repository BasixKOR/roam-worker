// Config for our domain (where we want the Roam blog to live)
// and the start page (where we want our readers to land)
// Change these to suit your case!
// IMPORTANT: don't have '/' at the end of either domain or startPage
const config = {
  domain: 'knowledge.basix.tech',
  startPage: '/#/app/Basix/page/83vDxwXZk',
};

// Function that processes requests to the domain the worker is at
async function handleRequest(request: Request) {
  // Grab the request URL's pathname, we'll use it later
  const url = new URL(request.url);
  const targetPath = url.pathname;

  // Send request through to roamresearch.com, get response
  let response = await fetch(`https://roamresearch.com${targetPath}`);

  // For the root path, modify the response to send to startPage
  if (targetPath === '/') {
    return modifyResponse(response);
  } else {
    // For other paths, simply return the response
    return response;
  }
}

// Modify the response for root path
async function modifyResponse(response: Response) {
  return new HTMLRewriter().on('head', new HeadRewriter()).transform(response);
}

// Change the head of the HTML document
class HeadRewriter {
  element(element: Element) {
    element.prepend(
      `<script>
        if (window.location.hash === "" && window.location.host === "${config.domain}") {
          history.pushState(history.state, "", "${config.startPage}");
        }
      </script>`,
      {
        html: true,
      },
    );
  }
}

// Listen for requests
addEventListener('fetch', (event) => {
  event.respondWith(handleRequest(event.request));
});
