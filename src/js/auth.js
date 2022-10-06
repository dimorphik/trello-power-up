import { gapi } from "gapi-script";
import jwt_decode from "jwt-decode";

console.log("got here");
const auth = {
  user: null,
  tokenClient: null,
  test: "pineapple",
};

const doGoogleLogin = () => {
  console.log("doGoogleLogin");
  console.log(window.google);

  /* global google */
  console.log("calling google.accounts.id.initialize");
  google.accounts.id.initialize({
    client_id: CLIENT_ID,
    callback: handleCallbackResponse,
    prompt_parent_id: "signInDiv",
    allowed_parent_origin: "https://glowing-centaur-cb746f.netlify.app",
  });

  console.log("calling google.accounts.id.prompt");
  google.accounts.id.prompt((notification) => {
    console.log("prompt callback! received notification:", notification);
  });

  /*
    console.log("calling google.accounts.id.renderButton");
    google.accounts.id.renderButton(document.getElementById("signInDiv"), {
      theme: "outline",
      size: "large",
    });
  */
  const initGapi = async () => {
    console.log("calling gapi.client.init");
    await gapi.client.init({
      // NOTE: OAuth2 'scope' and 'client_id' parameters have moved to initTokenClient().
    });

    console.log("loading discovery documents");
    gapi.client.load("https://docs.googleapis.com/$discovery/rest?version=v1");
    gapi.client.load(
      "https://sheets.googleapis.com/$discovery/rest?version=v4"
    );

    console.log(gapi.client);
  };

  console.log("calling initGapi");
  gapi.load("client", initGapi);
};

export default auth;
