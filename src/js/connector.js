import { gapi } from "gapi-script";

import auth from "./auth";

const CLIENT_ID =
  "724763935854-n4srv5d0t7hahet7hh5ef3hg3sac4r4v.apps.googleusercontent.com";
const SCOPES = [
  "https://www.googleapis.com/auth/drive.file",
  "https://www.googleapis.com/auth/documents",
  "https://www.googleapis.com/auth/drive",
  "https://www.googleapis.com/auth/spreadsheets",
].join(" ");

var GRAY_ICON =
  "https://cdn.hyperdev.com/us-east-1%3A3d31b21c-01a0-4da2-8827-4bc6e88b7618%2Ficon-gray.svg";
var WHITE_ICON =
  "https://cdn.hyperdev.com/us-east-1%3A3d31b21c-01a0-4da2-8827-4bc6e88b7618%2Ficon-white.svg";
var BLACK_ICON =
  "https://cdn.hyperdev.com/us-east-1%3A3d31b21c-01a0-4da2-8827-4bc6e88b7618%2Ficon-black.svg";

window.TrelloPowerUp.initialize({
  "authorization-status": function (t, options) {
    // return a promise that resolves to the object with
    // a property 'authorized' being true/false
    // you can also return the object synchronously if you know
    // the answer synchronously
    console.log(`auth.test is ${auth.test}`);
    return new TrelloPowerUp.Promise((resolve) =>
      resolve({ authorized: false })
    );
  },
  "show-authorization": function (t, options) {
    // return what to do when a user clicks the 'Authorize Account' link
    // from the Power-Up gear icon which shows when 'authorization-status'
    // returns { authorized: false }
    // in this case we would open a popup
    return t.popup({
      title: "Google Apps Authorization",
      url: "./auth.html",
      height: 140,
    });
  },
  "board-buttons": function (t, opts) {
    return [
      {
        // we can either provide a button that has a callback function
        icon: {
          dark: WHITE_ICON,
          light: BLACK_ICON,
        },
        text: "Callback",
        callback: createFile,
        condition: "edit",
      },
    ];
  },
});

/**************
 * Google Crud
 **************/

const handleCallbackResponse = async (response) => {
  console.log("handleCallbackResponse");
  /*  
  const credential = response.credential;

  user = jwt_decode(credential);

  document.getElementById("signInDiv").hidden = true;

  const client = google.accounts.oauth2.initTokenClient({
    client_id: CLIENT_ID,
    scope: SCOPES,
  });

  tokenClient = client;
*/
};

const createFile = () => {
  const callbackFn = async (tokenResponse) => {
    console.log("gapi.client");
    console.log(gapi.client);
    if (tokenResponse && tokenResponse.access_token) {
      //        setAccessToken(tokenResponse.access_token);
      /*        
      const docResponse = await gapi.client.docs.documents.create({
        title: "My Awesome Google Doc",
      });
      console.log("docs");
      console.log(docResponse);
*/
      const sheetResponse = await gapi.client.sheets.spreadsheets.create({
        properties: {
          title: "My Awesome Google Sheet",
        },
      });

      console.log("sheet");
      console.log(sheetResponse);

      const spreadsheetId = sheetResponse.result.spreadsheetId;
      console.log(spreadsheetId);
      const sheetUpdateParams = {
        spreadsheetId: spreadsheetId,
        range: "Sheet1!A1:D5",
        valueInputOption: "USER_ENTERED",
      };

      const sheetUpdateValueRangeBody = {
        range: "Sheet1!A1:D5",
        majorDimension: "ROWS",
        values: [
          ["Item", "Cost", "Stocked", "Ship Date"],
          ["Wheel", "$20.50", "4", "3/1/2016"],
          ["Door", "$15", "2", "3/15/2016"],
          ["Engine", "$100", "1", "3/20/2016"],
          ["Totals", "=SUM(B2:B4)", "=SUM(C2:C4)", "=MAX(D2:D4)"],
        ],
      };
      const sheetUpdateResponse =
        await gapi.client.sheets.spreadsheets.values.update(
          sheetUpdateParams,
          sheetUpdateValueRangeBody
        );

      console.log(sheetUpdateResponse);

      const sheetGetParams = {
        spreadsheetId: spreadsheetId,
        range: "Sheet1!A1:D5",
      };

      const sheetGetResponse = await gapi.client.sheets.spreadsheets.values.get(
        sheetGetParams
      );

      console.log(sheetGetResponse);
    }
  };

  tokenClient.callback = callbackFn;
  tokenClient.requestAccessToken();
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

doGoogleLogin();
