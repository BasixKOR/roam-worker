// Config for our domain (where we want the Roam blog to live)
// and the start page (where we want our readers to land)
// Change these to suit your case!

import { translatePath } from "./path-translator";

// IMPORTANT: don't have '/' at the end of either domain or startPage
const config = {
  startPage: '/p/83vDxwXZk',
};

// Function that processes requests to the domain the worker is at
async function handleRequest(request: Request) {
  // Grab the request URL's pathname, we'll use it later
  const url = new URL(request.url);
  const targetPath = translatePath(url.pathname);

  // Send request through to roamresearch.com, get response
  let response = await fetch(`https://roamresearch.com${targetPath}`);
  
  if(url.pathname.startsWith('/p/') && !response.ok) console.log(response);

  if (targetPath.startsWith('/#/app')) {
    console.log(targetPath, response);
    return modifyResponse(response);
  } else {
    // For other types, simply return the response
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
        if (window.location.hash === "" && window.location.pathname.startsWith('/p/')) {
          history.replaceState(history.state, "", "/#/app/Basix/page/" + window.location.pathname.slice(3));
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
