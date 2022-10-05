import { gapi } from "gapi-script";
import jwt_decode from "jwt-decode";

var GRAY_ICON =
  "https://cdn.hyperdev.com/us-east-1%3A3d31b21c-01a0-4da2-8827-4bc6e88b7618%2Ficon-gray.svg";
var WHITE_ICON =
  "https://cdn.hyperdev.com/us-east-1%3A3d31b21c-01a0-4da2-8827-4bc6e88b7618%2Ficon-white.svg";
var BLACK_ICON =
  "https://cdn.hyperdev.com/us-east-1%3A3d31b21c-01a0-4da2-8827-4bc6e88b7618%2Ficon-black.svg";

const onBtnClick = function (t, opts) {
  console.log("Someone clicked the button");
};

window.TrelloPowerUp.initialize({
  "card-badges": function (t, opts) {
    //    let cardAttachments = opts.attachments; // Trello passes you the attachments on the card
    return t.card("all").then(function (card) {
      return [
        {
          text: `card-badges example: ${card.idShort}`,
        },
      ];
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
        callback: onBtnClick,
        condition: "edit",
      },
      {
        // or we can also have a button that is just a simple url
        // clicking it will open a new tab at the provided url
        icon: {
          dark: WHITE_ICON,
          light: BLACK_ICON,
        },
        text: "URL",
        condition: "always",
        url: "https://trello.com/inspiration",
        target: "Inspiring Boards", // optional target for above url
      },
    ];
  },
  "attachment-sections": async function (t, options) {
    // options.entries is a list of the attachments for this card
    // you can look through them and 'claim' any that you want to
    // include in your section.

    const cardId = await t.card("all").then((card) => card.idShort);

    // we will just claim urls for Yellowstone
    var claimed = options.entries.filter(function (attachment) {
      return attachment.url.indexOf("http://www.nps.gov/yell/") === 0;
    });

    console.log(t);
    console.log("attachment claimed for card", cardId, claimed);

    // you can have more than one attachment section on a card
    // you can group items together into one section, have a section
    // per attachment, or anything in between.
    if (claimed && claimed.length > 0) {
      // if the title for your section requires a network call or other
      // potentially lengthy operation you can provide a function for the title
      // that returns the section title. If you do so, provide a unique id for
      // your section
      return [
        {
          id: "Yellowstone", // optional if you aren't using a function for the title
          claimed: claimed,
          icon: GRAY_ICON, // Must be a gray icon, colored icons not allowed.
          title: "attachment-section example",
          content: {
            type: "iframe",
            url: t.signUrl("./section.html", {
              arg: "you can pass your section args here",
            }),
            height: 400,
          },
        },
      ];
    } else {
      return [];
    }
  },
});

/**************
 * Google Crud
 **************/

const CLIENT_ID =
  "724763935854-n4srv5d0t7hahet7hh5ef3hg3sac4r4v.apps.googleusercontent.com";
const SCOPES = [
  "https://www.googleapis.com/auth/drive.file",
  "https://www.googleapis.com/auth/documents",
  "https://www.googleapis.com/auth/drive",
  "https://www.googleapis.com/auth/spreadsheets",
].join(" ");

let user = null;
let tokenClient = null;

const handleSignout = () => {
  user = {};
  document.getElementById("signInDiv").hidden = false;
};

const handleCallbackResponse = async (response) => {
  const credential = response.credential;

  user = jwt_decode(credential);

  document.getElementById("signInDiv").hidden = true;

  const client = google.accounts.oauth2.initTokenClient({
    client_id: CLIENT_ID,
    scope: SCOPES,
  });

  tokenClient = client;
};
